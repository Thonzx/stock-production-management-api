# 🏭 Sistema de Gestão de Produção e Estoque

Sistema **Full Stack** desenvolvido para gerenciamento de produção industrial e controle de estoque de matérias-primas.

O projeto simula o cenário de uma fábrica que precisa:

* Controlar insumos
* Gerenciar produtos finais
* Definir receitas de fabricação (BOM)
* Calcular a capacidade máxima de produção com base no estoque disponível
* Identificar automaticamente gargalos produtivos

---

## 📌 Objetivo do Projeto

Este sistema foi desenvolvido para demonstrar:

* Modelagem de domínio com regras de negócio reais
* Arquitetura Full Stack moderna
* Integração entre Backend, Frontend e Banco de Dados
* Implementação de algoritmo de análise de gargalo produtivo

---

## 🏗️ Arquitetura do Sistema

Arquitetura cliente-servidor:

Frontend (React + Vite)
↓
Backend (Quarkus REST API)
↓
PostgreSQL (via Docker Dev Services)

---

## 🚀 Tecnologias Utilizadas

### 🔹 Backend

* Java 17
* Quarkus
* Hibernate ORM com Panache
* RESTEasy Reactive
* Maven

### 🔹 Frontend

* React
* Vite
* JavaScript

### 🔹 Banco de Dados

* PostgreSQL
* Docker (Dev Services do Quarkus)

---

## 🧠 Regras de Negócio Implementadas

### 1️⃣ Gestão de Produtos

* Cadastro com código único
* Nome e valor de mercado
* Validação de unicidade

### 2️⃣ Controle de Matérias-Primas

* Cadastro de insumos
* Controle de quantidade disponível
* Atualização dinâmica do estoque

### 3️⃣ Composição de Receitas (BOM)

* Associação de matérias-primas a produtos finais
* Definição da quantidade necessária por unidade fabricada

### 4️⃣ Cálculo de Produção Máxima

Lógica aplicada:

Quantidade possível por insumo = estoque disponível ÷ quantidade necessária
Capacidade máxima de produção = menor valor calculado entre os insumos

O sistema identifica automaticamente o gargalo produtivo.

---

## 🛠️ Como Executar o Projeto

### ✅ Pré-requisitos

* Docker em execução
* JDK 17 ou superior
* Node.js 18 ou superior

---

## ▶️ Executando o Backend

Na raiz do projeto:

**Linux/Mac**

```
./mvnw quarkus:dev
```

**Windows**

```
.\mvnw.cmd quarkus:dev
```

O backend estará disponível em:

[http://localhost:8080](http://localhost:8080)

O Quarkus utilizará Dev Services para subir automaticamente o PostgreSQL via Docker.

---

## ▶️ Executando o Frontend

Em outro terminal:

```
cd frontend
npm install
npm run dev
```

Frontend disponível em:

[http://localhost:5173](http://localhost:5173)

---

## 📂 Estrutura do Projeto

stock-production-manager/
├── backend/
├── frontend/
├── docs/             
└── README.md

---

---

## 📦 Build para Produção

O projeto está configurado para gerar artefatos otimizados para ambientes de produção.

### 🔹 Build do Frontend (React + Vite)
Gera os arquivos estáticos minificados na pasta `dist/`.

```bash
cd frontend
npm run build
```

### 🔹 Build do Backend (Quarkus)
O Quarkus utiliza o conceito de *Fast-Jar*, otimizando o tempo de inicialização e o consumo de memória. O artefato final será gerado na pasta `backend/target/quarkus-app/`.

```bash
cd backend
./mvnw clean package  # Linux/Mac
.\mvnw.cmd clean package # Windows
```

## 🧪 Estratégia de Testes Automatizados

O projeto foi construído com foco em qualidade e resiliência, utilizando uma estratégia de **Pirâmide de Testes**:

* **Back-end (Unitários e Integração):** Utilizado `JUnit 5` e `REST Assured` no Quarkus para validar os endpoints REST e a lógica do cálculo de gargalo de produção (RF004).
* **Front-end (Unitários):** Utilizado `Vitest` e `React Testing Library` para garantir a renderização de componentes e a segurança/bloqueio de rotas na tela de Login.
* **End-to-End (E2E):** Utilizado `Cypress` para simular a jornada real do usuário (Login ➔ Cadastro ➔ Receita ➔ Gargalo Matemático), validando a comunicação perfeita entre o React e o Banco de Dados.

![Demonstração do Teste E2E com Cypress](./docs/cypress-e2e.png)

---

## 📈 Possíveis Melhorias Futuras

* Autenticação com JWT
* Controle de estoque mínimo
* Dashboard com indicadores de produção
* Deploy em ambiente cloud

---

## 👨‍💻 Autor

Wellython Souza, 
Graduado em Engenharia de Software

Projeto desenvolvido como desafio prático para processo seletivo da Autoflex.
