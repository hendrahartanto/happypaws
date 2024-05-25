package controllers

import (
	"net/http"

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
