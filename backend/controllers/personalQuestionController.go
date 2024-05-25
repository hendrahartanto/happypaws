package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func GetAllPersonalQuestion(c *gin.Context) {
	var questions []models.PersonalQuestion
	result := database.DB.Find(&questions)

	if result.Error != nil {
		panic(result.Error)
	}

	c.AsciiJSON(http.StatusOK, questions)
}
