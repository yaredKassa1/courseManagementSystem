# Course Management System

## Project Description

The Course Management System (CMS) is a full-stack web application designed to manage academic operations within an educational institution. It enables structured management of Departments, Courses, Students, Instructors, Enrollments, and Users with secure role-based access control (RBAC).

The system ensures that:

- **Admins** have full control over data (Create, Read, Update, Delete).
- **Users** (Students / Instructors) can only access information relevant to them.

The application follows a secure RESTful architecture with JWT authentication and role-based authorization.

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - `ROLE_ADMIN`
  - `ROLE_USER`
- Secure API access using Spring Security

### User Roles

- **Admin**
  - Manage users (create, update, activate/deactivate, reset passwords)
  - Manage departments
  - Manage courses
  - Manage students & instructors
  - Manage enrollments
  - Full CRUD access

- **User (Student / Instructor)**
  - View assigned courses
  - View enrollments
  - View academic information
  - Access personal dashboard
  - No modification privileges

## Dashboards

- **Admin Dashboard**: Full system management
- **Student Dashboard**: Courses, enrollments, profile
- **Instructor Dashboard**: (Optional extension)

## Architecture Overview

- The **Frontend** communicates with the **Backend** via REST APIs.
- The **Backend** secures endpoints using JWT & Spring Security.
- The **Frontend** enforces UI-level role restrictions.

## Technology Stack

### Backend

- Java 17+
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT (JSON Web Token)
- Hibernate
- PostgreSQL
- Maven

### Frontend

- Next.js (React)
- Axios
- Tailwind CSS
- JWT stored in localStorage
- Role-based route protection

## Setup and Run Instructions

### Backend Setup (Spring Boot)

1. Clone the repository:
   ```bash
   git clone https://github.com/yaredKassa1/courseManagementSystem.git
   cd backend

### Configure database in application.properties:

    spring.datasource.url=jdbc:mysql://localhost:3306/cms_db
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update

### Build and run:

 mvn clean install
 mvn spring-boot:run

### Backend runs on:
https://localhost:8080

### Frontend Setup (Next.js)
1. Navigate to the frontend folder:
  cd frontend
2. Install dependencies:
   npm install
3. Create .env.local:
   NEXT_PUBLIC_API_BASE_URL=https://localhost:8080
4. Run the application:
   npm run dev
5. Frontend runs on:
   http://localhost:3000

## Sample API Endpoints

### Authentication

| Method | Endpoint        | Description                      |
|--------|-----------------|----------------------------------|
| POST   | /auth/login     | Login and receive JWT           |
| POST   | /user/register   | Register new user                |

### Departments

| Method | Endpoint                     |
|--------|------------------------------|
| GET    | /api/departments             |
| POST   | /api/departments             |
| PUT    | /api/departments/{id}        |
| DELETE | /api/departments/{id}        |



| No. | Group Members      | ID Number |
|-----|--------------------|-----------|
| 1   | Yared Kassa      | 1303033    |
| 2   | Aklilu Mengesha    | 1300244  |
| 3   | Mastewal Tilaye     | 1302001   |
| 4   | Haftamu Teamr      | 1201031    |
| 5   | Betelhem Asmiro    | 1306222    |
 
