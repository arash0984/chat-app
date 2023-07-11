package app

import (
	"go.uber.org/fx"

	"github.com/mobinhajizadeh/chat-app/backend/pkg/app"
	"github.com/mobinhajizadeh/chat-app/backend/pkg/database/bun"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/http"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/migration"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/repository/message"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/repository/user"
)

var BaseModule = fx.Options(
	app.BaseModule,
	bun.BaseModule,
	http.BaseModule,
	message.BaseModule,
	user.BaseModule,
)

var Module = fx.Options(
	BaseModule,
	migration.Module,
)
