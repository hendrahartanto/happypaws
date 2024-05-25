package controllers

import (
	"fmt"
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

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

func DeleteHotelCart(c *gin.Context) {
	id := c.Param("id")

	var hotelCart models.CartHotel
	if err := database.DB.First(&hotelCart, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cartHotel not found"})
		return
	}

	if err := database.DB.Delete(&hotelCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
