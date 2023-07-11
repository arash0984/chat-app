package user

import (
	"context"

	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/model"
)

type Repository interface {
	GetUser(ctx context.Context, email, password string) (model.User, error)
	CreateUser(ctx context.Context, in model.User) (model.User, error)
	ListUsers(ctx context.Context, email string) ([]model.User, error)
}
