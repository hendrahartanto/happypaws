package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func PostRoomCart(c *gin.Context) {
	var newRoomCart models.CartHotel

	if err := c.BindJSON(&newRoomCart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&newRoomCart)

	c.JSON(http.StatusCreated, newRoomCart)
}
