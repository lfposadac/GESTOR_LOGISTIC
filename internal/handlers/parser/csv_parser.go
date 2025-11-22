package parser

import (
	"encoding/csv"
	"errors"
	"io"
	"strings"
)

// CSVParser is a concrete implementation for parsing CSV input.
// It is generic and returns every row as a map keyed by the header names.
type CSVParser struct {
	// Comma is the field delimiter. Default is ','.
	Comma rune
	// TrimLeadingSpace indicates if leading space in a field should be ignored.
	TrimLeadingSpace bool
	// Comment, if non-zero, is the comment character (lines beginning with it are ignored).
	Comment rune
}

// NewCSVParser returns a CSVParser with sensible defaults.
func NewCSVParser() *CSVParser {
	return &CSVParser{
		Comma:            ',',
		TrimLeadingSpace: true,
		Comment:          0,
	}
}

// Parse reads CSV data from r and returns a slice of maps where each map represents a row.
// The first non-empty row is used as header. Header fields are trimmed and used as keys.
// If rows have fewer fields than the header they are padded with empty strings.
// If rows have more fields than the header, the extra fields are joined with ',' into the last header field.
func (p *CSVParser) Parse(r io.Reader) ([]map[string]string, error) {
	if r == nil {
		return nil, errors.New("nil reader")
	}

	cr := csv.NewReader(r)
	cr.Comma = p.Comma
	cr.TrimLeadingSpace = p.TrimLeadingSpace
	if p.Comment != 0 {
		cr.Comment = p.Comment
	}

	records, err := cr.ReadAll()
	if err != nil {
		if err == io.EOF {
			return nil, nil
		}
		return nil, err
	}
	if len(records) == 0 {
		return nil, nil
	}

	// find first non-empty header row
	var header []string
	var startIdx int
	for i, row := range records {
		empty := true
		for _, v := range row {
			if strings.TrimSpace(v) != "" {
				empty = false
				break
			}
		}
		if !empty {
			header = row
			startIdx = i + 1
			break
		}
	}
	if header == nil {
		return nil, errors.New("no header row found")
	}
	for i := range header {
		header[i] = strings.TrimSpace(header[i])
	}

	out := make([]map[string]string, 0, len(records)-startIdx)
	for _, row := range records[startIdx:] {
		// normalize row length to header length
		if len(row) < len(header) {
			pad := make([]string, len(header)-len(row))
			row = append(row, pad...)
		} else if len(row) > len(header) {
			// merge extras into last header field
			last := strings.Join(row[len(header)-1:], ",")
			newRow := make([]string, len(header))
			copy(newRow, row[:len(header)-1])
			newRow[len(header)-1] = last
			row = newRow
		}

		m := make(map[string]string, len(header))
		for i, h := range header {
			m[h] = strings.TrimSpace(row[i])
		}
		out = append(out, m)
	}

	return out, nil
}
