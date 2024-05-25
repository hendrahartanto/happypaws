package seeds

import (
	"time"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
)

func Seed() {
	personalQuestions := []models.PersonalQuestion{
		{
			Question: "What is your favorite childhood pet's name?",
		},
		{
			Question: "In which city where you born?",
		},
		{
			Question: "What is the name of your favorite book or movie?",
		},
		{
			Question: "What is the name of the elementary school you attended?",
		},
		{
			Question: "What is the model of your first car?",
		},
	}

	countries := []models.Country{
		{
			CountryName: "Indonesia",
		},
		{
			CountryName: "Malaysia",
		},
		{
			CountryName: "Singapore",
		},
	}

	cities := []models.City{
		{
			CountryID: 1,
			CityName:  "Bali",
		},
		{
			CountryID: 1,
			CityName:  "Yogyakarta",
		},
		{
			CountryID: 1,
			CityName:  "Pekanbaru",
		},
		{
			CountryID: 1,
			CityName:  "Jakarta",
		},
		{
			CountryID: 1,
			CityName:  "Palembang",
		},
		{
			CountryID: 1,
			CityName:  "Surabaya",
		},
		{
			CountryID: 1,
			CityName:  "Makassar",
		},
		{
			CountryID: 2,
			CityName:  "Penang",
		},
		{
			CountryID: 2,
			CityName:  "Kuala Lumpur",
		},
		{
			CountryID: 2,
			CityName:  "Johor Bahru",
		},
		{
			CountryID: 3,
			CityName:  "Singapore",
		},
	}

	users := []models.User{
		{
			Username:       "Hendra Hartanto",
			Email:          "hendrazhuo10@gmail.com",
			Password:       "123123123",
			DOB:            "2004-04-26",
			Gender:         "male",
			ProfilePicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fanonymous.png?alt=media&token=706538a7-0c32-47d7-99b2-351a6ba7b8c4",
			IsBanned:       false,
			Role:           "user",
			IsSubscribed:   true,
			PhoneNumber:    "088271078250",
			Address:        "Jl. Kulim No. 70A",
			PaymentMethod:  0,
			Money:          10000000,
		},
		{
			Username:       "Admin",
			Email:          "hendrazhuo60@gmail.com",
			Password:       "123123123",
			DOB:            "2004-04-26",
			Gender:         "male",
			ProfilePicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fanonymous.png?alt=media&token=706538a7-0c32-47d7-99b2-351a6ba7b8c4",
			IsBanned:       false,
			Role:           "admin",
			IsSubscribed:   false,
			PhoneNumber:    "088271078250",
			Address:        "Jl. Kulim No. 70A",
			PaymentMethod:  0,
			Money:          10000000,
		},
	}

	answers := []models.Answer{
		{
			PersonalQuestionID: 2,
			UserID:             1,
			Answer:             "pekanbaru",
		},
	}

	hoteFacilityTypes := []models.HotelFacilityType{
		{
			FacilityName: "AC",
		},
		{
			FacilityName: "Swimming Pool",
		},
		{
			FacilityName: "Parking",
		},
		{
			FacilityName: "Elevator",
		},
		{
			FacilityName: "WiFi",
		},
		{
			FacilityName: "24-Hour Front Desk",
		},
		{
			FacilityName: "Restaurant",
		},
	}

	roomFacilityTypes := []models.RoomFacilityType{
		{
			FacilityName: "Shower",
		},
		{
			FacilityName: "Air Conditioning",
		},
		{
			FacilityName: "Seating Area",
		},
		{
			FacilityName: "Balcony",
		},
		{
			FacilityName: "Hot Water",
		},
		{
			FacilityName: "Bathtub",
		},
		{
			FacilityName: "Separate Dining Area",
		},
		{
			FacilityName: "24-Hour Front Desk",
		},
		{
			FacilityName: "Wheel Chair Access",
		},
		{
			FacilityName: "Refrigerator",
		},
	}

	hotels := []models.Hotel{
		{
			HotelName:   "Hadi Poetra Hotel",
			Description: "Hadi Poetra Hotel is highly recommended for backpackers who want to get an affordable stay yet comfortable at the same time. For you, travelers who wish to travel comfortably on a budget, Hadi Poetra Hotel is the perfect place to stay that provides decent facilities as well as great services. This hotel is the perfect choice for couples seeking a romantic getaway or a honeymoon retreat. Enjoy the most memorable nights with your loved one by staying at Hadi Poetra Hotel.",
			Address:     "Jalan Raya Kuta No.323 , Kuta Badung- Bali , Kuta, Badung, Bali, Indonesia, 80361",
			CityID:      1,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel1.webp?alt=media&token=afea371b-b804-47b4-a921-bcc7249b6bcb",
		},
		{
			HotelName:   "Allstay Ecotel Yogyakarta",
			Description: "Allstay Ecotel Yogyakarta is highly recommended for backpackers who want to get an affordable stay yet comfortable at the same time.",
			Address:     "Jalan Wahid Hasyim No 41, Depok, Yogyakarta, Yogyakarta Province, Indonesia, 55281",
			CityID:      2,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel2.webp?alt=media&token=5dfcf141-fb72-4fcc-9df9-a97ac5c8eaae",
		},
		{
			HotelName:   "The Zuri Pekanbaru",
			Description: "The Zuri Pekanbaru is a hotel near Airport, an ideal accommodation while waiting for your next flight. Enjoy a satisfying place to rest during your transit.",
			Address:     "Jalan Soekarno Hatta, Kompleks Transmart, Payung Sekaki, Pekanbaru, Riau, Indonesia, 28292",
			CityID:      3,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel3.webp?alt=media&token=760c2b24-f1ec-430a-898b-d58690c04836",
		},
	}

	hotelFacilities := []models.HotelFacility{
		{
			HotelID:      1,
			FacilityName: "AC",
		},
		{
			HotelID:      1,
			FacilityName: "Swimming Pool",
		},
		{
			HotelID:      1,
			FacilityName: "24-Hour Front Desk",
		},
		{
			HotelID:      1,
			FacilityName: "Parking",
		},
		{
			HotelID:      1,
			FacilityName: "Elevator",
		},
		{
			HotelID:      2,
			FacilityName: "AC",
		},
		{
			HotelID:      2,
			FacilityName: "Restaurant",
		},
		{
			HotelID:      2,
			FacilityName: "24-Hour Front Desk",
		},
		{
			HotelID:      2,
			FacilityName: "Parking",
		},
		{
			HotelID:      2,
			FacilityName: "Elevator",
		},
		{
			HotelID:      2,
			FacilityName: "WiFi",
		},
		{
			HotelID:      3,
			FacilityName: "AC",
		},
		{
			HotelID:      3,
			FacilityName: "Swimming Pool",
		},
		{
			HotelID:      3,
			FacilityName: "24-Hour Front Desk",
		},
		{
			HotelID:      3,
			FacilityName: "Parking",
		},
		{
			HotelID:      3,
			FacilityName: "Elevator",
		},
		{
			HotelID:      3,
			FacilityName: "WiFi",
		},
		{
			HotelID:      3,
			FacilityName: "Restaurant",
		},
	}

	rooms := []models.Room{
		{
			HotelID:     1,
			RoomType:    "Traveller City View",
			PricePerDay: 338400,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel1_room1.webp?alt=media&token=a3dad43a-b4f6-47b3-b970-5cd3639c90c3",
		},
		{
			HotelID:     1,
			RoomType:    "Multiple Beds Twin Superior Double",
			PricePerDay: 379999,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel1_room2.webp?alt=media&token=79a67e79-8491-4727-808b-f42169d06aa9",
		},
		{
			HotelID:     1,
			RoomType:    "Traveller Pool Access",
			PricePerDay: 456000,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel1_room3.webp?alt=media&token=e3a171ba-8597-479f-adfd-5732fca2cf03",
		},
		{
			HotelID:     2,
			RoomType:    "Superior",
			PricePerDay: 251215,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel2_room1.webp?alt=media&token=ae49e650-0293-4979-8cea-088f14f34690",
		},
		{
			HotelID:     2,
			RoomType:    "Deluxe",
			PricePerDay: 284271,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel2_room2.webp?alt=media&token=88269eaf-1491-4c2c-86fc-76057f622b1d",
		},
		{
			HotelID:     2,
			RoomType:    "Suite Standard",
			PricePerDay: 594985,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel2_room3.webp?alt=media&token=4b0c0bcc-74f2-43e0-9164-76f806eaa38d",
		},
		{
			HotelID:     3,
			RoomType:    "Superior Twin",
			PricePerDay: 583331,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel3_room1.webp?alt=media&token=e1b292b8-6ac2-4c92-b897-922111ad8b1b",
		},
		{
			HotelID:     3,
			RoomType:    "Supeiror Double",
			PricePerDay: 709298,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel3_room2.webp?alt=media&token=376ac225-8dfd-46a5-9558-2ab5d07deb53",
		},
		{
			HotelID:     3,
			RoomType:    "Deluxe Double",
			PricePerDay: 816736,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel3_room3.webp?alt=media&token=b0f5edf2-d652-4553-a5a3-a76d3bf1eb90",
		},
		{
			HotelID:     3,
			RoomType:    "Junior Suite",
			PricePerDay: 1643182,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fhotel3_room4.webp?alt=media&token=bcd8497e-5a5b-4668-b755-84c1bf7ec981",
		},
	}

	roomFacilities := []models.RoomFacility{
		{
			RoomID:       1,
			FacilityName: "Shower",
		},
		{
			RoomID:       1,
			FacilityName: "Seating Area",
		},
		{
			RoomID:       1,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       2,
			FacilityName: "Shower",
		},
		{
			RoomID:       2,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       3,
			FacilityName: "Shower",
		},
		{
			RoomID:       3,
			FacilityName: "Balcony",
		},
		{
			RoomID:       3,
			FacilityName: "Seating Area",
		},
		{
			RoomID:       3,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       4,
			FacilityName: "Shower",
		},
		{
			RoomID:       4,
			FacilityName: "Wheel Chair Access",
		},
		{
			RoomID:       4,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       5,
			FacilityName: "Shower",
		},
		{
			RoomID:       5,
			FacilityName: "Wheel Chair Access",
		},
		{
			RoomID:       5,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       6,
			FacilityName: "Shower",
		},
		{
			RoomID:       6,
			FacilityName: "Wheel Chair Access",
		},
		{
			RoomID:       6,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       7,
			FacilityName: "Shower",
		},
		{
			RoomID:       7,
			FacilityName: "Refrigerator",
		},
		{
			RoomID:       7,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       8,
			FacilityName: "Shower",
		},
		{
			RoomID:       8,
			FacilityName: "Refrigerator",
		},
		{
			RoomID:       8,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       9,
			FacilityName: "Shower",
		},
		{
			RoomID:       9,
			FacilityName: "Refrigerator",
		},
		{
			RoomID:       9,
			FacilityName: "Air Conditioning",
		},
		{
			RoomID:       10,
			FacilityName: "Shower",
		},
		{
			RoomID:       10,
			FacilityName: "Refrigerator",
		},
		{
			RoomID:       10,
			FacilityName: "Air Conditioning",
		},
	}

	reviews := []models.Review{
		{
			UserID:      1,
			HotelID:     1,
			Type:        "Cleanliness",
			Rating:      8,
			Comment:     "Kamarnya lumayan bersih, toiletnya juga",
			IsAnonymous: true,
		},
		{
			UserID:      1,
			HotelID:     1,
			Type:        "Comfort",
			Rating:      10,
			Comment:     "Kasurnya empuk banget",
			IsAnonymous: true,
		},
		{
			UserID:      1,
			HotelID:     1,
			Type:        "Location",
			Rating:      7,
			Comment:     "Lokasinya lumayan strategis",
			IsAnonymous: true,
		},
		{
			UserID:      1,
			HotelID:     1,
			Type:        "Service",
			Rating:      7,
			Comment:     "Staffnya ramah dan baik",
			IsAnonymous: true,
		},
	}

	promos := []models.Promo{
		{
			Picture:   "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fpromo1.png.webp?alt=media&token=2f817abe-336e-445e-ac65-362d295a9f9b",
			PromoName: "Lunary New Year Promo",
			PromoCode: "ABC123",
			Active:    true,
		},
		{
			Picture:   "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fpromo2.png.webp?alt=media&token=abf2fbcb-eb35-4ce3-a9e0-7d6c5c27c325",
			PromoName: "Ramadhan Promo",
			PromoCode: "123132",
			Active:    true,
		},
		{
			Picture:   "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fpromo3.webp?alt=media&token=db308bd5-4b7f-4a64-b30e-e960d90f4bc9",
			PromoName: "Flash Sale Promo",
			PromoCode: "ABCDEF",
			Active:    true,
		},
		{
			Picture:   "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fpromo4.webp?alt=media&token=cdca6157-d08d-4277-9b00-ade3e7eac532",
			PromoName: "Birthday Promo",
			PromoCode: "123ABC",
			Active:    true,
		},
	}

	airports := []models.Airport{
		{
			AirportName: "Soekarno Hatta International Airport",
			CityID:      4,
		},
		{
			AirportName: "Ngurah Rai International Airport",
			CityID:      1,
		},
		{
			AirportName: "Sultan Syarif Kasim II",
			CityID:      3,
		},
		{
			AirportName: "Kuala Lumpur International Airport",
			CityID:      9,
		},
	}

	airlines := []models.Airline{
		{
			ID:          "IU",
			AirlineName: "Super Air Jet",
			Logo:        "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fsuper_air_jet.png?alt=media&token=df17886d-f46c-4e85-8f7b-7c2c28a99613",
		},
		{
			ID:          "QG",
			AirlineName: "Citilink",
			Logo:        "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fcitilink.png?alt=media&token=c914ec71-f565-428e-a7ee-9b24e6344338",
		},
		{
			ID:          "ID",
			AirlineName: "Batik Air",
			Logo:        "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fbatik_air.png?alt=media&token=b7eba1c9-db0e-4cd5-a6b4-8bb8924436e5",
		},
	}

	airplanes := []models.Airplane{
		{
			ID:        "IU866",
			AirlineID: "IU",
		},
		{
			ID:        "IU193",
			AirlineID: "IU",
		},
		{
			ID:        "QG938",
			AirlineID: "QG",
		},
		{
			ID:        "ID728",
			AirlineID: "ID",
		},
	}

	tickets := []models.Ticket{
		{
			ID:    "MOJEW",
			Price: 754500,
		},
		{
			ID:    "KSURH",
			Price: 1173152,
		},
		{
			ID:    "IGNSJ",
			Price: 1727600,
		},
	}

	flights := []models.Flight{
		{
			OriginAirportID:      "Soekarno Hatta International Airport",
			DestinationAirportID: "Ngurah Rai International Airport",
			AirplaneID:           "IU866",
			DepartureDate:        time.Date(2024, time.February, 25, 10, 40, 0, 0, time.UTC),
			ArrivalDate:          time.Date(2024, time.February, 25, 13, 40, 0, 0, time.UTC),
			TicketID:             "MOJEW",
		},
		{
			OriginAirportID:      "Soekarno Hatta International Airport",
			DestinationAirportID: "Sultan Syarif Kasim II",
			AirplaneID:           "QG938",
			DepartureDate:        time.Date(2024, time.February, 27, 9, 40, 0, 0, time.UTC),
			ArrivalDate:          time.Date(2024, time.February, 27, 11, 25, 0, 0, time.UTC),
			TicketID:             "KSURH",
		},
		{
			OriginAirportID:      "Soekarno Hatta International Airport",
			DestinationAirportID: "Kuala Lumpur International Airport",
			AirplaneID:           "ID728",
			DepartureDate:        time.Date(2024, time.February, 27, 6, 15, 0, 0, time.UTC),
			ArrivalDate:          time.Date(2024, time.February, 27, 9, 20, 0, 0, time.UTC),
			TicketID:             "IGNSJ",
		},
		{
			OriginAirportID:      "Kuala Lumpur International Airport",
			DestinationAirportID: "Sultan Syarif Kasim II",
			AirplaneID:           "IU193",
			DepartureDate:        time.Date(2024, time.February, 27, 16, 0, 0, 0, time.UTC),
			ArrivalDate:          time.Date(2024, time.February, 27, 16, 55, 0, 0, time.UTC),
			TicketID:             "IGNSJ",
		},
	}

	database.DB.Create(&promos)
	database.DB.Create(&roomFacilityTypes)
	database.DB.Create(&hoteFacilityTypes)
	database.DB.Create(&personalQuestions)
	database.DB.Create(&users)
	database.DB.Create(&answers)
	database.DB.Create(&countries)
	database.DB.Create(&cities)
	database.DB.Create(&hotels)
	database.DB.Create(&hotelFacilities)
	database.DB.Create(&rooms)
	database.DB.Create(&roomFacilities)
	database.DB.Create(&reviews)
	database.DB.Create(&airports)
	database.DB.Create(&airlines)
	database.DB.Create(&airplanes)

	for i := 1; i <= 30; i++ {
		seat := models.Seat{
			AirplaneID: "IU866",
			SeatNumber: i,
			Status:     false,
		}
		database.DB.Create(&seat)
	}

	for i := 1; i <= 30; i++ {
		seat := models.Seat{
			AirplaneID: "QG938",
			SeatNumber: i,
			Status:     false,
		}
		database.DB.Create(&seat)
	}

	for i := 1; i <= 30; i++ {
		seat := models.Seat{
			AirplaneID: "ID728",
			SeatNumber: i,
			Status:     false,
		}
		database.DB.Create(&seat)
	}

	for i := 1; i <= 30; i++ {
		seat := models.Seat{
			AirplaneID: "IU193",
			SeatNumber: i,
			Status:     false,
		}
		if i == 1 {
			seat.Status = true
		}
		database.DB.Create(&seat)
	}

	database.DB.Create(&tickets)
	database.DB.Create(&flights)

}
