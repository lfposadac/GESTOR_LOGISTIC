package database

import (
	"context"
	"database/sql"
	"errors"
)

type Repository interface {
	GetByID(ctx context.Context, id int) (Entity, error)
	Save(ctx context.Context, entity Entity) error
}

type postgresRepository struct {
	db *sql.DB
}

type Entity struct {
	ID   int
	Name string
}

func NewPostgresRepository(db *sql.DB) Repository {
	return &postgresRepository{db: db}
}

func (r *postgresRepository) GetByID(ctx context.Context, id int) (Entity, error) {
	var entity Entity
	query := "SELECT id, name FROM entities WHERE id = $1"
	err := r.db.QueryRowContext(ctx, query, id).Scan(&entity.ID, &entity.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return Entity{}, errors.New("entity not found")
		}
		return Entity{}, err
	}
	return entity, nil
}

func (r *postgresRepository) Save(ctx context.Context, entity Entity) error {
	query := "INSERT INTO entities (id, name) VALUES ($1, $2)"
	_, err := r.db.ExecContext(ctx, query, entity.ID, entity.Name)
	return err
}
