package model

type Message struct {
	From string `json:"from"`
	To   string `json:"to"`
	Body string `json:"body"`
}
