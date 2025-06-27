<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h2 align="center">📘 Memories API — NestJS Project</h2>

<p align="center">A secure and role-based API for managing memories built with <a href="https://nestjs.com">NestJS</a> and <a href="https://cloud.mongodb.com">MongoDB Atlas</a>.</p>

---

## 📦 Installation

```bash
npm install
```

## 🚀 Running the App
```bash
# Development mode
npm run start

# Watch mode (auto-restart on changes)
npm run start:dev

# Production mode
npm run start:prod
```

## ⚙️ Environment Configuration

PORT=3000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRE_IN=1h

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE_IN=7d

## 🧩 Project Structure

- common (const, enums, dtos, helpers, interfaces, types)
- guards (roles.decorator, authJwtGuard, RoleGuard)
- modules (appModule, authModule, memoriesModules, seedModule)
- schemas (users.schema, memories.schema) 

## 🔐 Roles & Permissions

| Role   | Description                | Endpoints                                      |
|--------|----------------------------|------------------------------------------------|
| READER | Can view memories          | `GET /memories`                                |
| CREATOR| Can add new memories       | `POST /memories`                               |
| EDITOR | Can update/delete memories | `PATCH /memories/:id`, `DELETE /memories/:id`  |

## 👥 Default Test Users

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Reader  | reader@test.com    | password123 |
| Creator | creator@test.com   | password123 |
| Editor  | editor@test.com    | password123 |

📚 Swagger Documentation

Once the server is running(Use your port), visit:

http://localhost:3000/api/docs

## 🧠 Useful Commands

```bash
# Format with Prettier
npm run format

# Lint check
npm run lint

```


