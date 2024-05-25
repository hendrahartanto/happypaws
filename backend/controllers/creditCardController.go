package controllers

import (
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func AddCreditCard(c *gin.Context) {
	var body struct {
		CreditCardNumber string
		Cvv              string
		UserID           uint
		Amount           int
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var creditCard models.CreditCard

	if body.CreditCardNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Credit card number is required",
		})
		return
	}

	if body.Cvv == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "CVV card number is required",
		})
		return
	}

	creditCard.UserID = body.UserID
	creditCard.CVV = body.Cvv
	creditCard.Amount = body.Amount
	creditCard.CardNumber = body.CreditCardNumber

	database.DB.Create(&creditCard)

	c.JSON(http.StatusCreated, creditCard)
}
