package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func AddCreditCard(c *gin.Context) {
	var creditCard models.CreditCard

	if err := c.BindJSON(&creditCard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&creditCard)

	c.JSON(http.StatusCreated, creditCard)
}
