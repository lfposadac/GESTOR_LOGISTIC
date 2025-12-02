package web

import (
	"gestor_logistic/internal/handlers/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(h *http.OperacionHandler) *gin.Engine {
	r := gin.Default()
	c := cors.DefaultConfig()
	c.AllowAllOrigins = true
	c.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(c))

	auth := r.Group("/api/auth")
	{
		auth.POST("/solicitud-otp", h.HandleSolicitarOTP)
		auth.POST("/verificar-otp", h.HandleVerificarOTP)
	}

	api := r.Group("/api")
	api.Use(http.AuthMiddleware())
	{
		api.POST("/clientes/matricula", h.HandleMatricular)
		api.POST("/do/:do_id/carga-csv", h.HandleCargaCSV)
		api.POST("/do/:do_id/fotos", h.HandleCargaFotos)
	}
	return r
}
