package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID                 uint
	Username           string `json:"userName"`
	Email              string `json:"email"`
	Password           string `json:"password"`
	DOB                string `json:"DOB"`
	Gender             string `json:"gender"`
	ProfilePicture     string `json:"profilePicture"`
	IsBanned           bool   `json:"isBanned"`
	Role               string `json:"role"`
	IsSubscribed       bool   `json:"isSubscribed"`
	PhoneNumber        string `json:"phoneNumber"`
	Address            string `json:"address"`
	PaymentMethod      int    `json:"paymentMethod"`
	Money              int    `json:"money"`
	CreditCards        []CreditCard
	Answers            []Answer
	CartTickets        []CartTicket
	CartHotels         []CartHotel
	Reviews            []Review
	TransactionTickets []TransactionTicket
	TransactionHotel   []TransactionHotel
	UsedPromos         []UsedPromo
}

type CreditCard struct {
	CardNumber string `json:"cardNumber"`
	CVV        string `json:"cvv"`
	Amount     int    `json:"amount"`
	UserID     uint   `json:"userID"`
	User       User   `gorm:"foreignKey:UserID"`
}

type Country struct {
	gorm.Model
	ID          uint
	CountryName string
	Cities      []City
}

type City struct {
	gorm.Model
	ID        uint
	CountryID uint
	Country   Country `gorm:"foreignKey:CountryID"`
	CityName  string
	Airports  []Airport
	Hotels    []Hotel
}

type Airport struct {
	AirportName string `gorm:"primaryKey;unique"`
	CityID      uint
	City        City `gorm:"foreignKey:CityID"`
}

type Airline struct {
	ID          string `gorm:"primaryKey"`
	AirlineName string
	Logo        string
	Airplanes   []Airplane
}

type Airplane struct {
	ID        string `gorm:"primaryKey;unique"`
	AirlineID string
	Airline   Airline `gorm:"foreignKey:AirlineID"`
	Seats     []Seat
	Flights   []Flight
}

type Seat struct {
	SeatNumber int    `gorm:"primaryKey"`
	AirplaneID string `gorm:"primaryKey"`
	Status     bool
	Airplane   Airplane `gorm:"foreignKey:AirplaneID"`
}

type Flight struct {
	ID                   uint `gorm:"primaryKey"`
	OriginAirportID      string
	OriginAirport        Airport `gorm:"foreignKey:OriginAirportID"`
	DestinationAirportID string
	DestinationAirport   Airport `gorm:"foreignKey:DestinationAirportID"`
	AirplaneID           string
	Airplane             Airplane `gorm:"foreignKey:AirplaneID"`
	TicketID             string
	Ticket               Ticket `gorm:"foreignKey:TicketID"`
	DepartureDate        time.Time
	ArrivalDate          time.Time
}

type Ticket struct {
	ID                 string `gorm:"primaryKey"`
	Price              int
	Flights            []Flight
	CartTicket         []CartTicket
	TransactionTickets []TransactionTicket
}

type Promo struct {
	gorm.Model
	ID        uint
	Picture   string `json:"picture"`
	PromoName string `json:"promoName"`
	PromoCode string `json:"promoCode"`
	Active    bool
}

type UsedPromo struct {
	UserID    uint   `gorm:"primaryKey"`
	User      User   `gorm:"foreignKey:UserID"`
	PromoCode string `gorm:"primaryKey"`
}

type TransactionTicket struct {
	ID                          uint `gorm:"primaryKey"`
	UserID                      uint
	User                        User `gorm:"foreignKey:UserID"`
	TicketID                    string
	Ticket                      Ticket `gorm:"foreignKey:TicketID"`
	TransactionDate             time.Time
	Quantity                    int
	TransactionSeatReservations []TransactionSeatReservation
	Status                      bool
	TotalPrice                  int
}

type CartTicket struct {
	ID                   uint `gorm:"primaryKey"`
	UserID               uint
	User                 User `gorm:"foreignKey:UserID"`
	TicketID             string
	Ticket               Ticket `gorm:"foreignKey:TicketID"`
	TotalPrice           int
	Quantity             int
	CartSeatReservations []CartSeatReservation
	Status               bool
}

