# 📦 Gestor Logístico - IntegraComex

![Go](https://img.shields.io/badge/Backend-Go-blue) ![React](https://img.shields.io/badge/Frontend-React-61DAFB) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

**Languages / Idiomas / Idiomas:**
[Español](#español) | [English](#english) | [Português](#português)

---

## <a name="español"></a>🇪🇸 Español

### Descripción del Proyecto
El **Gestor Logístico** es una plataforma integral diseñada para optimizar los procesos de comercio exterior y aduanas. Su objetivo principal es centralizar la información operativa, garantizar el cumplimiento documental de los clientes y agilizar la inspección de mercancías mediante cargas masivas.

### ¿Para qué se usa?
Este software soluciona problemas críticos en la logística aduanera:

1.  **Seguridad Corporativa:**
    * Implementa un sistema de **Login con OTP (Código Temporal)**.
    * Los códigos se envían por correo y tienen una vigencia estricta de **24 horas**, eliminando el riesgo de contraseñas estáticas compartidas.

2.  **Gestión de Clientes (Compliance):**
    * Permite la **matrícula de clientes** (Importadores/Exportadores).
    * Controla la vigencia de documentos legales (RUT, Cámara de Comercio, Cédulas).
    * **Worker Automático:** Un proceso en segundo plano monitorea y envía alertas 3 meses antes de que un documento venza.

3.  **Operaciones (DOs):**
    * Creación y seguimiento de **Documentos Operativos (DO)**.
    * **Carga Masiva de Ítems:** Procesa archivos planos (Excel/CSV) para importar miles de referencias en segundos, mapeando campos específicos como *Producto, Marca, Modelo, Serial y Referencia*.
    * **Evidencia Fotográfica:** Permite subir fotos masivas asociadas a los ítems para inspecciones previas o reconocimiento de carga.

### Stack Tecnológico
* **Backend:** Golang (Clean Architecture, Gin, JWT, Goroutines).
* **Frontend:** React (Vite, Axios).
* **Base de Datos:** PostgreSQL.

---

## <a name="english"></a>🇺🇸 English

### Project Description
The **Logistics Manager** is a comprehensive platform designed to streamline foreign trade and customs processes. Its main goal is to centralize operational information, ensure client documentary compliance, and speed up merchandise inspection through bulk data uploads.

### What is it used for?
This software addresses critical issues in customs logistics:

1.  **Corporate Security:**
    * Implements an **OTP (One-Time Password) Login** system.
    * Access codes are sent via email and represent a strict **24-hour validity**, eliminating the security risks of shared static passwords.

2.  **Client Management (Compliance):**
    * Handles **Client Onboarding** (Importers/Exporters).
    * Tracks the expiration of legal documents (Tax IDs, Chamber of Commerce certificates).
    * **Background Worker:** An automated process monitors documents and sends alerts 3 months prior to expiration.

3.  **Operations (DOs):**
    * Creation and tracking of **Operational Documents (DO)**.
    * **Bulk Item Upload:** Processes flat files (Excel/CSV) to import thousands of SKUs in seconds, mapping specific fields like *Product, Brand, Model, Serial, and Reference*.
    * **Photographic Evidence:** Allows for the bulk upload of photos linked to specific items for pre-inspections or cargo recognition.

### Tech Stack
* **Backend:** Golang (Clean Architecture, Gin, JWT, Goroutines).
* **Frontend:** React (Vite, Axios).
* **Database:** PostgreSQL.

---

## <a name="português"></a>🇧🇷 Português

### Descrição do Projeto
O **Gestor Logístico** é uma plataforma abrangente projetada para otimizar processos de comércio exterior e alfandegários. Seu objetivo principal é centralizar informações operacionais, garantir a conformidade documental dos clientes e agilizar a inspeção de mercadorias através de carregamentos em massa.

### Para que serve?
Este software resolve problemas críticos na logística aduaneira:

1.  **Segurança Corporativa:**
    * Implementa um sistema de **Login com OTP (Código Temporário)**.
    * Os códigos são enviados por e-mail e têm validade estrita de **24 horas**, eliminando o risco de senhas estáticas compartilhadas.

2.  **Gestão de Clientes (Compliance):**
    * Permite o **Cadastro de Clientes** (Importadores/Exportadores).
    * Controla a vigência de documentos legais (CNPJ, Certidões, Documentos de Identificação).
    * **Worker Automático:** Um processo em segundo plano monitora e envia alertas 3 meses antes do vencimento de um documento.

3.  **Operações (DOs):**
    * Criação e acompanhamento de **Documentos Operacionais (DO)**.
    * **Carregamento em Massa de Itens:** Processa arquivos planos (Excel/CSV) para importar milhares de referências em segundos, mapeando campos específicos como *Produto, Marca, Modelo, Serial e Referência*.
    * **Evidência Fotográfica:** Permite o upload em massa de fotos associadas aos itens para inspeções prévias ou reconhecimento de carga.

### Stack Tecnológico
* **Backend:** Golang (Clean Architecture, Gin, JWT, Goroutines).
* **Frontend:** React (Vite, Axios).
* **Banco de Dados:** PostgreSQL.

---

## 🚀 Quick Start / Inicio Rápido

### 1. Database
```sql
-- Run the schema.sql script in PostgreSQL
cd GESTOR_LOGISTIC
go mod tidy
go run cmd/main.go
cd gestor-logistica-frontend
npm install
npm run dev