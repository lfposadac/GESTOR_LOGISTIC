package usecase

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"

	"gestor_logistic/internal/core/domain"

	"github.com/golang-jwt/jwt/v5"
)

const CodigoDuracion = 24 * time.Hour

func getSecret() []byte {
	s := os.Getenv("JWT_SECRET")
	if s == "" {
		return []byte("fallback_secret_local")
	}
	return []byte(s)
}

type Repository interface {
	FindUserByEmail(email string) (domain.Usuario, error)
	UpdateUserOTP(id int, code string, expires time.Time) error
	SaveCliente(c domain.Cliente, docs []domain.DocumentoSoporte) (int, error)
	GetClientesPorVencer(d time.Time) ([]domain.DocumentoSoporte, error)
	UpdateAlertaNotificada(docID uint64) error
	CreateDO(do domain.DocumentoOperativo) (int, error)
	SaveOperacion(op domain.Item) error
	SaveFotoMetadata(foto domain.FotoItem) error
	GetAllClientes() ([]domain.Cliente, error)
	GetDOsByClienteID(id int) ([]domain.DocumentoOperativo, error)
}

type Parser interface {
	Parse(filePath string) ([]domain.ItemCSV, error)
}

type GestorService struct {
	Repo           Repository
	Parser         Parser
	processedCount int
}

func NewGestorService(r Repository, p Parser) *GestorService {
	return &GestorService{Repo: r, Parser: p}
}

func (s *GestorService) GetProcessedCount() int {
	return s.processedCount
}

// --- AUTH ---
func (s *GestorService) GenerateAndSendOTP(email string) error {
	user, err := s.Repo.FindUserByEmail(email)
	if err != nil {
		return fmt.Errorf("usuario no encontrado")
	}
	code := fmt.Sprintf("%06d", rand.Intn(999999))
	expiresAt := time.Now().Add(CodigoDuracion)
	if err := s.Repo.UpdateUserOTP(user.ID, code, expiresAt); err != nil {
		return err
	}
	fmt.Printf("\n📨 [EMAIL] Para: %s | Código: %s | Válido 24h\n", email, code)
	return nil
}

func (s *GestorService) AuthenticateWithOTP(email, otpCode string) (string, error) {
	user, err := s.Repo.FindUserByEmail(email)
	if err != nil {
		return "", fmt.Errorf("usuario no encontrado")
	}
	if user.CodigoTemporal != otpCode {
		return "", fmt.Errorf("código incorrecto")
	}
	if time.Now().After(user.CodigoExpiraA) {
		return "", fmt.Errorf("código expirado")
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"rol":   user.Rol,
		"exp":   time.Now().Add(CodigoDuracion).Unix(),
	})
	return claims.SignedString(getSecret())
}

// --- NEGOCIO ---
func (s *GestorService) MatricularCliente(c domain.Cliente, docs []domain.DocumentoSoporte) (int, error) {
	if c.Nit == "" {
		return 0, fmt.Errorf("NIT obligatorio")
	}
	if c.FechaMatricula.IsZero() {
		c.FechaMatricula = time.Now()
	}
	return s.Repo.SaveCliente(c, docs)
}

func (s *GestorService) ProcessAndSaveCSV(filePath string, doID int) error {
	s.processedCount = 0
	rawItems, err := s.Parser.Parse(filePath)
	if err != nil {
		return err
	}

	for _, raw := range rawItems {
		item := transformToDomain(raw)
		item.DoID = uint64(doID)
		if err := s.Repo.SaveOperacion(item); err != nil {
			fmt.Printf("⚠️ Error item: %v\n", err)
			continue
		}
		s.processedCount++
	}
	return nil
}

func (s *GestorService) SavePhotoMetadata(doID int, ruta string, itemIDs []int) error {
	return s.Repo.SaveFotoMetadata(domain.FotoItem{
		DoID:               uint64(doID),
		RutaAlmacenamiento: ruta,
		ItemsAsociados:     itemIDs,
	})
}

// Transformación ajustada a los campos requeridos
func transformToDomain(raw domain.ItemCSV) domain.Item {
	cant, _ := strconv.Atoi(raw.CantDavStr)
	peso, _ := strconv.ParseFloat(raw.PesoStr, 64)

	return domain.Item{
		Producto:           raw.Producto,
		Referencia:         raw.Referencia,
		Marca:              raw.Marca,
		Modelo:             raw.Modelo,
		Serial:             raw.Serial,
		InfoComplementaria: raw.InfoComplementaria,
		Descripcion:        raw.Descripcion,
		Cantidad:           cant,
		PesoKg:             peso,
		PaisOrigen:         raw.Pais,
		Proveedor:          raw.ProveedorNombre,
	}
}

func (s *GestorService) ListarClientes() ([]domain.Cliente, error) {
	return s.Repo.GetAllClientes()
}

func (s *GestorService) ListarDOs(clienteID int) ([]domain.DocumentoOperativo, error) {
	return s.Repo.GetDOsByClienteID(clienteID)
}
