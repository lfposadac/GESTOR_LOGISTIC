package domain

import "time"

// Operacion representa una operación logística en el dominio.
type Operacion struct {
	ID            uint64     `json:"id"`
	Codigo        string     `json:"codigo"`
	Tipo          string     `json:"tipo"` // p. ej. "envío", "recepción"
	Fecha         time.Time  `json:"fecha"`
	Cliente       string     `json:"cliente"`
	Origen        string     `json:"origen"`
	Destino       string     `json:"destino"`
	PesoKg        float64    `json:"peso_kg"`
	VolumenM3     float64    `json:"volumen_m3"`
	Estado        string     `json:"estado"` // p. ej. "pendiente", "en tránsito", "entregado"
	Precio        float64    `json:"precio"`
	Moneda        string     `json:"moneda"`
	Conductor     string     `json:"conductor"`
	Vehiculo      string     `json:"vehiculo"`
	Observaciones string     `json:"observaciones"`
	UsuarioID     uint64     `json:"usuario_id"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     *time.Time `json:"deleted_at,omitempty"`
}

// OperacionCSV es una representación orientada a import/export CSV.
// Todos los campos son strings para facilitar el parsing desde/para CSV.
type OperacionCSV struct {
	Codigo        string `csv:"codigo"`
	Tipo          string `csv:"tipo"`
	Fecha         string `csv:"fecha"` // formato esperado: RFC3339 o el que defina la app
	Cliente       string `csv:"cliente"`
	Origen        string `csv:"origen"`
	Destino       string `csv:"destino"`
	PesoKg        string `csv:"peso_kg"`
	VolumenM3     string `csv:"volumen_m3"`
	Estado        string `csv:"estado"`
	Precio        string `csv:"precio"`
	Moneda        string `csv:"moneda"`
	Conductor     string `csv:"conductor"`
	Vehiculo      string `csv:"vehiculo"`
	Observaciones string `csv:"observaciones"`
}
