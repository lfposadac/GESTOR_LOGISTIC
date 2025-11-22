package usecase

import (
	"context"
	"errors"
	"io"
)

// Domain entity
type Gestor struct {
	ID   string
	Name string
	Meta map[string]interface{}
}

// Repository defines persistence operations.
// Implementations (e.g. SQL, in-memory, file) must satisfy this interface.
// This enables Dependency Inversion: the use case depends on an abstraction.
type Repository interface {
	Save(ctx context.Context, g *Gestor) error
	GetByID(ctx context.Context, id string) (*Gestor, error)
	List(ctx context.Context) ([]*Gestor, error)
}

// Parser defines how to parse incoming data into domain entities.
// New file formats can be supported by adding new Parser implementations
// without changing GestorService (Open/Closed principle).
type Parser interface {
	Parse(r io.Reader) ([]*Gestor, error)
}

// Common errors
var (
	ErrNotFound = errors.New("gestor not found")
)

// GestorService contains application/business logic and depends only on
// the Repository and Parser abstractions (inverted dependencies).
type GestorService struct {
	repo   Repository
	parser Parser
}

// NewGestorService constructs the service with injected abstractions.
func NewGestorService(repo Repository, parser Parser) *GestorService {
	return &GestorService{repo: repo, parser: parser}
}

// ImportFromReader parses data from r and persists each Gestor using the Repository.
// This method demonstrates Open/Closed: to support another format, provide another Parser.
func (s *GestorService) ImportFromReader(ctx context.Context, r io.Reader) ([]*Gestor, error) {
	gestores, err := s.parser.Parse(r)
	if err != nil {
		return nil, err
	}

	for _, g := range gestores {
		if err := s.repo.Save(ctx, g); err != nil {
			return nil, err
		}
	}

	return gestores, nil
}

// Create persists a single Gestor.
func (s *GestorService) Create(ctx context.Context, g *Gestor) error {
	return s.repo.Save(ctx, g)
}

// Get retrieves a Gestor by ID.
func (s *GestorService) Get(ctx context.Context, id string) (*Gestor, error) {
	g, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if g == nil {
		return nil, ErrNotFound
	}
	return g, nil
}

// List returns all Gestores.
func (s *GestorService) List(ctx context.Context) ([]*Gestor, error) {
	return s.repo.List(ctx)
}
