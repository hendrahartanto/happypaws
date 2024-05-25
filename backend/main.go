package main

import (
	"fmt"

	"github.com/L0ckedkey/go_backend/controllers"
	"github.com/L0ckedkey/go_backend/database"
	_ "github.com/L0ckedkey/go_backend/docs"
	"github.com/L0ckedkey/go_backend/middleware"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/L0ckedkey/go_backend/seeds"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Tag Service API
// @version 1.0
// @host localhost:8080
// @BasePath /api
func main() {
	database.Connection()

	fmt.Print(database.DB)

	models.MigrateTables(&models.RoomFacilityType{}, &models.HotelFacilityType{}, &models.User{}, &models.CreditCard{}, &models.Country{}, &models.City{}, &models.Airport{},
		&models.Airline{}, &models.Airplane{}, &models.Seat{}, &models.Ticket{}, &models.Flight{}, &models.Promo{},
		&models.PersonalQuestion{}, &models.Answer{}, &models.TransactionTicket{}, &models.CartTicket{}, &models.CartSeatReservation{}, &models.TransactionSeatReservation{},
		&models.Hotel{}, &models.Review{}, &models.Room{}, &models.CartHotel{}, &models.HotelFacility{}, &models.RoomFacility{},
		&models.TransactionHotel{}, &models.UsedPromo{})
	seeds.Seed()

	r := gin.Default()
	middleware.InitCORS(r)
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	personalQuestion := r.Group("/personalquestion")
	{
		personalQuestion.GET("/getallpersonalquestion", controllers.GetAllPersonalQuestion)
	}

	user := r.Group("/user")
	{
		user.GET("/validateAuth", middleware.RequireAuth)
		user.POST("loginemail", controllers.ValidateLoginEmail)
		user.POST("/signup", controllers.ResigerUser)
		user.POST("/login", controllers.Login)
		user.POST("/validateotp", controllers.ValidateOTP)
		user.GET("/getalluser", controllers.GetAllUser)
		user.GET("/validate", controllers.Validate)
		user.GET("/profile", middleware.RequireAuth, controllers.Validate)
		user.GET("/removecookie", controllers.RemoveCookie)
		user.PUT("/updateuser/:id", controllers.UpdateUser)
		user.GET("/getuserbyemail/:email", controllers.GetUserByEmail)
		user.PUT("/updatepassword", controllers.UpdatePassword)
		user.POST("/loginemailwithotp", controllers.ValidateLoginEmailWithOTP)
		user.PUT("/getprice", controllers.GetPrice)
	}

	answer := r.Group("/answer")
	{
		answer.POST("/postanswer", controllers.PostAnswer)
		answer.POST("/validateanswer", controllers.ValidateAnswer)
	}

	hotel := r.Group("/hotel")
	{
		hotel.GET("/getallhotel", controllers.GetAllHotel)
		hotel.POST("/gethotels", controllers.GetHotels)
		hotel.POST("/createhotel", middleware.RequireAdmin, controllers.CreateHotel)
	}

	roomCart := r.Group("roomcart")
	{
		roomCart.POST("/postroomcart", middleware.RequireAuth, controllers.PostRoomCart)
	}

	creditCard := r.Group("creditcard")
	{
		creditCard.POST("/addcreditcard", controllers.AddCreditCard)
	}

	cart := r.Group("cart")
	{
		cart.GET("/getallhotelcart/:id", middleware.RequireAuth, controllers.GetAllHotelCart)
		cart.GET("/getallticketcart/:id", middleware.RequireAuth, controllers.GetAllTicketCart)
		cart.POST("/postticketcart", middleware.RequireAuth, controllers.PostTicketCart)
		cart.DELETE("/deletehotelcart/:id", controllers.DeleteHotelCart)
		cart.DELETE("/deleteticketcart/:id", controllers.DeleteTicketCart)
		cart.PUT("/updateroomcart", controllers.UpdateRoomCart)
	}

	flight := r.Group("flight")
	{
		flight.POST("/getflights", controllers.GetFlights)
		flight.GET("/getflightbyid/:id", controllers.GetFlightByID)
	}

	transaction := r.Group("transaction")
	{
		transaction.POST("/checkoutcart", middleware.RequireAuth, controllers.CheckoutCart)
		transaction.POST("/getongoinghoteltransactions", middleware.RequireAuth, controllers.GetOngoingHotelTransactions)
		transaction.POST("/getongoingtickettransactions", middleware.RequireAuth, controllers.GetOngoingTicketTransaction)
		transaction.POST("/gettickettransactions", middleware.RequireAuth, controllers.GetTicketTransactions)
		transaction.POST("/gethoteltransactions", middleware.RequireAuth, controllers.GetHotelTransactions)
	}

	review := r.Group("review")
	{
		review.POST("/postreview", middleware.RequireAuth, controllers.PostReview)
	}

	admin := r.Group("admin")
	{
		admin.GET("/getuserlist", middleware.RequireAdmin, controllers.GetAllUser)
		admin.PUT("/togglebanuser", middleware.RequireAdmin, controllers.ToggleBanUser)
		admin.POST("/sendbroadcast", middleware.RequireAdmin, controllers.SendBroadcast)
		admin.GET("/validate", middleware.RequireAdmin)
	}

	city := r.Group("city")
	{
		city.GET("getallcity", controllers.GetAllCity)
	}

	promo := r.Group("promo")
	{
		promo.GET("/getpromos", controllers.GetPromos)
		promo.GET("/getactivepromos", controllers.GetActivePromos)
		promo.GET("/getnonactivepromos", controllers.GetNonactivePromos)
		promo.POST("/addpromo", middleware.RequireAdmin, controllers.AddPromo)
		promo.PUT("/activatepromo", middleware.RequireAdmin, controllers.ActivatePromo)
		promo.PUT("/deactivatepromo", middleware.RequireAdmin, controllers.DeactivatePromo)
	}

	r.Run(":8080")

}
