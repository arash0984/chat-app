package user

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/model"
	"github.com/uptrace/bun"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) Repository {
	return &repository{db: db}
}

func (r repository) GetUser(ctx context.Context, email, password string) (model.User, error) {
	var out user

	err := r.db.
		NewSelect().
		Model(&out).
		Where("email = ? AND password = ?", email, password).
		Limit(1).
		Scan(ctx)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return model.User{}, ErrUserNotFound
		}

		return model.User{}, err
	}

	return convertToModel(out), nil
}

func (r repository) CreateUser(ctx context.Context, in model.User) (model.User, error) {
	out := convertFromModel(in)

	_, err := r.db.
		NewInsert().
		Model(&out).
		Returning("*").
		Exec(ctx)
	if err != nil {
		return model.User{}, err
	}

	return convertToModel(out), nil
}

func (r repository) ListUsers(ctx context.Context, email string) ([]model.User, error) {
	var users []user

	err := r.db.
		NewSelect().
		Model(&users).
		Where("email != ?", email).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]model.User, 0, len(users))

	for _, user := range users {
		out = append(out, convertToModel(user))
	}

	return out, nil
}

type user struct {
	bun.BaseModel `bun:"users"`

	ID        uuid.UUID `bun:",pk,default:gen_random_uuid()"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	Name      string    `bun:",notnull"`
	Email     string    `bun:",unique,notnull"`
	Password  string    `bun:",notnull"`
}

func convertFromModel(in model.User) user {
	return user{
		Name:     in.Name,
		Email:    in.Email,
		Password: in.Password,
	}
}

func convertToModel(in user) model.User {
	return model.User{
		Name:     in.Name,
		Email:    in.Email,
		Password: in.Password,
	}
}
