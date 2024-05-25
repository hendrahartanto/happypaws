package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func SendBroadcast(c *gin.Context) {
	var body struct {
		BroadcastMessage string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.BroadcastMessage == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Broadcast message is required"})
		return
	}

	var allUser []models.User
	database.DB.Find(&allUser)

	for _, user := range allUser {
		if user.IsSubscribed {
			SendEmail("News From TraveloHI", body.BroadcastMessage, user.Email)
		}
	}

}
