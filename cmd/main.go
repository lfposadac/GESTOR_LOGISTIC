package main

import (
	"log"
	"os"
	"time"

	"gestor_logistic/internal/core/usecase"
	"gestor_logistic/internal/handlers/http"
	"gestor_logistic/internal/handlers/parser"
	"gestor_logistic/internal/infrastructure/database"
	"gestor_logistic/internal/infrastructure/web"
	"gestor_logistic/internal/infrastructure/worker"

	"github.com/joho/godotenv" // Opcional: Para cargar variables de entorno desde .env
)

func main() {
	// 1. Cargar variables de entorno (Opcional, pero recomendado para producción)
	// Si tienes un archivo .env, descomenta la siguiente línea:
	_ = godotenv.Load()

	// ---------------------------------------------------------------------
	// 2. Configuración de Base de Datos
	// ---------------------------------------------------------------------
	// NOTA: Cambia estas credenciales por las reales de tu PostgreSQL local o remoto.
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASSWORD", "ungSET23")
	dbName := getEnv("DB_NAME", "gestor_logistic")
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbSSL := getEnv("DB_SSL", "disable")

	dbConnectionString := "user=" + dbUser + " password=" + dbPass + " dbname=" + dbName + " host=" + dbHost + " port=" + dbPort + " sslmode=" + dbSSL

	log.Println("🔌 Conectando a la base de datos...")
	db, err := database.NewDBConnection(dbConnectionString)
	if err != nil {
		log.Fatalf("❌ Error crítico: No se pudo conectar a la base de datos. %v", err)
	}
	defer db.Close()
	log.Println("✅ Conexión a PostgreSQL establecida exitosamente.")

	// ---------------------------------------------------------------------
	// 3. Inyección de Dependencias (Clean Architecture)
	// ---------------------------------------------------------------------

	// Capa de Infraestructura (Repositorio y Parser)
	repo := database.NewPostgresRepository(db)
	csvParser := parser.NewCSVParser()

	// Capa de Negocio (Use Case)
	// Inyectamos el repositorio y el parser al servicio principal
	gestorService := usecase.NewGestorService(repo, csvParser)

	// Capa de Presentación (Handler / Controller)
	// Inyectamos el servicio al controlador HTTP
	operacionHandler := http.NewOperacionHandler(gestorService)

	// ---------------------------------------------------------------------
	// 4. Inicialización de Workers (Procesos en Segundo Plano)
	// ---------------------------------------------------------------------

	// Worker de Alertas (Proceso 1): Revisa vencimientos de documentos cada hora
	log.Println("⏰ Iniciando Worker de Alertas...")
	go worker.StartAlerterWorker(repo, 1*time.Hour)

	// ---------------------------------------------------------------------
	// 5. Configuración y Lanzamiento del Servidor Web
	// ---------------------------------------------------------------------

	// Configurar Router y Rutas (incluyendo Login y Middleware)
	router := web.SetupRouter(operacionHandler)

	serverPort := getEnv("PORT", "8080")
	log.Printf("🌐 Servidor Gestor Logístico iniciado en http://localhost:%s", serverPort)

	// Iniciar el servidor (Bloqueante)
	if err := router.Run(":" + serverPort); err != nil {
		log.Fatalf("❌ Error al iniciar el servidor: %v", err)
	}
}

// getEnv es una función auxiliar para leer variables de entorno con un valor por defecto
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
