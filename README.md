# JMTodo Backend

This is the backend for **JMTodo**, built with [AdonisJS](https://adonisjs.com/) and PostgreSQL.

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone <https://github.com/Mr-Gardener/JM-to-do-adonisjs.git>
cd backend
npm install
```

### Environment Variables

Copy the .env.example file to .env and update the values as needed

### Run in Development

```bash
node ace serve --watch
```

### Run Migrations

```bash
node ace migration:run
```

### Build for Production

```bash
npm run build
```

### Start in Production

```bash
node build/bin/server.js
```

## Deployment Notes

### build command on deployment platforms (e.g. Render):

```bash
npm ci && node ace build;
```

### Start command on deployment platforms (e.g. Render):

```bash
node build/bin/server.js
```

Note: Do not override/fill the PORT and NODE_ENV field in .env when deploying — Render provides them automatically.

## Project Structure

app/ → Controllers, Models, Services
bin/ → Entry points (server.ts, etc.)
build/ → Compiled production code
config/ → App configuration
database/ → Migrations and seeds
start/ → Kernel and boot files
