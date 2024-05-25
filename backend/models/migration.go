package models

import (
	"github.com/L0ckedkey/go_backend/database"
)

func MigrateTables(models ...interface{}) {
	for _, model := range models {
		database.DB.Migrator().DropTable(model)

		database.DB.AutoMigrate(model)
	}
}
