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
			FacilityName: "Boarding",
		},
		{
			FacilityName: "Playground",
		},
		{
			FacilityName: "Grooming",
		},
		{
			FacilityName: "Spa",
		},
		{
			FacilityName: "Training",
		},
		{
			FacilityName: "Vet on Call",
		},
		{
			FacilityName: "Pet Walking",
		},
	}

	roomFacilityTypes := []models.RoomFacilityType{
		{
			FacilityName: "Private Play Area",
		},
		{
			FacilityName: "Interactive Toy",
		},
		{
			FacilityName: "Pet Longue",
		},
		{
			FacilityName: "24-Hour Pet Care Assistance",
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
			FacilityName: "Customized Bed",
		},
		{
			FacilityName: "Warm Bathing",
		},
		{
			FacilityName: "Daily Cleaning",
		},
	}

	hotels := []models.Hotel{
		{
			HotelName:   "Arnamir Pet Hotel",
			Description: "Arnamir Pet Hotel could be an option for those of you who want to entrust your beloved cat. Located in South Jakarta, this hotel apparently belongs to a local artist, namely Tya Ariestya. This hotel has 4 floors with a total of 40 rooms. The room types also vary, from deluxe, junior, to presidential suite. Not only rooms, this hotel also provides a playground, you know. The assessment on Google Reviews also shows positive comments. With comfortable facilities, it's guaranteed that your beloved baby will feel at home.",
			Address:     "Jl. Sultan Agung No.26, Guntur, Kecamatan Setiabudi, Jakarta, Daerah Khusus Ibukota Jakarta 12980",
			CityID:      4,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/happy-paws-ebc62.appspot.com/o/hotel_pictures%2F1%2F109919280-118658409931559-7368892822671891549-n-0ae541aa5608a62ad26095a31650f36f.jpg?alt=media&token=74027f7d-570b-4ead-ac32-9929e59cc68d",
		},
		{
			HotelName:   "Chilidog House",
			Description: "Previously, the pet hotel was for cats, this time there is Chilidog House, a place to stay as well as a care center specifically for dogs. This pet hotel is located in Cilincing, North Jakarta. The facilities offered can be said to be very complete. Starting from accommodation, dog grooming, salons, playgrounds, training, to cafes. So, different from the previous recommendation, you have to pay a lot of money when leaving your beloved pet at Chilidog House. The reason is, this pet hotel applies prices that depend on the size and weight of the animal.",
			Address:     "Jalan Wahid Hasyim No 41, Depok, Yogyakarta, Yogyakarta Province, Indonesia, 55281",
			CityID:      2,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/happy-paws-ebc62.appspot.com/o/hotel_pictures%2F2%2F2021-05-15-622c339354072d26246de090f6aff4e1.jpg?alt=media&token=e0c5a4eb-f840-455b-81e3-f97716d97c14",
		},
		{
			HotelName:   "Groovy Paw Hotel & Resort",
			Description: "Groovy Paw Hotel & Resort is a pet hotel specifically for dogs. The facilities are very complete, starting from boarding, grooming, playground, pet taxi, to swimming pool. Later, there will be complete facilities, such as eating 3 times a day with a choice of AC or non-AC rooms. So, the cost will depend on the animal's weight and room type. Actually, this pet hotel is located in Bogor. However, you can still come to Groovy Pet Shop which is located in Kemang and Bintaro.",
			Address:     "Jalan Soekarno Hatta, Kompleks Transmart, Payung Sekaki, Pekanbaru, Riau, Indonesia, 28292",
			CityID:      3,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/happy-paws-ebc62.appspot.com/o/hotel_pictures%2F3%2Funadjustednonraw-thumb-2519-d8b7de54697b71285d7b0a109748c849.jpg?alt=media&token=fe47e468-9d8d-4173-875e-997bc840f22a",
		},
	}

	hotelFacilities := []models.HotelFacility{
		{
			HotelID:      1,
			FacilityName: "Boarding",
		},
		{
			HotelID:      1,
			FacilityName: "Playground",
		},
		{
			HotelID:      1,
			FacilityName: "Spa",
		},
		{
			HotelID:      1,
			FacilityName: "Grooming",
		},
		{
			HotelID:      1,
			FacilityName: "Training",
		},
		{
			HotelID:      2,
			FacilityName: "Boarding",
		},
		{
			HotelID:      2,
			FacilityName: "Pet Walking",
		},
		{
			HotelID:      2,
			FacilityName: "Spa",
		},
		{
			HotelID:      2,
			FacilityName: "Vet on Call",
		},
		{
			HotelID:      2,
			FacilityName: "Playground",
		},
		{
			HotelID:      3,
			FacilityName: "Boarding",
		},
		{
			HotelID:      3,
			FacilityName: "Training",
		},
		{
			HotelID:      3,
			FacilityName: "Playground",
		},
		{
			HotelID:      3,
			FacilityName: "Pet Walking",
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
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       1,
			FacilityName: "Interactive Toy",
		},
		{
			RoomID:       1,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       2,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       2,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       3,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       3,
			FacilityName: "Separate Dining Area",
		},
		{
			RoomID:       3,
			FacilityName: "Interactive Toy",
		},
		{
			RoomID:       3,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       4,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       4,
			FacilityName: "24-Hour Pet Care Assistance",
		},
		{
			RoomID:       4,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       5,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       5,
			FacilityName: "24-Hour Pet Care Assistance",
		},
		{
			RoomID:       5,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       6,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       6,
			FacilityName: "24-Hour Pet Care Assistance",
		},
		{
			RoomID:       6,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       7,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       7,
			FacilityName: "Warm Bathing",
		},
		{
			RoomID:       7,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       8,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       8,
			FacilityName: "Warm Bathing",
		},
		{
			RoomID:       8,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       9,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       9,
			FacilityName: "Warm Bathing",
		},
		{
			RoomID:       9,
			FacilityName: "Customized Bed",
		},
		{
			RoomID:       10,
			FacilityName: "Daily Cleaning",
		},
		{
			RoomID:       10,
			FacilityName: "Warm Bathing",
		},
		{
			RoomID:       10,
			FacilityName: "Customized Bed",
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

	//seeding hotel dummy
	for i := 4; i <= 20; i++ {
		hotel := models.Hotel{
			HotelName:   "Dummy",
			Description: "Dummy",
			Address:     "Dummy",
			CityID:      3,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/happy-paws-ebc62.appspot.com/o/hotel_pictures%2Fdummy%2Fsnapinstaapp-88169159-184952909609663-7999802850329044620-n-1080-846b34bc855fafc3e6e471702c8bf8f9.jpg?alt=media&token=79c20cda-6908-4f00-84f7-bd04ca784a39",
		}
		database.DB.Create(&hotel)
	}

	for i := 4; i < 8; i++ {
		hotelFacility := models.HotelFacility{
			HotelID:      uint(i),
			FacilityName: "Boarding",
		}
		database.DB.Create(&hotelFacility)
	}

	for i := 4; i < 8; i++ {
		room := models.Room{
			HotelID:     uint(i),
			RoomType:    "Dummy",
			PricePerDay: 1,
			Picture:     "https://firebasestorage.googleapis.com/v0/b/happy-paws-ebc62.appspot.com/o/hotel_pictures%2Fdummy%2Fsnapinstaapp-88169159-184952909609663-7999802850329044620-n-1080-846b34bc855fafc3e6e471702c8bf8f9.jpg?alt=media&token=79c20cda-6908-4f00-84f7-bd04ca784a39",
		}
		database.DB.Create(&room)
	}

	for i := 11; i < 15; i++ {
		roomFacilitiy := models.RoomFacility{
			RoomID:       uint(i),
			FacilityName: "Daily Cleaning",
		}
		database.DB.Create(&roomFacilitiy)
	}

}
