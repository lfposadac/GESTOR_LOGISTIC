package domain

import "time"

// 1. ENTIDADES DE SEGURIDAD Y AUTENTICACIÓN (Login OTP 24h)
// Usuario representa un usuario con acceso al sistema (para login).
type Usuario struct {
	ID             int       `json:"id"`
	Email          string    `json:"email"`
	Rol            string    `json:"rol"` // Ej: "coordinador", "analista1", "gerencia"
	CodigoTemporal string    // El código de un solo uso (OTP)
	CodigoExpiraA  time.Time // La validez del código (24 horas)
}

// OTPRequest es el payload para solicitar el código (Paso 1 del login).
type OTPRequest struct {
	Email string `json:"email"`
}

// LoginRequest es el payload que el cliente envía para verificar el código OTP.
type LoginRequest struct {
	Email     string `json:"email"`
	CodigoOTP string `json:"codigo_otp"`
}

// 2. ENTIDADES DE GESTIÓN DE CLIENTES (Proceso 1)
// Cliente representa el mandante en el sistema de logística.
type Cliente struct {
	ID                 uint64    `json:"id"`
	Nit                string    `json:"nit"` // Identificación única
	NombreLegal        string    `json:"nombre_legal"`
	RepresentanteLegal string    `json:"representante_legal"`
	FechaMatricula     time.Time `json:"fecha_matricula"`
	UsuarioPrueba      string    `json:"usuario_prueba"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// DocumentoSoporte almacena la información de los documentos de alerta del cliente.
type DocumentoSoporte struct {
	ID               uint64    `json:"id"`
	ClienteID        uint64    `json:"cliente_id"`
	TipoDocumento    string    `json:"tipo_documento"`    // RUT, Cámara de Comercio, Cédula Rep.
	FechaVencimiento time.Time `json:"fecha_vencimiento"` // Dispara la alerta de 3 meses
	RutaArchivo      string    `json:"ruta_archivo"`
	AlertaNotificada bool      `json:"alerta_notificada"`
	CreatedAt        time.Time `json:"created_at"`
}

// MatriculaRequest es el payload esperado para la matriculación (Proceso 1).
type MatriculaRequest struct {
	Cliente    Cliente            `json:"cliente"`
	Documentos []DocumentoSoporte `json:"documentos"`
}

// 3. ENTIDADES DEL DOCUMENTO OPERATIVO (DO) (Procesos 2, 4, 5)
// DocumentoOperativo (DO) representa el expediente logístico principal.
type DocumentoOperativo struct {
	ID            uint64    `json:"id"`
	ClienteID     uint64    `json:"cliente_id"`
	CodigoDO      string    `json:"codigo_do"`
	FechaCreacion time.Time `json:"fecha_creacion"`
	Estado        string    `json:"estado"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Item representa un bien o producto dentro de un Documento Operativo.
type Item struct { // Usada para persistir los datos limpios del CSV
	ID                 uint64  `json:"id"`
	DoID               uint64  `json:"do_id"`
	Producto           string  `json:"producto_id"` // Referencia o código
	Referencia         string  `json:"referencia"`
	Marca              string  `json:"marca"`
	Modelo             string  `json:"modelo"`
	Serial             string  `json:"serial"`
	InfoComplementaria string  `json:"info_complementaria"`
	Descripcion        string  `json:"descripcion"`
	Cantidad           int     `json:"cantidad"`
	PesoKg             float64 `json:"peso_kg"`
	PaisOrigen         string  `json:"pais_origen"`
	Proveedor          string  `json:"proveedor_nombre"`
}

// ItemCSV es una estructura RAW para el parsing CSV/Excel (Proceso 4).
// Todos los campos son strings para la lectura inicial, reflejando el formato de tu archivo 'PLANO 2 COLOMBIANA 3805.xlsx'.
type ItemCSV struct {
	Producto           string
	ProveedorNombre    string
	Pais               string
	Referencia         string
	Marca              string
	Modelo             string
	Serial             string
	InfoComplementaria string
	CantDavStr         string
	PesoStr            string
	Descripcion        string
}

// FotoItem almacena los metadatos de las imágenes cargadas masivamente (Proceso 4).
type FotoItem struct {
	ID                 uint64 `json:"id"`
	DoID               uint64 `json:"do_id"`
	RutaAlmacenamiento string `json:"ruta_almacenamiento"`
	ItemsAsociados     []int  `json:"items_asociados"` // IDs de los ítems a los que aplica (guardado como JSONB)
}

// DocumentoFinalPDF almacena la referencia a los archivos PDF generados (Proceso 5).
type DocumentoFinalPDF struct {
	ID              uint64    `json:"id"`
	DoID            uint64    `json:"do_id"`
	Version         int       `json:"version"`
	RutaArchivoPDF  string    `json:"ruta_archivo_pdf"`
	EstadoRevision  string    `json:"estado_revision"`
	FechaGeneracion time.Time `json:"fecha_generacion"`
}
