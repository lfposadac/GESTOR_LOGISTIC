package parser

import (
	"encoding/csv"
	"gestor_logistic/internal/core/domain"
	"os"
)

type CSVParser struct{}

func NewCSVParser() *CSVParser {
	return &CSVParser{}
}

func (p *CSVParser) Parse(filePath string) ([]domain.ItemCSV, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	var items []domain.ItemCSV

	// Asumimos fila 0 cabecera. Ajustar índices según el archivo real.
	for i, r := range records {
		if i == 0 || len(r) < 30 {
			continue
		}

		// ÍNDICES APROXIMADOS (Basados en archivo Plano Davivienda/Bancolombia standard)
		// r[0]: Producto
		// r[2]: Proveedor
		// r[12]: Pais
		// r[26]: Cantidad
		// r[29]: Peso Neto/Bruto
		// r[34]: Marca
		// r[37]: Modelo
		// r[38]: Referencia
		// r[40]: Info Adicional
		// r[41]: Serial
		// r[45]: Descripción

		items = append(items, domain.ItemCSV{
			Producto:           r[0],
			ProveedorNombre:    r[2],
			Pais:               r[12],
			CantDavStr:         r[26],
			PesoStr:            r[29],
			Marca:              r[34],
			Modelo:             r[37],
			Referencia:         r[38],
			InfoComplementaria: r[40],
			Serial:             r[41],
			Descripcion:        r[45],
		})
	}
	return items, nil
}
