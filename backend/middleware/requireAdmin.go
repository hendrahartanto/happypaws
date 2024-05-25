package middleware

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

func RequireAdmin(c *gin.Context) {
	fmt.Println("TES")
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var user models.User
		database.DB.Preload("CreditCards").First(&user, claims["sub"])

		if user.ID == 0 || user.Role != "admin" {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		c.Set("user", user)

		c.Next()

	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
