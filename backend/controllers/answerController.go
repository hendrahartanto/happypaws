package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func PostAnswer(c *gin.Context) {
	var newAnswer models.Answer

	if err := c.BindJSON(&newAnswer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&newAnswer)

	c.JSON(http.StatusCreated, newAnswer)
}

//contoh join
// func Testing(c *gin.Context) {
// 	var cities []models.City
// 	if err := database.DB.Preload("Country").Find(&cities).Error; err != nil {
// 		c.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(200, cities)
// }
