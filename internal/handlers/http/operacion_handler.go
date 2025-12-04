package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

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

// ==========================================
// 1. AUTENTICACIÓN
// ==========================================

func (h *OperacionHandler) HandleSolicitarOTP(c *gin.Context) {
	var req domain.OTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}
	if err := h.Service.GenerateAndSendOTP(req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
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
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// Middleware de Autenticación
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token requerido"})
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			// LEER DEL ENTORNO DIRECTAMENTE (Seguridad)
			secret := os.Getenv("JWT_SECRET")
			if secret == "" {
				secret = "fallback_secreto_local" // Solo para dev
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

// ==========================================
// 2. GESTIÓN DE CLIENTES
// ==========================================

// HandleMatricular: Recibe Multipart Form (Texto JSON + Archivos Binarios)
func (h *OperacionHandler) HandleMatricular(c *gin.Context) {
	// A. Obtener los datos JSON del formulario (campo "data")
	dataStr := c.PostForm("data")
	if dataStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faltan datos del cliente (campo 'data')"})
		return
	}

	var req domain.MatriculaRequest
	if err := json.Unmarshal([]byte(dataStr), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido: " + err.Error()})
		return
	}

	// B. Procesar Archivos adjuntos
	// Iteramos sobre los documentos listados en el JSON
	for i := range req.Documentos {
		// Buscamos el archivo físico con la clave "doc_0", "doc_1", etc.
		fileKey := fmt.Sprintf("doc_%d", i)
		file, err := c.FormFile(fileKey)

		if err == nil {
			// Si el archivo existe, preparamos la carpeta
			uploadDir := "uploads/clientes"
			if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
				os.MkdirAll(uploadDir, 0755)
			}

			// Generamos nombre único para evitar colisiones
			ext := filepath.Ext(file.Filename)
			// Limpiamos espacios en el tipo de documento
			safeTipo := strings.ReplaceAll(req.Documentos[i].TipoDocumento, " ", "_")
			safeName := fmt.Sprintf("%s_%s_%d%s", req.Cliente.Nit, safeTipo, time.Now().UnixNano(), ext)
			savePath := filepath.Join(uploadDir, safeName)

			// Guardamos en disco
			if err := c.SaveUploadedFile(file, savePath); err == nil {
				// C. Actualizamos la ruta en la estructura para guardarla en la BD
				req.Documentos[i].RutaArchivo = savePath
			} else {
				fmt.Printf("⚠️ Error guardando archivo %s: %v\n", file.Filename, err)
			}
		}
	}

	// D. Llamar al Servicio para guardar en BD
	id, err := h.Service.MatricularCliente(req.Cliente, req.Documentos)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cliente_id": id})
}

// HandleListarClientes: Devuelve la lista de empresas
func (h *OperacionHandler) HandleListarClientes(c *gin.Context) {
	lista, err := h.Service.ListarClientes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lista)
}

// HandleListarDOs: Devuelve las operaciones de un cliente
func (h *OperacionHandler) HandleListarDOs(c *gin.Context) {
	idStr := c.Param("cliente_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de cliente inválido"})
		return
	}

	lista, err := h.Service.ListarDOs(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lista)
}

// ==========================================
// 3. OPERACIONES (DO)
// ==========================================

// HandleCargaCSV: Procesa el archivo plano de ítems
func (h *OperacionHandler) HandleCargaCSV(c *gin.Context) {
	doIDStr := c.Param("do_id")
	doID, err := strconv.Atoi(doIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de DO inválido"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Archivo requerido (key: 'file')"})
		return
	}

	// Guardar temporalmente
	if _, err := os.Stat("tmp"); os.IsNotExist(err) {
		os.Mkdir("tmp", 0755)
	}
	path := fmt.Sprintf("tmp/%d_%s", time.Now().Unix(), file.Filename)
	if err := c.SaveUploadedFile(file, path); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar archivo temporal"})
		return
	}
	defer os.Remove(path) // Limpiar al finalizar

	if err := h.Service.ProcessAndSaveCSV(path, doID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Procesado correctamente", "items": h.Service.GetProcessedCount()})
}

// HandleCargaFotos: Sube múltiples imágenes
func (h *OperacionHandler) HandleCargaFotos(c *gin.Context) {
	doIDStr := c.Param("do_id")
	doID, err := strconv.Atoi(doIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de DO inválido"})
		return
	}

	form, _ := c.MultipartForm()
	files := form.File["fotos"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No se enviaron fotos (key: 'fotos')"})
		return
	}

	// Directorio de uploads
	uploadDir := "uploads/fotos"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// TODO: Recibir itemsIDs del frontend si es necesario asociar a items específicos
	itemsIDs := []int{}

	count := 0
	for _, f := range files {
		// Nombre único
		safeName := fmt.Sprintf("%d_%d_%s", doID, time.Now().UnixNano(), f.Filename)
		path := filepath.Join(uploadDir, safeName)

		if err := c.SaveUploadedFile(f, path); err == nil {
			if h.Service.SavePhotoMetadata(doID, path, itemsIDs) == nil {
				count++
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{"processed": count, "message": "Fotos subidas correctamente"})
}
