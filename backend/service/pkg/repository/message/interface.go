package message

import (
	"context"

	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/model"
)

type Repository interface {
	GetMessage(ctx context.Context, email string) (model.Message, error)
	CreateMessage(ctx context.Context, in model.Message) (model.Message, error)
	ListMessages(ctx context.Context, from, to string) ([]model.Message, error)
}
