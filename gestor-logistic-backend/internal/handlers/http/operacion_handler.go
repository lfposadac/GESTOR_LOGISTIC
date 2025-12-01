package http

import (
	"context"
	"encoding/json"
	"io"
	stdhttp "net/http"
)

// OperacionInput representa el payload esperado para crear/ejecutar una operación.
type OperacionInput struct {
	ID     string  `json:"id,omitempty"`
	Nombre string  `json:"nombre"`
	Monto  float64 `json:"monto"`
}

// OperacionOutput representa la respuesta del caso de uso.
type OperacionOutput struct {
	ID     string `json:"id"`
	Estado string `json:"estado,omitempty"`
}

// OperacionUseCase define la interfaz que el handler usa para ejecutar la lógica de negocio.
// El proyecto debe proporcionar una implementación concreta de esta interfaz.
type OperacionUseCase interface {
	Execute(ctx context.Context, input OperacionInput) (OperacionOutput, error)
}

// OperacionHandler maneja solicitudes HTTP relacionadas con "operacion".
type OperacionHandler struct {
	uc OperacionUseCase
}

// NewOperacionHandler crea un handler con la dependencia del Use Case.
func NewOperacionHandler(uc OperacionUseCase) *OperacionHandler {
	return &OperacionHandler{uc: uc}
}

// Create maneja POST /operacion
// - decodifica JSON del body
// - valida campos mínimos
// - llama al Use Case
// - responde JSON con el resultado o error apropiado
func (h *OperacionHandler) Create(w stdhttp.ResponseWriter, r *stdhttp.Request) {
	if r.Method != stdhttp.MethodPost {
		writeError(w, stdhttp.StatusMethodNotAllowed, "método no permitido")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, stdhttp.StatusBadRequest, "no se pudo leer el cuerpo de la solicitud")
		return
	}
	defer r.Body.Close()

	var in OperacionInput
	if err := json.Unmarshal(body, &in); err != nil {
		writeError(w, stdhttp.StatusBadRequest, "payload JSON inválido")
		return
	}

	// validación mínima
	if in.Nombre == "" {
		writeError(w, stdhttp.StatusBadRequest, "campo 'nombre' es obligatorio")
		return
	}

	out, err := h.uc.Execute(r.Context(), in)
	if err != nil {
		// Aquí puede mapear errores de dominio a códigos HTTP más específicos.
		writeError(w, stdhttp.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, stdhttp.StatusCreated, out)
}

// writeJSON serializa la respuesta como JSON y escribe cabeceras.
func writeJSON(w stdhttp.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// writeError escribe un objeto de error simple como JSON.
func writeError(w stdhttp.ResponseWriter, status int, msg string) {
	type errResp struct {
		Error string `json:"error"`
	}
	writeJSON(w, status, errResp{Error: msg})
}
