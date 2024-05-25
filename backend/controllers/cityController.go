package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func GetAllCity(c *gin.Context) {
	var cities []models.City
	result := database.DB.Find(&cities)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Erro fetching city",
		})
		return
	}

	c.JSON(http.StatusOK, cities)

}
