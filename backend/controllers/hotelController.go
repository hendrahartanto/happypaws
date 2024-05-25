package controllers

import (
	"fmt"
	"net/http"
	"sort"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func GetAllHotel(c *gin.Context) {
	var hotels []models.Hotel
	if err := database.DB.Preload("Reviews").Preload("Reviews.User").Preload("City.Country").Preload("HotelFacilities").
		Preload("Rooms").Preload("Rooms.RoomFacilities").
		Find(&hotels).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := range hotels {
		hotels[i].AverageRating = hotels[i].CalculateAverageRating()
	}

	c.JSON(http.StatusOK, hotels)
}

// SORTING
type byHotelAttribute struct {
	Hotels     []models.Hotel
	Comparator func(p1, p2 *models.Hotel) bool
}

func (b byHotelAttribute) Len() int {
	return len(b.Hotels)
}
func (b byHotelAttribute) Less(i, j int) bool {
	return b.Comparator(&b.Hotels[i], &b.Hotels[j])
}
func (b byHotelAttribute) Swap(i, j int) {
	b.Hotels[i], b.Hotels[j] = b.Hotels[j], b.Hotels[i]
}

func GetHotels(c *gin.Context) {
	var body struct {
		MinRating  float64
		MaxRating  float64
		Facilities []string
		MinPrice   int
		MaxPrice   int
		Sort       int
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var hotels []models.Hotel
	if err := database.DB.Preload("Reviews").Preload("Reviews.User").Preload("City.Country").Preload("HotelFacilities").Preload("Rooms").Preload("Rooms.RoomFacilities").Find(&hotels).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := range hotels {
		hotels[i].AverageRating = hotels[i].CalculateAverageRating()

	}

	fmt.Println(len(hotels))

	var filteredHotels []models.Hotel
	for _, hotel := range hotels {
		var validFacility = 0
		var facilitiesIsValid = false
		for _, facility := range hotel.HotelFacilities {
			if validFacility == len(body.Facilities) {
				facilitiesIsValid = true
				break
			}
			for _, filterFacility := range body.Facilities {
				if facility.FacilityName == filterFacility {
					validFacility = validFacility + 1
					break
				}
			}
		}
		if hotel.AverageRating >= body.MinRating && hotel.AverageRating <= body.MaxRating && facilitiesIsValid && hotel.Rooms[0].PricePerDay >= body.MinPrice && hotel.Rooms[0].PricePerDay <= body.MaxPrice {
			filteredHotels = append(filteredHotels, hotel)
		}
	}

	sortByLowestPrice := func(p1, p2 *models.Hotel) bool {
		return p1.Rooms[0].PricePerDay < p2.Rooms[0].PricePerDay
	}

	sortByHighestPrice := func(p1, p2 *models.Hotel) bool {
		return p1.Rooms[0].PricePerDay > p2.Rooms[0].PricePerDay
	}

	sortByHighestRating := func(p1, p2 *models.Hotel) bool {
		return int(p1.AverageRating) > int(p2.AverageRating)
	}

	sortByLowestNumberOfReviews := func(p1, p2 *models.Hotel) bool {
		return len(p1.Reviews) < len(p2.Reviews)
	}

	sortByHighestNumberOfReviews := func(p1, p2 *models.Hotel) bool {
		return len(p1.Reviews) > len(p2.Reviews)
	}

	if body.Sort == 1 {
		sort.Sort(byHotelAttribute{Hotels: filteredHotels, Comparator: sortByLowestPrice})
	} else if body.Sort == 2 {
		sort.Sort(byHotelAttribute{Hotels: filteredHotels, Comparator: sortByHighestPrice})
	} else if body.Sort == 3 {
		sort.Sort(byHotelAttribute{Hotels: filteredHotels, Comparator: sortByHighestRating})
	} else if body.Sort == 4 {
		sort.Sort(byHotelAttribute{Hotels: filteredHotels, Comparator: sortByLowestNumberOfReviews})
	} else if body.Sort == 5 {
		sort.Sort(byHotelAttribute{Hotels: filteredHotels, Comparator: sortByHighestNumberOfReviews})
	}

	c.JSON(http.StatusOK, filteredHotels)
}

func CreateHotel(c *gin.Context) {
	var body struct {
		HotelName   string
		Description string
		Address     string
		CityID      uint
		Picture     string
		Facilities  []string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.HotelName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel name is required",
		})
		return
	}

	var allHotel []models.Hotel
	database.DB.Find(&allHotel)

	for _, hotel := range allHotel {
		if hotel.HotelName == body.HotelName {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Hotel name already taken",
			})
			return
		}
	}

	if body.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel desciprtion is required",
		})
		return
	}

	if body.Address == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel address is required",
		})
		return
	}

	if body.CityID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "City location is required",
		})
		return
	}

	if body.Picture == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel picture is required",
		})
		return
	}

	if len(body.Facilities) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Select at least 1 facility",
		})
		return
	}

	var newHotel models.Hotel
	newHotel.HotelName = body.HotelName
	newHotel.Description = body.Description
	newHotel.Address = body.Address
	newHotel.CityID = body.CityID
	newHotel.Picture = body.Picture

	database.DB.Create(&newHotel)

	for _, facilityName := range body.Facilities {
		var hotelFacility models.HotelFacility
		hotelFacility.FacilityName = facilityName
		hotelFacility.HotelID = newHotel.ID
		database.DB.Create(&hotelFacility)
	}

	var room models.Room
	room.HotelID = newHotel.ID
	room.RoomType = "Traveller City View"
	room.PricePerDay = 200000
	room.Picture = "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel1_room1.webp?alt=media&token=a3dad43a-b4f6-47b3-b970-5cd3639c90c3"
	database.DB.Create(&room)

	var roomFacility models.RoomFacility
	roomFacility.RoomID = room.ID
	roomFacility.FacilityName = "Shower"
	database.DB.Create(&roomFacility)

	c.JSON(http.StatusOK, newHotel)

}
