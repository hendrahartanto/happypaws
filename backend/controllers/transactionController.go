package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func createHotelTransaction(cartHotel models.CartHotel) {
	var newTransactionHotel models.TransactionHotel
	newTransactionHotel.TransactionDate = time.Now()
	newTransactionHotel.UserID = cartHotel.UserID
	newTransactionHotel.RoomID = cartHotel.RoomID
	newTransactionHotel.CheckInDate = cartHotel.StartDate
	newTransactionHotel.CheckOutDate = cartHotel.EndDate
	newTransactionHotel.Price = cartHotel.Price

	database.DB.Create(&newTransactionHotel)

	var hotelCart models.CartHotel
	database.DB.First(&hotelCart, cartHotel.ID)
	database.DB.Delete(&hotelCart)
}

func createTicketTransaction(cartTicket models.CartTicket) {
	var newTransactionTicket models.TransactionTicket
	newTransactionTicket.TransactionDate = time.Now()
	newTransactionTicket.UserID = cartTicket.UserID
	newTransactionTicket.TicketID = cartTicket.TicketID
	newTransactionTicket.Quantity = cartTicket.Quantity
	newTransactionTicket.TotalPrice = cartTicket.TotalPrice

	database.DB.Create(&newTransactionTicket)

	var currID = newTransactionTicket.ID

	for _, seat := range cartTicket.CartSeatReservations {
		var newTransactionSeatReservation models.TransactionSeatReservation
		newTransactionSeatReservation.AirplaneCode = seat.AirplaneCode
		newTransactionSeatReservation.SeatNumber = seat.SeatNumber
		newTransactionSeatReservation.TransactionTicketID = currID
		database.DB.Create(&newTransactionSeatReservation)
	}

	var ticketCart models.CartTicket

	database.DB.Preload("CartSeatReservations").First(&ticketCart, cartTicket.ID)

	for _, reservation := range ticketCart.CartSeatReservations {
		database.DB.Model(&models.Seat{}).
			Where("airplane_id = ? AND seat_number = ?", reservation.AirplaneCode, reservation.SeatNumber).
			Update("status", true)
	}

	database.DB.Delete(&ticketCart.CartSeatReservations)
	database.DB.Delete(&ticketCart)
}

func CheckoutCart(c *gin.Context) {
	var body struct {
		UserID        uint
		TotalPrice    int
		PaymentMethod uint
		CartHotels    []models.CartHotel
		CartTickets   []models.CartTicket
		PromoCode     string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, cartHotel := range body.CartHotels {
		if !cartHotel.Status {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Can't checkout expired item"})
			return
		}
	}

	for _, cartTicket := range body.CartTickets {
		if !cartTicket.Status {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Can't checkout expired item"})
			return
		}
	}

	var found = false

	if body.PromoCode != "" {
		var usedPromoo models.UsedPromo
		database.DB.First(&usedPromoo, "user_id = ? AND promo_code = ?", body.UserID, body.PromoCode)

		fmt.Println(usedPromoo)

		if usedPromoo.UserID != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "This promo code can only be used once"})
			return
		}
		var promoCodes []models.Promo
		database.DB.Find(&promoCodes)
		for _, promo := range promoCodes {
			fmt.Println(body.PromoCode)
			fmt.Println(promo.PromoCode)
			if promo.PromoCode == body.PromoCode {
				//DISCOUNTED
				body.TotalPrice -= int(float64(body.TotalPrice) * 0.1)
				found = true

				var usedPromo models.UsedPromo
				usedPromo.PromoCode = promo.PromoCode
				usedPromo.UserID = body.UserID

				database.DB.Create(&usedPromo)
				break
			}
		}
		if !found {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Promo code is not valid"})
			return
		}
	}

	var user models.User
	database.DB.Preload("CreditCards").First(&user, "id = ?", body.UserID)
	if body.PaymentMethod == 0 {
		if user.Money < body.TotalPrice {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insuficient HI-Wallet amount"})
			return
		}
		database.DB.Model(&user).Update("money", user.Money-body.TotalPrice)
	} else {
		if user.CreditCards[0].Amount < body.TotalPrice {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insuficient credit card amount"})
			return
		}
		database.DB.Model(&user.CreditCards[0]).Update("amount", user.CreditCards[0].Amount-body.TotalPrice)
	}

	var emailBody = fmt.Sprintf("Thankyou for purchasing, Total Amount: Rp. %d\n", body.TotalPrice)

	for _, cartHotel := range body.CartHotels {
		emailBody = fmt.Sprintf("%sHotel room: %s\n", emailBody, cartHotel.Room.RoomType)
		createHotelTransaction(cartHotel)
	}

	for _, cartTicket := range body.CartTickets {
		for _, seat := range cartTicket.CartSeatReservations {
			emailBody = fmt.Sprintf("%sPlane Code: %s Seat Number: %d\n", emailBody, seat.AirplaneCode, seat.SeatNumber)
		}
		createTicketTransaction(cartTicket)
	}

	SendEmail("Transaction Detail at TraveloHI", emailBody, user.Email)

}

