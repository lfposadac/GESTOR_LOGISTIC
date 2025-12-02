package database

import (
	"database/sql"
	"encoding/json"
	"time"

	"gestor_logistic/internal/core/domain"

	_ "github.com/lib/pq"
)

type PostgresRepository struct {
	DB *sql.DB
}

func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{DB: db}
}

func NewDBConnection(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return db, db.Ping()
}

// --- AUTH ---
func (r *PostgresRepository) FindUserByEmail(email string) (domain.Usuario, error) {
	var u domain.Usuario
	var ct sql.NullString
	var ce sql.NullTime
	err := r.DB.QueryRow("SELECT id, email, rol, codigo_temporal, codigo_expira_a FROM usuarios WHERE email=$1", email).
		Scan(&u.ID, &u.Email, &u.Rol, &ct, &ce)
	if ct.Valid {
		u.CodigoTemporal = ct.String
	}
	if ce.Valid {
		u.CodigoExpiraA = ce.Time
	}
	return u, err
}

func (r *PostgresRepository) UpdateUserOTP(id int, code string, expires time.Time) error {
	_, err := r.DB.Exec("UPDATE usuarios SET codigo_temporal=$1, codigo_expira_a=$2 WHERE id=$3", code, expires, id)
	return err
}

// --- NEGOCIO ---
func (r *PostgresRepository) SaveCliente(c domain.Cliente, docs []domain.DocumentoSoporte) (int, error) {
	tx, err := r.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	var cid int
	err = tx.QueryRow(`INSERT INTO clientes (nit, nombre_legal, representante_legal, usuario_prueba, fecha_matricula) 
		VALUES ($1, $2, $3, $4, $5) ON CONFLICT(nit) DO UPDATE SET nombre_legal=EXCLUDED.nombre_legal RETURNING id`,
		c.Nit, c.NombreLegal, c.RepresentanteLegal, c.UsuarioPrueba, c.FechaMatricula).Scan(&cid)
	if err != nil {
		return 0, err
	}

	for _, d := range docs {
		tx.Exec("INSERT INTO documentos_soporte (cliente_id, tipo_documento, fecha_vencimiento, ruta_archivo) VALUES ($1, $2, $3, $4)",
			cid, d.TipoDocumento, d.FechaVencimiento, d.RutaArchivo)
	}
	return cid, tx.Commit()
}

// INSERT ACTUALIZADO (Sin subpartida/valor, con los nuevos campos)
func (r *PostgresRepository) SaveOperacion(op domain.Item) error {
	query := `INSERT INTO items_do (
		do_id, producto, referencia, marca, modelo, serial, info_complementaria,
		descripcion, cantidad, peso_kg, pais_origen, proveedor
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`

	_, err := r.DB.Exec(query,
		op.DoID, op.Producto, op.Referencia, op.Marca, op.Modelo, op.Serial, op.InfoComplementaria,
		op.Descripcion, op.Cantidad, op.PesoKg, op.PaisOrigen, op.Proveedor,
	)
	return err
}

func (r *PostgresRepository) SaveFotoMetadata(foto domain.FotoItem) error {
	j, _ := json.Marshal(foto.ItemsAsociados)
	_, err := r.DB.Exec("INSERT INTO fotos_items (do_id, ruta_almacenamiento, items_asociados) VALUES ($1, $2, $3)",
		foto.DoID, foto.RutaAlmacenamiento, string(j))
	return err
}

// Stubs
func (r *PostgresRepository) CreateDO(do domain.DocumentoOperativo) (int, error) { return 1, nil }
func (r *PostgresRepository) GetClientesPorVencer(d time.Time) ([]domain.DocumentoSoporte, error) {
	return nil, nil
}
func (r *PostgresRepository) UpdateAlertaNotificada(docID uint64) error { return nil }
