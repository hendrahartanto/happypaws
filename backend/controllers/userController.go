package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/L0ckedkey/go_backend/database"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func Validate(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.JSON(http.StatusOK, nil)
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusOK, nil)
		}

		var user models.User
		database.DB.Preload("CreditCards").First(&user, claims["sub"])

		if user.ID == 0 {
			c.JSON(http.StatusOK, nil)
		}

		c.JSON(http.StatusOK, user)

	} else {
		c.JSON(http.StatusOK, nil)
	}
}

func ResigerUser(c *gin.Context) {
	var newUser models.User

	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newUser.PaymentMethod = 0
	newUser.Money = 10000000

	database.DB.Create(&newUser)

	c.JSON(http.StatusCreated, newUser)
}

func GetAllUser(c *gin.Context) {
	var users []models.User
	result := database.DB.Preload("CreditCards").Find(&users)

	if result.Error != nil {
		panic(result.Error)
	}

	c.AsciiJSON(http.StatusOK, users)
}

func Login(c *gin.Context) {
	var body struct {
		Email    string
		Password string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	database.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or pass",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid to create token",
		})
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

	c.JSON(http.StatusOK, gin.H{})
}

func RemoveCookie(c *gin.Context) {
	expiration := time.Now().Add(-time.Hour)
	cookie := &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Expires:  expiration,
		HttpOnly: true,
		Path:     "/",
	}

	http.SetCookie(c.Writer, cookie)
}

func UpdateUser(c *gin.Context) {
	fmt.Println("tes")
	id := c.Param("id")
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	user.Email = updatedUser.Email
	user.IsSubscribed = updatedUser.IsSubscribed
	user.Username = updatedUser.Username
	user.ProfilePicture = updatedUser.ProfilePicture
	user.Address = updatedUser.Address
	user.PhoneNumber = updatedUser.PhoneNumber
	user.PaymentMethod = updatedUser.PaymentMethod

	database.DB.Save(&user)

	c.JSON(http.StatusOK, user)
}
