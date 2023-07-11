package app

import (
	"context"

	"go.uber.org/fx"

	"github.com/mobinhajizadeh/chat-app/backend/pkg/config"
	"github.com/mobinhajizadeh/chat-app/backend/pkg/http"
	"github.com/mobinhajizadeh/chat-app/backend/pkg/logging"
	"github.com/mobinhajizadeh/chat-app/backend/pkg/migration"
)

var BaseModule = fx.Options(
	config.BaseModule,
	http.Module,
	logging.BaseModule,
	migration.BaseModule,
)

var Shutdown = fx.Invoke(func(lifecycle fx.Lifecycle, shutdowner fx.Shutdowner) {
	lifecycle.Append(fx.Hook{
		OnStart: func(context.Context) error {
			return shutdowner.Shutdown()
		},
	})
})
