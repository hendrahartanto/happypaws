package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func PostTicketCart(c *gin.Context) {
	var body struct {
		UserID        uint
		TicketID      string
		TotalPrice    int
		Quantity      int
		SeatNumbers   []int
		AirplaneCodes []string
		FlightNum     int
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(body.SeatNumbers) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seat is required"})
		return
	}

	if len(body.SeatNumbers) != body.Quantity*body.FlightNum {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Select seats according to the quantity you have determined"})
		return
	}

	for i, seatNumber := range body.SeatNumbers {
		airplaneCode := body.AirplaneCodes[i]

		var seat models.Seat
		result := database.DB.Where("seat_number = ? AND airplane_id = ?", seatNumber, airplaneCode).First(&seat)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		if seat.Status {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Seat is not available"})
			return
		}
	}

	var existingCart models.CartTicket
	result := database.DB.Where("user_id = ? AND ticket_id = ?",
		body.UserID, body.TicketID).
		Joins("JOIN cart_seat_reservations ON cart_tickets.ID = cart_seat_reservations.cart_ticket_id").
		Where("cart_seat_reservations.seat_number IN (?)", body.SeatNumbers).
		First(&existingCart)

	if result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Overlap with existing cart"})
		return
	}

	var newCartTicket models.CartTicket

	newCartTicket.UserID = body.UserID
	newCartTicket.TicketID = body.TicketID
	newCartTicket.TotalPrice = body.TotalPrice
	newCartTicket.Quantity = body.Quantity

	database.DB.Create(&newCartTicket)

	var allCart []models.CartTicket
	database.DB.Find(&allCart)

	var currID = newCartTicket.ID

	for i, seatNumber := range body.SeatNumbers {
		airplaneCode := body.AirplaneCodes[i]

		var newCartSeatReservation models.CartSeatReservation

		newCartSeatReservation.SeatNumber = seatNumber
		newCartSeatReservation.AirplaneCode = airplaneCode
		newCartSeatReservation.CartTicketID = currID

		database.DB.Create(&newCartSeatReservation)

	}

	c.JSON(http.StatusCreated, newCartTicket)

}

func PostRoomCart(c *gin.Context) {
	var body struct {
		StartDate string
		EndDate   string
		UserID    uint
		RoomID    uint
		Price     int
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.StartDate == "" || body.EndDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StartDate and EndDate cannot be empty"})
		return
	}

	startDate, err := time.Parse(time.RFC3339, body.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid StartDate format"})
		return
	}

	endDate, err := time.Parse(time.RFC3339, body.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EndDate format"})
		return
	}

	if startDate.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StartDate must be in the future"})
		return
	}

	if endDate.Before(startDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "EndDate must be equal or after StartDate"})
		return
	}

	if body.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Minimum duration must be atlesat 1 night"})
		return
	}

	if isDateRangeOverlap(body.UserID, body.RoomID, startDate, endDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The selected date range overlaps with your existing cart"})
		return
	}

	var newRoomCart models.CartHotel

	newRoomCart.StartDate = startDate
	newRoomCart.EndDate = endDate
	newRoomCart.UserID = body.UserID
	newRoomCart.RoomID = body.RoomID
	newRoomCart.Price = body.Price

	database.DB.Create(&newRoomCart)

	c.JSON(http.StatusCreated, newRoomCart)
}

func GetAllHotelCart(c *gin.Context) {
	userID := c.Param("id")

	fmt.Println(userID)

	var hotelCart []models.CartHotel
	result := database.DB.Where("user_id = ?", userID).Preload("Room.RoomFacilities").Find(&hotelCart)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.AsciiJSON(http.StatusOK, hotelCart)
}

func GetAllTicketCart(c *gin.Context) {
	userID := c.Param("id")

	var ticketCarts []models.CartTicket
	result := database.DB.Where("user_id = ?", userID).Preload("CartSeatReservations").Preload("Ticket").Preload("Ticket.Flights").Preload("Ticket.Flights.DestinationAirport.City.Country").Preload("Ticket.Flights.OriginAirport.City.Country").Preload("Ticket.Flights.Airplane.Airline").Preload("Ticket.Flights.Airplane.Seats").Find(&ticketCarts)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.JSON(http.StatusOK, ticketCarts)
}

func DeleteHotelCart(c *gin.Context) {
	id := c.Param("id")

	var hotelCart models.CartHotel
	if err := database.DB.First(&hotelCart, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cartHotel not found"})
		return
	}

	if err := database.DB.Delete(&hotelCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func isDateRangeOverlap(userID uint, roomID uint, startDate time.Time, endDate time.Time) bool {
	var existingBookings []models.CartHotel

	database.DB.Where("user_id = ? AND room_id = ? AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))", userID, roomID, startDate, startDate, endDate, endDate).Find(&existingBookings)

	return len(existingBookings) > 0
}

func DeleteTicketCart(c *gin.Context) {
	id := c.Param("id")

	var ticketCart models.CartTicket
	if err := database.DB.Preload("CartSeatReservations").First(&ticketCart, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "CartTicket not found"})
		return
	}

	if err := database.DB.Delete(&ticketCart.CartSeatReservations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete associated CartSeatReservations"})
		return
	}

	if err := database.DB.Delete(&ticketCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete CartTicket"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func UpdateRoomCart(c *gin.Context) {
	var body struct {
		StartDate  string
		EndDate    string
		UserID     uint
		RoomCartID uint
		RoomID     uint
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.StartDate == "" || body.EndDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StartDate and EndDate cannot be empty"})
		return
	}

	startDate, err := time.Parse(time.RFC3339, body.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid StartDate format"})
		return
	}

	endDate, err := time.Parse(time.RFC3339, body.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EndDate format"})
		return
	}

	if startDate.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StartDate must be in the future"})
		return
	}

	if endDate.Before(startDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "EndDate must be equal or after StartDate"})
		return
	}

	var room models.Room
	database.DB.First(&room, body.RoomID)

	dayCount := endDate.Sub(startDate).Hours() / 24
	var Price = dayCount * float64(room.PricePerDay)

	if Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Minimum duration must be atlesat 1 night"})
		return
	}

	var roomCart models.CartHotel
	if err := database.DB.First(&roomCart, body.RoomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	roomCart.StartDate = startDate
	roomCart.EndDate = endDate
	roomCart.Price = int(Price)

	database.DB.Save(&roomCart)

	c.JSON(http.StatusOK, roomCart)

}
