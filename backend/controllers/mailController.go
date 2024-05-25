package controllers

import (
	"log"
	"net/smtp"
)

func SendEmail(subject string, body string, recipientEmail string) {
	from := "hhtravelo@gmail.com"
	password := "bzct gqqx rkrt lxcf"

	to := recipientEmail
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	message := []byte("Subject: " + subject + "\r\n" +
		"\r\n" + body)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Email sent successfully!")
}