type CartSeatReservation struct {
	ID           uint
	SeatNumber   int
	AirplaneCode string
	CartTicketID uint
	CartTicket   CartTicket `gorm:"foreignKey:CartTicketID"`
}

type TransactionSeatReservation struct {
	ID                  uint `gorm:"primaryKey"`
	SeatNumber          int
	AirplaneCode        string
	TransactionTicketID uint
	TransactionTicket   TransactionTicket `gorm:"foreignKey:TransactionTicketID"`
}

type Hotel struct {
	gorm.Model
	ID              uint
	HotelName       string  `json:"hotelName"`
	Description     string  `json:"description"`
	Address         string  `json:"address"`
	CityID          uint    `json:"cityID"`
	City            City    `gorm:"foreignKey:CityID"`
	Picture         string  `json:"picture"`
	AverageRating   float64 `json:"averageRating"`
	Reviews         []Review
	Rooms           []Room
	HotelFacilities []HotelFacility
}

type Review struct {
	gorm.Model
	ID          uint
	UserID      uint
	User        User `gorm:"foreignKey:UserID"`
	HotelID     uint
	Hotel       Hotel  `gorm:"foreignKey:HotelID"`
	Type        string `json:"type"`
	Comment     string `json:"comment"`
	Rating      int    `json:"rating"`
	IsAnonymous bool   `json:"isAnonymous"`
}

type Room struct {
	gorm.Model
	ID                uint
	HotelID           uint
	Hotel             Hotel  `gorm:"foreignKey:HotelID"`
	RoomType          string `json:"roomType"`
	PricePerDay       int    `json:"pricePreDay"`
	Picture           string `json:"picture"`
	CartHotels        []CartHotel
	TransactionHotels []TransactionHotel
	RoomFacilities    []RoomFacility
}

type CartHotel struct {
	gorm.Model
	ID        uint
	UserID    uint      `json:"userID"`
	User      User      `gorm:"foreignKey:UserID"`
	RoomID    uint      `json:"roomID"`
	Room      Room      `gorm:"foreignKey:RoomID"`
	Price     int       `json:"price"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Status    bool
}

type HotelFacility struct {
	HotelID           uint
	Hotel             Hotel             `gorm:"foreignKey:HotelID"`
	FacilityName      string            `json:"facilityName"`
	HotelFacilityType HotelFacilityType `gorm:"foreignKey:FacilityName"`
}

type HotelFacilityType struct {
	FacilityName string `gorm:"primaryKey"`
}

type RoomFacility struct {
	RoomID           uint
	Room             Room             `gorm:"foreignKey:RoomID"`
	FacilityName     string           `json:"facilityName"`
	RoomFacilityType RoomFacilityType `gorm:"foreignKey:FacilityName"`
}

type RoomFacilityType struct {
	FacilityName string `gorm:"primaryKey"`
}

type TransactionHotel struct {
	ID              uint `gorm:"primaryKey"`
	UserID          uint
	User            User `gorm:"foreignKey:UserID"`
	RoomID          uint
	Room            Room `gorm:"foreignKey:RoomID"`
	CheckInDate     time.Time
	CheckOutDate    time.Time
	TransactionDate time.Time
	Price           int
	Status          bool
}

type PersonalQuestion struct {
	gorm.Model
	ID       uint
	Question string
	Answers  []Answer
}

type Answer struct {
	gorm.Model
	ID                 uint
	PersonalQuestionID uint             `json:"personalQuestionID"`
	PersonalQuestion   PersonalQuestion `gorm:"foreignKey:PersonalQuestionID"`
	UserID             uint             `json:"userID"`
	User               User             `gorm:"foreignKey:UserID"`
	Answer             string           `json:"answer"`
}

func (h *Hotel) CalculateAverageRating() float64 {
	if len(h.Reviews) == 0 {
		return 0.0
	}

	totalRating := 0
	for _, review := range h.Reviews {
		totalRating += review.Rating
	}

	return float64(totalRating) / float64(len(h.Reviews))
}
