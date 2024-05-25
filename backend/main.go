package main

import (
	"fmt"

	"github.com/L0ckedkey/go_backend/controllers"
	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/middleware"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/L0ckedkey/go_backend/seeds"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connection()

	fmt.Print(database.DB)

	models.MigrateTables(&models.RoomFacilityType{}, &models.HotelFacilityType{}, &models.User{}, &models.CreditCard{}, &models.Country{}, &models.City{}, &models.Airport{},
		&models.Airline{}, &models.Airplane{}, &models.Seat{}, &models.Flight{}, &models.Ticket{}, &models.Promo{},
		&models.PersonalQuestion{}, &models.Answer{}, &models.TransactionTicket{}, &models.CartTicket{},
		&models.Hotel{}, &models.Review{}, &models.Room{}, &models.CartHotel{}, &models.HotelFacility{}, &models.RoomFacility{},
		&models.TransactionHotel{})
	seeds.Seed()

	r := gin.Default()
	middleware.InitCORS(r)

	personalQuestion := r.Group("/personalquestion")
	{
		personalQuestion.GET("/getallpersonalquestion", controllers.GetAllPersonalQuestion)
	}

	user := r.Group("/user")
	{
		user.POST("/signup", controllers.ResigerUser)
		user.POST("/login", controllers.Login)
		user.GET("/getalluser", controllers.GetAllUser)
		user.GET("/validate", controllers.Validate)
		user.GET("/profile", middleware.RequireAuth, controllers.Validate)
		user.GET("/removecookie", controllers.RemoveCookie)
		user.PUT("/updateuser/:id", controllers.UpdateUser)
	}

	answer := r.Group("/answer")
	{
		answer.POST("/postanswer", controllers.PostAnswer)
	}

	hotel := r.Group("/hotel")
	{
		hotel.GET("/getallhotel", controllers.GetAllHotel)
	}

	roomCart := r.Group("roomcart")
	{
		roomCart.POST("/postroomcart", controllers.PostRoomCart)
	}

	creditCard := r.Group("creditcard")
	{
		creditCard.POST("/addcreditcard", controllers.AddCreditCard)
	}

	cart := r.Group("cart")
	{
		cart.GET("/getallhotelcart/:id", middleware.RequireAuth, controllers.GetAllHotelCart)
		cart.DELETE("deletehotelcart/:id", controllers.DeleteHotelCart)
	}

	r.Run(":8080")
	fmt.Println(r)

}
