package http

import "github.com/gin-gonic/gin"

func RegisterRoutes(router *gin.Engine, server *server) {
	messages := router.Group("/messages")
	{
		messages.GET("", server.ListMessages)
		messages.POST("", server.CreateMessage)
	}

	sessions := router.Group("/sessions")
	{
		sessions.POST("", server.CreateSession)
	}

	users := router.Group("/users")
	{
		users.GET("", server.ListUsers)
		users.POST("", server.CreateUser)
	}
}
