package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID                 uint
	Username           string  `json:"userName"`
	Email              string  `json:"email"`
	Password           string  `json:"password"`
	DOB                string  `json:"DOB"`
	Gender             string  `json:"gender"`
	ProfilePicture     *string `json:"profilePicture"`
	IsBanned           bool    `json:"isBanned"`
	Role               string  `json:"role"`
	IsSubscribed       bool    `json:"isSubscribed"`
	PhoneNumber        string  `json:"phoneNumber"`
	Address            string  `json:"address"`
	PaymentMethod      int     `json:"paymentMethod"`
	Money              int     `json:"money"`
	CreditCards        []CreditCard
	Answers            []Answer
	CartTickets        []CartTicket
	CartHotels         []CartHotel
	Reviews            []Review
	TransactionTickets []TransactionTicket
}

type CreditCard struct {
	gorm.Model
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
	gorm.Model
	ID          uint
	AirportName string
	CityID      uint
	City        City `gorm:"foreignKey:CityID"`
	Airline     []Airline
}

type Airline struct {
	gorm.Model
	ID          uint
	AirlineName string
	AirportID   uint
	Airport     Airport `gorm:"foreignKey:AirportID"`
	Airplanes   []Airplane
}

type Airplane struct {
	gorm.Model
	ID           uint
	AirplaneName string
	Status       string
	AirlineID    uint
	Airline      Airline `gorm:"foreignKey:AirlineID"`
	Capacity     int
	Seats        []Seat
	Flights      []Flight
}

type Seat struct {
	gorm.Model
	SeatNumber int `gorm:"primaryKey"`
	AirplaneID uint
	Airplane   Airplane `gorm:"foreignKey:AirplaneID"`
}

type Flight struct {
	gorm.Model
	ID                   uint
	FlightCode           string
	OriginAirportID      uint
	OriginAirport        Airport `gorm:"foreignKey:OriginAirportID"`
	DestinationAirportID uint
	DestinationAirport   Airport `gorm:"foreignKey:DestinationAirportID"`
	AirplaneID           uint
	Airplane             Airplane `gorm:"foreignKey:AirplaneID"`
	FlightName           string
	DepartureDate        time.Time
	Duration             int
	Tickets              []Ticket
}

type Ticket struct {
	gorm.Model
	ID                 uint
	Price              int
	NumberOfTransit    int
	Status             string
	ValidFrom          time.Time
	ValidTo            time.Time
	FlightID           uint
	Flight             Flight `gorm:"foreignKey:FlightID"`
	TransactionTickets []TransactionTicket
	CartTickets        []CartTicket
}

type Promo struct {
	gorm.Model
	ID               uint
	Picture          string
	PromoName        string
	PromoDescription string
}

type TransactionTicket struct {
	gorm.Model
	ID              uint
	UserID          uint
	User            User `gorm:"foreignKey:UserID"`
	TicketID        uint
	Ticket          Ticket `gorm:"foreignKey:TicketID"`
	TransactionDate time.Time
	Quantity        int
}

type CartTicket struct {
	gorm.Model
	UserID   uint
	User     User `gorm:"foreignKey:UserID"`
	TicketID uint
	Ticket   Ticket `gorm:"foreignKey:TicketID"`
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
	UserID    uint   `json:"userID"`
	User      User   `gorm:"foreignKey:UserID"`
	RoomID    uint   `json:"roomID"`
	Room      Room   `gorm:"foreignKey:RoomID"`
	Price     int    `json:"price"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
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
	gorm.Model
	ID              uint
	RoomID          uint
	Room            Room `gorm:"foreignKey:RoomID"`
	CheckInDate     time.Time
	CheckOutDate    time.Time
	TransactionDate time.Time
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
