package message

import (
	"context"
	"time"

	"github.com/gofrs/uuid"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/model"
	"github.com/uptrace/bun"
)

type repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) Repository {
	return &repository{db: db}
}

func (r repository) GetMessage(ctx context.Context, email string) (model.Message, error) {
	return model.Message{}, nil
}

func (r repository) CreateMessage(ctx context.Context, in model.Message) (model.Message, error) {
	out := convertFromModel(in)

	_, err := r.db.
		NewInsert().
		Model(&out).
		Returning("*").
		Exec(ctx)
	if err != nil {
		return model.Message{}, err
	}

	return convertToModel(out), nil
}

func (r repository) ListMessages(ctx context.Context, from, to string) ([]model.Message, error) {
	var messages []message

	err := r.db.
		NewSelect().
		Model(&messages).
		Where("(sent_from = ? AND sent_to = ?) OR (sent_from = ? AND sent_to = ?)", from, to, to, from).
		OrderExpr("created_at ASC").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]model.Message, 0, len(messages))

	for _, message := range messages {
		out = append(out, convertToModel(message))
	}

	return out, nil
}

type message struct {
	bun.BaseModel `bun:"messages"`

	ID        uuid.UUID `bun:",pk,default:gen_random_uuid()"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	SentFrom  string    `bun:",notnull"`
	SentTo    string    `bun:",notnull"`
	Body      string    `bun:",notnull"`
}

func convertFromModel(in model.Message) message {
	return message{
		SentFrom: in.From,
		SentTo:   in.To,
		Body:     in.Body,
	}
}

func convertToModel(in message) model.Message {
	return model.Message{
		From: in.SentFrom,
		To:   in.SentTo,
		Body: in.Body,
	}
}
