package worker

import (
	"fmt"
	"time"

	"gestor_logistic/internal/core/usecase"
)

// StartAlerterWorker inicia una goroutine que se ejecuta cada 'interval'
func StartAlerterWorker(repo usecase.Repository, interval time.Duration) {
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		fmt.Println("⏰ [WORKER] Iniciado: Monitor de vencimientos de documentos")

		for {
			select {
			case <-ticker.C:
				runAlertCheck(repo)
			}
		}
	}()
}

func runAlertCheck(repo usecase.Repository) {
	// Regla de Negocio: Avisar 3 meses (90 días) antes
	fechaLimite := time.Now().AddDate(0, 3, 0)

	// Consultar documentos por vencer (Esta función debe existir en tu repo o devolver lista vacía si aún no se implementa la query)
	docs, err := repo.GetClientesPorVencer(fechaLimite)
	if err != nil {
		fmt.Printf("⚠️ [WORKER ERROR] Falló consulta de alertas: %v\n", err)
		return
	}

	for _, d := range docs {
		// Aquí se integraría el servicio de email real
		fmt.Printf("🔔 [ALERTA] El documento '%s' del cliente ID %d vence el %s\n",
			d.TipoDocumento, d.ClienteID, d.FechaVencimiento.Format("2006-01-02"))

		// Marcar como notificado para no spamear
		_ = repo.UpdateAlertaNotificada(d.ID)
	}
}
