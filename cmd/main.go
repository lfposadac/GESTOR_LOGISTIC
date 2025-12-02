package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"gestor_logistic/internal/core/usecase"
	"gestor_logistic/internal/handlers/http"
	"gestor_logistic/internal/handlers/parser"
	"gestor_logistic/internal/infrastructure/database"
	"gestor_logistic/internal/infrastructure/web"
	"gestor_logistic/internal/infrastructure/worker"

	"github.com/joho/godotenv" // Importar librería
)

func main() {
	// 1. Cargar variables de entorno desde el archivo .env
	// Si no encuentra el archivo (ej: en producción), no falla, sigue con las del sistema.
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No se encontró archivo .env, usando variables de entorno del sistema.")
	}

	// 2. Construir la cadena de conexión usando las variables
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASSWORD", "password") // Fallback por si acaso
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbName := getEnv("DB_NAME", "logistica_db")
	dbSSL := getEnv("DB_SSL", "disable")

	// Cadena de conexión segura
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		dbUser, dbPass, dbName, dbHost, dbPort, dbSSL)

	// 3. Conexión a Base de Datos
	db, err := database.NewDBConnection(connStr)
	if err != nil {
		log.Fatalf("❌ Error conectando a la DB: %v", err)
	}
	defer db.Close()

	// 4. Inyección de Dependencias
	repo := database.NewPostgresRepository(db)
	parser := parser.NewCSVParser()
	service := usecase.NewGestorService(repo, parser)
	handler := http.NewOperacionHandler(service)

	// Crear carpetas temporales si no existen
	_ = os.Mkdir("tmp", 0755)
	_ = os.Mkdir("uploads", 0755)

	// 5. Iniciar Worker
	worker.StartAlerterWorker(repo, 1*time.Hour)

	// 6. Iniciar Servidor
	r := web.SetupRouter(handler)

	port := getEnv("PORT", "8080")
	log.Printf("🚀 Servidor corriendo en http://localhost:%s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Error al iniciar servidor: %v", err)
	}
}

// Función auxiliar: Obtiene una variable de entorno o usa un valor por defecto
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
