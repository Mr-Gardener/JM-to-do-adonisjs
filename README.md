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
node ace build
```

## Deployment Notes

### build command on deployment platforms (e.g. Render):

```bash
npm ci && node ace build; # or npm install; npm run build
```

### Start command on deployment platforms (e.g. Render):

```bash
cd build && npm ci --omit=dev && node bin/server.js
```

Note: Do not override/fill the 'PORT' field in .env when deploying — Render provides them automatically.

## Project Structure

app/ → Controllers, Models, Services
bin/ → Entry points (server.ts, etc.)
build/ → Compiled production code
config/ → App configuration
database/ → Migrations and seeds
start/ → Kernel and boot files

## License

This project is licensed under the [MIT License](LICENSE).
