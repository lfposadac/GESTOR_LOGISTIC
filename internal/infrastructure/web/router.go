package web

import (
	"gestor_logistic/internal/handlers/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(h *http.OperacionHandler) *gin.Engine {
	r := gin.Default()

	// Configuración CORS
	c := cors.DefaultConfig()
	c.AllowAllOrigins = true
	c.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(c))

	// 1. Rutas Públicas (Auth)
	auth := r.Group("/api/auth")
	{
		auth.POST("/solicitud-otp", h.HandleSolicitarOTP)
		auth.POST("/verificar-otp", h.HandleVerificarOTP)
	}

	// 2. Rutas Protegidas (Requieren Token)
	api := r.Group("/api")
	api.Use(http.AuthMiddleware()) // El middleware se aplica a todo lo que esté dentro de 'api'
	{
		// Grupo Clientes (/api/clientes)
		clientes := api.Group("/clientes")
		{
			clientes.POST("/matricula", h.HandleMatricular)     // Crear
			clientes.GET("", h.HandleListarClientes)            // Listar todos
			clientes.GET("/:cliente_id/dos", h.HandleListarDOs) // Listar DOs de un cliente
		}

		// Rutas de Operaciones DO (/api/do)
		do := api.Group("/do")
		{
			do.POST("/:do_id/carga-csv", h.HandleCargaCSV)
			do.POST("/:do_id/fotos", h.HandleCargaFotos)
		}
	}

	return r
}
