package main

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type Payload struct {
}

var (
	clients   []*websocket.Conn
	clientsMu sync.Mutex
)

func addClient(conn *websocket.Conn) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	clients = append(clients, conn)
}

func removeClient(conn *websocket.Conn) {
	clientsMu.Lock()
	if conn == clients[0] {
		for _, client := range clients {
			msg := Message{"onDisconnect", 1}
			client.WriteJSON(msg)
		}
	} else {
		for _, client := range clients {
			msg := Message{"onDisconnect", 2}
			client.WriteJSON(msg)
		}
	}
	defer clientsMu.Unlock()
	for i, c := range clients {
		if c == conn {
			clients = append(clients[:i], clients[i+1:]...)
			return
		}
	}
}

var timer = 500

func timerUpdate() {
	for range time.Tick(time.Second) {
		timer -= 1
		clientsMu.Lock()
		for _, client := range clients {
			msg := Message{"timer", timer}
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error writing message:", err)
			}
		}
		clientsMu.Unlock()
	}
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	timer = 500
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			allowedOrigins := map[string]bool{
				"http://localhost:5173": true,
			}
			return allowedOrigins[origin]
		},
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Failed to upgrade connection:", err)
		return
	}
	defer conn.Close()

	addClient(conn)
	defer removeClient(conn)

	if len(clients) == 1 {
		msg := Message{"onConnect", 1}
		conn.WriteJSON(msg)
	} else {
		msg := Message{"onConnect", 2}
		conn.WriteJSON(msg)
	}

	for {
		messageType, message, err := conn.ReadMessage() //akan terus menerus mencoba menerima message dari client, akan menunggu hingga menerima suatu message atau error
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		fmt.Printf("Received message: %s\n", message)

		clientsMu.Lock()
		for _, client := range clients {
			err = client.WriteMessage(messageType, message)
			if err != nil {
				fmt.Println("Error writing message:", err)
				break
			}
		}
		clientsMu.Unlock()
	}
}

func main() {
	go timerUpdate()

	http.HandleFunc("/ws", HandleWebSocket)
	fmt.Println("Server is listening on port 9090...")
	fmt.Println(http.ListenAndServe(":9090", nil))
}
