package cmd

import (
	"github.com/spf13/cobra"
	"go.uber.org/fx"

	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/app"
	"github.com/mobinhajizadeh/chat-app/backend/service/pkg/http"
)

var serveHTTPCmd = &cobra.Command{
	Use: "http",
	Run: func(cmd *cobra.Command, args []string) {
		fx.New(app.Module, fx.Invoke(http.RegisterRoutes)).Run()
	},
}

func init() {
	serveCmd.AddCommand(serveHTTPCmd)
}
