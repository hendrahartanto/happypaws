package controllers

import (
	"fmt"
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func GetPromos(c *gin.Context) {
	var promos []models.Promo
	if err := database.DB.Find(&promos).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, promos)
}

func GetActivePromos(c *gin.Context) {
	var promos []models.Promo
	if err := database.DB.Find(&promos, "active = ?", true).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, promos)
}

func GetNonactivePromos(c *gin.Context) {
	var promos []models.Promo
	if err := database.DB.Find(&promos, "active = ?", false).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, promos)
}

func AddPromo(c *gin.Context) {
	var body struct {
		PromoName    string
		PromoCode    string
		PromoPicture string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	fmt.Println(body)

	if body.PromoName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promo name is required"})
		return
	}

	if body.PromoCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promo code is required"})
		return
	}

	if body.PromoPicture == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promo picture is required"})
		return
	}

	var allPromo []models.Promo
	database.DB.Find(&allPromo)
	for _, promo := range allPromo {
		if promo.PromoCode == body.PromoCode || promo.PromoName == body.PromoName {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Promo name or code already exists"})
			return
		}
	}

	var newPromo models.Promo
	newPromo.Active = false
	newPromo.PromoName = body.PromoName
	newPromo.PromoCode = body.PromoCode
	newPromo.Picture = body.PromoPicture

	database.DB.Create(&newPromo)

	c.JSON(http.StatusOK, newPromo)
}

func ActivatePromo(c *gin.Context) {

	var body struct {
		PromoID uint
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var promo models.Promo
	if err := database.DB.First(&promo, body.PromoID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var allPromos []models.Promo
	database.DB.Find(&allPromos, "active = ?", true)
	if len(allPromos) >= 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only 4 ongoing promo is allowed"})
		return
	}

	promo.Active = true

	database.DB.Save(&promo)

	c.JSON(http.StatusOK, promo)
}

func DeactivatePromo(c *gin.Context) {

	var body struct {
		PromoID uint
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var promo models.Promo
	if err := database.DB.First(&promo, body.PromoID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	promo.Active = false

	database.DB.Save(&promo)

	c.JSON(http.StatusOK, promo)
}
