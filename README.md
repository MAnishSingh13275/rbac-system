# RBAC System

RBAC (Role-Based Access Control) System is a full-stack application that implements a user management system with role-based access control (RBAC). This system allows managing users, roles, and permissions with authentication using JWT (JSON Web Tokens) and **Prisma** as the ORM for database operations.

## Features

- **User Management**: Add, edit, and delete users.
- **Role-Based Access Control (RBAC)**: Assign roles to users and manage permissions.
- **Authentication**: Secure user login and logout using **JWT** (JSON Web Tokens).
- **Admin Dashboard**: Admin can view, edit, and delete users, manage roles and permissions.
- **Permissions**: Manage permissions linked to roles and users.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Prisma**: ORM for interacting with the database.
- **React**: JavaScript library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for making API requests.
- **bcrypt**: For hashing passwords.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Prisma Client**: To handle database operations with Prisma.

## Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Prisma** CLI (install globally if not already installed):

```bash
npm install -g prisma

```
## Step-by-Step Guide
- **Clone the repository:**
```
git clone https://github.com/your-username/rbac-system.git
cd rbac-system
```
- **Install dependencies::**
```
npm install
```
- **Set up the database:**
```
git clone https://github.com/your-username/rbac-system.git
cd rbac-system
```
- **Set up the database:**

- Create a **.env** file at the root of your project and configure your DATABASE_URL with your database connection string:
```
DATABASE_URL="your-database-url"
JWT_SECRET="your_secret_key"

```
- **Run the following Prisma commands to set up the database:**
```
npx prisma migrate dev --name init
npx prisma generate

```
- **Run the development server:**
```
npm run dev

```

## Environment Variables
- DATABASE_URL: The connection string to your database (required for Prisma to connect to the database).
- JWT_SECRET: A secret key used to sign JWT tokens (for authentication).

## API Reference

#### Authentication API

```http
POST /api/auth
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. The user's email |
| `password` | `string` | **Required**. The user's password |


#### Verify Token API

```http
POST /api/verify-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `string` | **Required**. JWT token in the form Bearer jwt_token_here |

#### User API
- Get all users

```http
GET /api/users
```

- Create a new user

```http
POST /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. The user's email |
| `name` | `string` | **Required**. The user's full name |
| `role.id` | `string` | **Required**. The ID of the user's role |
| `permissions` | `string` | **Required**. List of permissions to assign |
| `status` | `string` | **Required**. he status of the user ("ACTIVE" or "INACTIVE")|

- Update a user by ID

```http
PUT /api/users/{id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. The user's email |
| `name` | `string` | **Required**. The user's full name |
| `role.id` | `string` | **Required**. The ID of the user's role |
| `permissions` | `string` | **Required**. List of permissions to assign |
| `status` | `string` | **Required**. he status of the user ("ACTIVE" or "INACTIVE")|


- Delete a user by ID

```http
DELETE /api/users/{id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. The ID of the user to delete |



#### Role API

- Get all roles

```http
GET /api/roles
```

- Create a new role
```http
POST /api/roles
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. The name of the role |

#### Permission API

- Get all permissions
```http
GET /api/permissions
```

- Create a new permission

```http
POST /api/permissions
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. The name of the permission |