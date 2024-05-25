package controllers

import (
	"net/http"
	"sort"
	"time"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func getFlightDuration(flight *models.Ticket) time.Duration {
	departure := flight.Flights[0].DepartureDate
	arrival := flight.Flights[len(flight.Flights)-1].ArrivalDate
	duration := arrival.Sub(departure)
	return duration
}

func GetFlightByID(c *gin.Context) {
	id := c.Param("id")
	var flight models.Ticket
	database.DB.Preload("Flights").Preload("Flights.DestinationAirport.City.Country").Preload("Flights.OriginAirport.City.Country").Preload("Flights.Airplane.Airline").Preload("Flights.Airplane.Seats").First(&flight, "id = ?", id)

	if flight.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Flight not found",
		})
		return
	}

	c.JSON(http.StatusOK, flight)
}

// SORTING
type byFlightAttribute struct {
	Flights    []models.Ticket
	Comparator func(p1, p2 *models.Ticket) bool
}

func (b byFlightAttribute) Len() int {
	return len(b.Flights)
}
func (b byFlightAttribute) Less(i, j int) bool {
	return b.Comparator(&b.Flights[i], &b.Flights[j])
}
func (b byFlightAttribute) Swap(i, j int) {
	b.Flights[i], b.Flights[j] = b.Flights[j], b.Flights[i]
}

func GetFlights(c *gin.Context) {
	var body struct {
		MinPrice int
		MaxPrice int
		Transit  int
		Sort     int
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var flights []models.Ticket
	if err := database.DB.Preload("Flights").Preload("Flights.DestinationAirport.City.Country").Preload("Flights.OriginAirport.City.Country").Preload("Flights.Airplane.Airline").Preload("Flights.Airplane.Seats").Find(&flights).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var filteredFlights []models.Ticket
	for _, flight := range flights {
		var isTransit = false
		if len(flight.Flights) > 1 {
			isTransit = true
		} else {
			isTransit = false
		}
		if body.Transit == 1 {
			isTransit = !isTransit
		} else if body.Transit == 0 {
			isTransit = true
		}
		if flight.Price >= body.MinPrice && flight.Price <= body.MaxPrice && isTransit {
			filteredFlights = append(filteredFlights, flight)
		}
	}

	sortByShortestDuration := func(p1, p2 *models.Ticket) bool {
		return getFlightDuration(p1) < getFlightDuration(p2)
	}

	sortByLongestDuration := func(p1, p2 *models.Ticket) bool {
		return getFlightDuration(p1) > getFlightDuration(p2)
	}

	sortByLowestPrice := func(p1, p2 *models.Ticket) bool {
		return p1.Price < p2.Price
	}

	sortByHighestPrice := func(p1, p2 *models.Ticket) bool {
		return p1.Price > p2.Price
	}

	sortByFewestNumberOfTransit := func(p1, p2 *models.Ticket) bool {
		return len(p1.Flights) < len(p2.Flights)
	}

	sortByMostNumberOfTransit := func(p1, p2 *models.Ticket) bool {
		return len(p1.Flights) > len(p2.Flights)
	}

	if body.Sort == 1 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByShortestDuration})
	} else if body.Sort == 2 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByLongestDuration})
	} else if body.Sort == 3 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByLowestPrice})
	} else if body.Sort == 4 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByHighestPrice})
	} else if body.Sort == 5 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByFewestNumberOfTransit})
	} else if body.Sort == 6 {
		sort.Sort(byFlightAttribute{Flights: filteredFlights, Comparator: sortByMostNumberOfTransit})
	}

	c.JSON(http.StatusOK, filteredFlights)

}