func setTicketTransactionStatus() {
	var transactionTickets []models.TransactionTicket
	database.DB.Preload("Ticket.Flights").Find(&transactionTickets)

	for _, ticket := range transactionTickets {
		if ticket.Ticket.Flights[0].DepartureDate.Before(time.Now()) {
			ticket.Status = false
		} else {
			ticket.Status = true
		}
		database.DB.Save(&ticket)
	}
}

func setHotelTransactionStatus() {
	var transactionHotels []models.TransactionHotel

	database.DB.Find(&transactionHotels)

	for _, hotel := range transactionHotels {
		if hotel.CheckInDate.Before(time.Now()) {
			hotel.Status = false
		} else {
			hotel.Status = true
		}
		database.DB.Save(&hotel)
	}
}

func CreateHotelTransaction(c *gin.Context) {
}

func CreateTicketTransaction(c *gin.Context) {

}

func GetOngoingHotelTransactions(c *gin.Context) {
	var body struct {
		UserID uint
	}

	setHotelTransactionStatus()

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var hotels []models.TransactionHotel

	result := database.DB.Where("user_id = ? AND status = ?", body.UserID, true).Preload("Room.RoomFacilities").Find(&hotels)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.JSON(http.StatusOK, hotels)
}

func GetOngoingTicketTransaction(c *gin.Context) {
	var body struct {
		UserID uint
	}

	setTicketTransactionStatus()

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var tickets []models.TransactionTicket

	result := database.DB.Where("user_id = ? AND status = ?", body.UserID, true).Preload("TransactionSeatReservations").Preload("Ticket").Preload("Ticket.Flights").Preload("Ticket.Flights.DestinationAirport.City.Country").Preload("Ticket.Flights.OriginAirport.City.Country").Preload("Ticket.Flights.Airplane.Airline").Preload("Ticket.Flights.Airplane.Seats").Find(&tickets)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.JSON(http.StatusOK, tickets)
}

func GetHotelTransactions(c *gin.Context) {
	var body struct {
		UserID uint
	}

	setHotelTransactionStatus()

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var hotels []models.TransactionHotel

	result := database.DB.Where("user_id = ?", body.UserID).Preload("Room.RoomFacilities").Find(&hotels)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.JSON(http.StatusOK, hotels)
}

func GetTicketTransactions(c *gin.Context) {
	var body struct {
		UserID uint
	}

	setTicketTransactionStatus()

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var tickets []models.TransactionTicket

	result := database.DB.Where("user_id = ?", body.UserID).Preload("TransactionSeatReservations").Preload("Ticket").Preload("Ticket.Flights").Preload("Ticket.Flights.DestinationAirport.City.Country").Preload("Ticket.Flights.OriginAirport.City.Country").Preload("Ticket.Flights.Airplane.Airline").Preload("Ticket.Flights.Airplane.Seats").Find(&tickets)

	if result.Error != nil {
		c.AsciiJSON(http.StatusOK, nil)
		return
	}

	c.JSON(http.StatusOK, tickets)
}
