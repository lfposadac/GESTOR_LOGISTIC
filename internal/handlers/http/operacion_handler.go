package http

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"gestor_logistic/internal/core/domain"
	"gestor_logistic/internal/core/usecase"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type OperacionHandler struct {
	Service *usecase.GestorService
}

func NewOperacionHandler(s *usecase.GestorService) *OperacionHandler {
	return &OperacionHandler{Service: s}
}

// --- AUTH ---

func (h *OperacionHandler) HandleSolicitarOTP(c *gin.Context) {
	var req domain.OTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// Antes: 400 -> Ahora: http.StatusBadRequest
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}
	if err := h.Service.GenerateAndSendOTP(req.Email); err != nil {
		// Antes: 500 -> Ahora: http.StatusInternalServerError
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Antes: 200 -> Ahora: http.StatusOK
	c.JSON(http.StatusOK, gin.H{"message": "Código OTP enviado"})
}

func (h *OperacionHandler) HandleVerificarOTP(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}
	token, err := h.Service.AuthenticateWithOTP(req.Email, req.CodigoOTP)
	if err != nil {
		// Antes: 401 -> Ahora: http.StatusUnauthorized
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// --- MIDDLEWARE ---

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token requerido"})
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			secret := os.Getenv("JWT_SECRET")
			if secret == "" {
				secret = "fallback_secret_local"
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			return
		}
		c.Next()
	}
}

// --- NEGOCIO ---

func (h *OperacionHandler) HandleMatricular(c *gin.Context) {
	var req domain.MatriculaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, err := h.Service.MatricularCliente(req.Cliente, req.Documentos)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Antes: 201 -> Ahora: http.StatusCreated
	c.JSON(http.StatusCreated, gin.H{"cliente_id": id})
}

func (h *OperacionHandler) HandleCargaCSV(c *gin.Context) {
	doID, _ := strconv.Atoi(c.Param("do_id"))
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Archivo requerido"})
		return
	}

	path := fmt.Sprintf("tmp/%s", file.Filename)
	c.SaveUploadedFile(file, path)
	defer os.Remove(path)

	if err := h.Service.ProcessAndSaveCSV(path, doID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Procesado", "items": h.Service.GetProcessedCount()})
}

func (h *OperacionHandler) HandleCargaFotos(c *gin.Context) {
	doID, _ := strconv.Atoi(c.Param("do_id"))
	form, _ := c.MultipartForm()
	files := form.File["fotos"]

	// Simulación de asociación (en producción vendría del form)
	itemsIDs := []int{1}

	count := 0
	for _, f := range files {
		path := fmt.Sprintf("uploads/%s_%s", c.Param("do_id"), f.Filename)
		c.SaveUploadedFile(f, path)
		if h.Service.SavePhotoMetadata(doID, path, itemsIDs) == nil {
			count++
		}
	}
	c.JSON(http.StatusOK, gin.H{"processed": count})
}

func (h *OperacionHandler) HandleListarClientes(c *gin.Context) {
	lista, err := h.Service.ListarClientes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lista)
}

func (h *OperacionHandler) HandleListarDOs(c *gin.Context) {
	idStr := c.Param("cliente_id")
	id, _ := strconv.Atoi(idStr)
	lista, err := h.Service.ListarDOs(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lista)
}
