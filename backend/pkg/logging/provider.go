package logging

import (
	"context"

	"go.uber.org/config"
	"go.uber.org/fx"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// ProvideConfig populates internal Config.
func ProvideConfig(cfg *config.YAML) (Config, error) {
	var c Config
	err := cfg.Get("logging").Populate(&c)
	return c, err
}

// ProvideDevelopmentConfig should be favored for development.
func ProvideDevelopmentConfig() zap.Config {
	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	return cfg
}

// ProvideProductionConfig should be favored for production.
func ProvideProductionConfig() zap.Config {
	return zap.NewProductionConfig()
}

// ProvideZapConfig builds zap.Config according to the given internal Config and metadata.
func ProvideZapConfig(cfg Config) zap.Config {
	if cfg.Driver == "dev" {
		return ProvideDevelopmentConfig()
	}

	return ProvideProductionConfig()
}

// ProvideLogger provides zap.Logger.
func ProvideLogger(
	cfg Config,
	lifecycle fx.Lifecycle,
	zapConfig zap.Config,
) (*zap.Logger, error) {
	if cfg.Level != "" {
		var level zapcore.Level

		if err := level.Set(cfg.Level); err != nil {
			return nil, err
		}

		zapConfig.Level.SetLevel(level)
	}

	logger, err := zapConfig.Build()
	if err != nil {
		return nil, err
	}

	lifecycle.Append(fx.Hook{
		OnStop: func(c context.Context) error {
			logger.Debug("syncing logger")
			// Ignore logger.Sync errors as they can be platform specific, see:
			// https://github.com/uber-go/zap/issues/370
			logger.Sync() //nolint:errcheck
			return nil
		},
	})

	return logger, nil
}
