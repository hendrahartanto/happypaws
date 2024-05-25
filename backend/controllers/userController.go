package controllers

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/L0ckedkey/go_backend/database"
	_ "github.com/L0ckedkey/go_backend/docs"
	"github.com/L0ckedkey/go_backend/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var otp string

func validateUserName(userName string) (bool, string) {
	if userName == "" {
		return false, "Username is required"
	} else if len(userName) < 5 {
		return false, "Username must be at least 5 characters"
	} else if matched, _ := regexp.MatchString("^[a-zA-Z ]+$", userName); !matched {
		return false, "Username can't contain numbers or symbols"
	}
	return true, ""
}

func validateDOB(dob string) (bool, string) {
	if dob == "" {
		return false, "Date of birth is required"
	}

	today := time.Now()
	enteredDate, err := time.Parse("2006-01-02", dob)
	if err != nil {
		return false, "Invalid date format"
	}

	age := today.Year() - enteredDate.Year()

	if today.YearDay() < enteredDate.YearDay() {
		age--
	}

	fmt.Println(age)

	if age < 13 {
		return false, "Must be at least 13 years old"
	}

	return true, ""
}

func validateGender(gender string) (bool, string) {
	return gender != "", "Choose the gender"
}

func validatePassword(password string) (bool, string) {
	return len(password) >= 8 && len(password) <= 30, "Password length must be between 8 and 30 characters"
}

func validateNewPassword(oldPassword string, newPassword string) (bool, string) {
	if newPassword == "" {
		return false, "New password is required"
	}
	if len(newPassword) < 8 || len(newPassword) > 30 {
		return false, "Password length must be between 8 and 30 characters "
	}
	if oldPassword == newPassword {
		return false, "New password can't be the same as old password"
	}
	return true, ""
}

func validateConfirmPassword(password, confirmPassword string) (bool, string) {
	return password == confirmPassword, "Confirm password is not the same as the password"
}

func validatePersonalQuestion(personalQuestion int) (bool, string) {
	return personalQuestion != 0, "Choose a personal question"
}

func validateAnswer(answer string) (bool, string) {
	return answer != "", "Personal question's answer is required"
}

func validateEmail(email string, users []models.User) (bool, string) {
	if email == "" {
		return false, "Email address can't be empty"
	}
	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !emailRegex.MatchString(email) {
		return false, "Email address is not valid"
	}

	for _, user := range users {
		if user.Email == email {
			return false, "Email address is already used"
		}
	}

	return true, ""
}

func validateLoginEmail(email string, users []models.User) (bool, string) {
	if email == "" {
		return false, "Email address can't be empty"
	}

	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !emailRegex.MatchString(email) {
		return false, "Email address is not valid"
	}

	for _, user := range users {
		if user.Email == email {
			if user.IsBanned {
				return false, "This user is banned"
			}
			return true, ""
		}
	}

	return false, "Email address not found"
}

func validateLoginPassword(email, password string, users []models.User) (bool, string) {
	for _, user := range users {
		if user.Email == email && user.Password == password {
			return true, ""
		}
	}

	return false, "Password is incorrect"
}

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
		database.DB.Preload("CreditCards").Preload("TransactionTickets").Preload("TransactionHotels").First(&user, claims["sub"])

		if user.ID == 0 {
			c.JSON(http.StatusOK, nil)
		}

		c.JSON(http.StatusOK, user)

	} else {
		c.JSON(http.StatusOK, nil)
	}
}

func ResigerUser(c *gin.Context) {
	var newUser struct {
		Username           string  `json:"userName"`
		Email              string  `json:"email"`
		Password           string  `json:"password"`
		ConfirmPassword    string  `json:"confirmPassword"`
		DOB                string  `json:"DOB"`
		Gender             string  `json:"gender"`
		ProfilePicture     *string `json:"profilePicture"`
		PersonalQuestionID int     `json:"personalQuestionID"`
		IsBanned           bool    `json:"isBanned"`
		Role               string  `json:"role"`
		IsSubscribed       bool    `json:"isSubscribed"`
		PhoneNumber        string  `json:"phoneNumber"`
		Address            string  `json:"address"`
		Answer             string  `json:"answer"`
	}
	var allUser []models.User
	database.DB.Find(&allUser)

	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isValid, errMsg := validateUserName(newUser.Username); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateEmail(newUser.Email, allUser); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateDOB(newUser.DOB); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validatePassword(newUser.Password); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateConfirmPassword(newUser.Password, newUser.ConfirmPassword); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateGender(newUser.Gender); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validatePersonalQuestion(newUser.PersonalQuestionID); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateAnswer(newUser.Answer); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	user := models.User{
		Username:       newUser.Username,
		Email:          newUser.Email,
		Password:       newUser.Password, // You might want to hash the password before storing it in production
		DOB:            newUser.DOB,
		Gender:         newUser.Gender,
		IsBanned:       newUser.IsBanned,
		Role:           newUser.Role,
		IsSubscribed:   newUser.IsSubscribed,
		PhoneNumber:    newUser.PhoneNumber,
		Address:        newUser.Address,
		ProfilePicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-ef7d8.appspot.com/o/photos%2Fanonymous.png?alt=media&token=706538a7-0c32-47d7-99b2-351a6ba7b8c4",
	}

	user.PaymentMethod = 0
	user.Money = 10000000

	database.DB.Create(&user)

	c.JSON(http.StatusCreated, user)

	SendEmail("Account Creation Confirmation", fmt.Sprintf("Dear, %s\n  We are pleased to inform you that your account have been successfully created", user.Username), user.Email)
}

