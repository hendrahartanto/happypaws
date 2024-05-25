package controllers

import (
	"fmt"
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

func ValidateAnswer(c *gin.Context) {
	var body struct {
		AnswerID int
		Answer   string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	fmt.Println(body.AnswerID)
	fmt.Println(body.Answer)

	var answer models.Answer
	database.DB.First(&answer, body.AnswerID)

	if body.Answer != answer.Answer {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Wrong Answer",
		})
		return
	}
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
