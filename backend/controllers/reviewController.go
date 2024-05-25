package controllers

import (
	"fmt"
	"net/http"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/gin-gonic/gin"
)

func PostReview(c *gin.Context) {
	var body struct {
		UserID      uint
		HotelID     uint
		ReviewType  string
		Review      string
		Rating      int
		IsAnonymous bool
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.ReviewType == "" {

		body.ReviewType = "Cleanliness"
	}

	if body.Rating == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rating can't be zero"})
		return
	}

	if body.Review == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review can't be empty"})
		return
	}

	fmt.Println(body)

	var newReview models.Review
	newReview.HotelID = body.HotelID
	newReview.UserID = body.UserID
	newReview.Type = body.ReviewType
	newReview.Comment = body.Review
	newReview.Rating = body.Rating
	newReview.IsAnonymous = body.IsAnonymous

	database.DB.Create(&newReview)

	c.JSON(http.StatusOK, newReview)

}