// GetAllUser godoc
// @Summary Get an example
// @Description Get an example by ID
// @ID get-example
// @Produce json
// @Param id path int true "Example ID"
// @Success 200 {object} ExampleResponse
// @Failure 404 {object} ErrorResponse
// @Router /user/getalluser [get]
func GetAllUser(c *gin.Context) {
	var users []models.User
	result := database.DB.Preload("CreditCards").Find(&users)

	if result.Error != nil {
		panic(result.Error)
	}

	c.AsciiJSON(http.StatusOK, users)
}

func ValidateLoginEmail(c *gin.Context) {
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

	var allUser []models.User
	database.DB.Find(&allUser)
	if isValid, errMsg := validateLoginEmail(body.Email, allUser); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}
}

func generateOTP(length int) string {
	charset := "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

	randBytes := make([]byte, length)
	_, err := rand.Read(randBytes)
	if err != nil {
		panic(err)
	}

	otp := make([]byte, length)
	for i := 0; i < length; i++ {
		otp[i] = charset[int(randBytes[i])%len(charset)]
	}

	return string(otp)
}

func sendOTPCode(email string) {
	otp = generateOTP(6)
	SendEmail("OTP Code", otp, email)
}

func ValidateLoginEmailWithOTP(c *gin.Context) {
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

	var allUser []models.User
	database.DB.Find(&allUser)
	if isValid, errMsg := validateLoginEmail(body.Email, allUser); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	sendOTPCode(body.Email)

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

	var allUser []models.User
	database.DB.Find(&allUser)

	if isValid, errMsg := validateLoginPassword(body.Email, body.Password, allUser); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	var user models.User
	database.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or pass",
		})
		return
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
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

	c.JSON(http.StatusOK, gin.H{})
}

func ValidateOTP(c *gin.Context) {
	var body struct {
		Email string
		OTP   string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var allUser []models.User
	database.DB.Find(&allUser)

	var user models.User
	database.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or pass",
		})
		return
	}

	if otp != body.OTP {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid OTP Code",
		})
		return
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
	id := c.Param("id")
	var user models.User
	var allUser []models.User
	database.DB.Find(&allUser)
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	if isValid, errMsg := validateUserName(updatedUser.Username); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if isValid, errMsg := validateEmail(updatedUser.Email, allUser); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	if updatedUser.PhoneNumber == "" {
		c.JSON(400, gin.H{"error": "Phone number is required"})
		return
	}

	if updatedUser.Address == "" {
		c.JSON(400, gin.H{"error": "Address is required"})
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

func GetUserByEmail(c *gin.Context) {
	email := c.Param("email")

	var allUser []models.User
	database.DB.Find(&allUser)

	var user models.User
	database.DB.Preload("Answers").Preload("Answers.PersonalQuestion").First(&user, "email = ?", email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email not found",
		})
		return
	}

	if user.IsBanned {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "This user is banned",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdatePassword(c *gin.Context) {
	var body struct {
		UserID      int
		NewPassword string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, body.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if isValid, errMsg := validateNewPassword(user.Password, body.NewPassword); !isValid {
		c.JSON(400, gin.H{"error": errMsg})
		return
	}

	user.Password = body.NewPassword

	database.DB.Save(&user)

	c.JSON(http.StatusOK, user)
}

func ToggleBanUser(c *gin.Context) {
	fmt.Println("TES")
	var body struct {
		UserID uint
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, body.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	user.IsBanned = !user.IsBanned

	database.DB.Save(&user)

	c.JSON(http.StatusOK, user)

}

func GetPrice(c *gin.Context) {
	var body struct {
		UserID uint
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, body.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	user.Money += 1000000

	database.DB.Save(&user)

	c.JSON(http.StatusOK, user)

}
