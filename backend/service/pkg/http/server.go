package http

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/mobinhajizadeh/chat-app/backend/pkg/auth"
	internalhttp "github.com/mobinhajizadeh/chat-app/backend/pkg/http"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/model"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/repository/message"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/repository/user"
)

type server struct {
	logger            *zap.Logger
	messageRepository message.Repository
	userRepository    user.Repository
}

func NewServer(
	logger *zap.Logger,
	messageRepository message.Repository,
	userRepository user.Repository,
) *server {
	return &server{
		logger:            logger,
		messageRepository: messageRepository,
		userRepository:    userRepository,
	}
}

func (s server) CreateSession(ctx *gin.Context) {
	var in model.User

	if err := ctx.ShouldBindJSON(&in); err != nil {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument body").WriteJSON(ctx)
		return
	}

	if in.Email == "" || in.Password == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument email or password").WriteJSON(ctx)
		return
	}

	user, err := s.userRepository.GetUser(ctx, in.Email, in.Password)
	if err != nil {
		s.logger.Error(
			"failed to get user",
			zap.String("email", in.Email),
			zap.Error(err),
		)
		internalhttp.NewError(http.StatusNotFound, "user not found").WriteJSON(ctx)
		return
	}

	claims := auth.Claims{
		"email": user.Email,
		"exp":   time.Now().AddDate(0, 0, 7).Unix(),
	}

	token, err := auth.NewToken(claims)
	if err != nil {
		s.logger.Error(
			"failed to create a new token",
			zap.String("email", in.Email),
			zap.Error(err),
		)
		internalhttp.NewError(http.StatusInternalServerError, "failed to generate JWT").WriteJSON(ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"session": gin.H{
			"token": token,
		},
	})
}

func (s server) CreateUser(ctx *gin.Context) {
	var in model.User

	if err := ctx.ShouldBindJSON(&in); err != nil {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument body").WriteJSON(ctx)
		return
	}

	if in.Name == "" || in.Email == "" || in.Password == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument email or password").WriteJSON(ctx)
		return
	}

	user, err := s.userRepository.CreateUser(ctx, in)
	if err != nil {
		s.logger.Error(
			"failed to create user",
			zap.String("email", in.Email),
			zap.Error(err),
		)
		internalhttp.NewError(http.StatusBadRequest, "failed to create user").WriteJSON(ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func (s server) ListUsers(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument email").WriteJSON(ctx)
		return
	}

	users, err := s.userRepository.ListUsers(ctx, email)
	if err != nil {
		internalhttp.NewError(http.StatusNotFound, "failed to list users").WriteJSON(ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (s server) CreateMessage(ctx *gin.Context) {
	var in model.Message

	if err := ctx.ShouldBindJSON(&in); err != nil {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument body").WriteJSON(ctx)
		return
	}

	if in.From == "" || in.To == "" || in.Body == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument from, to, or body").WriteJSON(ctx)
		return
	}

	message, err := s.messageRepository.CreateMessage(ctx, in)
	if err != nil {
		internalhttp.NewError(http.StatusBadRequest, "failed to create message").WriteJSON(ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": message,
	})
}

func (s server) ListMessages(ctx *gin.Context) {
	from := ctx.Query("from")
	if from == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument from").WriteJSON(ctx)
		return
	}

	to := ctx.Query("to")
	if to == "" {
		internalhttp.NewError(http.StatusBadRequest, "invalid argument to").WriteJSON(ctx)
		return
	}

	messages, err := s.messageRepository.ListMessages(ctx, from, to)
	if err != nil {
		internalhttp.NewError(http.StatusBadRequest, "failed to list messages").WriteJSON(ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"messages": messages,
	})
}
