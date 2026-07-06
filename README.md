# Quiz System

A full-stack quiz application built with **Spring Boot** (backend) and **Angular** (frontend). Features user authentication, quiz management, password recovery, and admin dashboard.

## 🚀 Features

### User Features
- **User Registration & Login** - Secure authentication with JWT tokens
- **Password Recovery** - Forgot password with email reset link
- **Take Quizzes** - Multiple choice questions with timer
- **View Results** - Detailed quiz results with score breakdown
- **Quiz History** - Track all attempted quizzes

### Admin Features
- **Admin Dashboard** - Overview statistics (total quizzes, users, attempts, average score)
- **Create Quizzes** - Add quizzes with multiple questions and options
- **Manage Quizzes** - Edit, activate/deactivate, delete quizzes
- **View All Results** - See all user quiz attempts and scores

### Technical Features
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - USER and ADMIN roles
- **Negative Marking** - Optional negative marking for wrong answers
- **Time Limits** - Configurable quiz time limits
- **Responsive UI** - Modern Angular frontend with gradient styling

---

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.2.5**
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

### Frontend
- **Angular 17**
- **TypeScript**
- **RxJS** - Reactive programming
- **Angular Router** - Navigation

---

## 📋 Prerequisites

Before running the application, ensure you have:

- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8+** - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

---

## ⚙️ Configuration

### Database Configuration

The application uses MySQL. Update `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_system?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

### Server Ports

| Service | Port |
|---------|------|
| Backend (Spring Boot) | 8082 |
| Frontend (Angular) | 4200 |
| MailHog SMTP (optional) | 1025 |
| MailHog Web UI (optional) | 8025 |

---

## 🚀 Getting Started

### 1. Start MySQL Database

Make sure MySQL is running on port 3306. The database `quiz_system` will be created automatically.

**Using Docker (alternative):**
```bash
docker run --name quiz-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=quiz_system -p 3306:3306 -d mysql:8
```

### 2. Start the Backend

```bash
cd quiz-system

# Using Maven wrapper (Windows)
.\mvnw.cmd spring-boot:run

# Using Maven wrapper (Linux/Mac)
./mvnw spring-boot:run

# Or build and run JAR
.\mvnw.cmd clean package
java -jar target/quiz-system-0.0.1-SNAPSHOT.jar
```

The backend will start at **http://localhost:8082**

### 3. Start the Frontend

```bash
cd quiz-frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start at **http://localhost:4200**

---

## 👤 Default Accounts

The application creates default accounts on first startup:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

---

## 📧 Password Reset (Email)

The password reset feature is configured to use **MailHog** for local testing.

### Option 1: Without MailHog (Console Logging)
When you request a password reset, the reset link is printed to the **backend console**:
```
===========================================
PASSWORD RESET LINK FOR USER: username
Email: user@example.com
Reset Link: http://localhost:4200/reset-password?token=abc123...
===========================================
```
Copy and paste the link in your browser to reset the password.

### Option 2: With MailHog (Email UI)
```bash
# Install MailHog (Windows with Chocolatey)
choco install mailhog

# Or run with Docker
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Start MailHog
MailHog
```
- SMTP: localhost:1025
- Web UI: http://localhost:8025

---

## 📁 Project Structure

```
quiz-system/
├── src/main/java/com/quiz/quiz_system/
│   ├── config/          # Security, CORS, DataInitializer
│   ├── controller/      # REST API endpoints
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA Entities
│   ├── exception/       # Global exception handling
│   ├── repository/      # JPA Repositories
│   ├── security/        # JWT filter and provider
│   └── service/         # Business logic
├── src/main/resources/
│   └── application.properties
├── quiz-frontend/
│   └── src/app/
│       ├── components/  # Angular components
│       ├── services/    # HTTP services
│       ├── models/      # TypeScript interfaces
│       └── interceptors/# HTTP interceptors
├── pom.xml
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Quizzes (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | Get all active quizzes |
| GET | `/api/quizzes/{id}` | Get quiz by ID |
| POST | `/api/quizzes/{id}/submit` | Submit quiz answers |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results` | Get current user's results |
| GET | `/api/results/{id}` | Get specific result |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get dashboard statistics |
| GET | `/api/admin/quizzes` | Get all quizzes |
| POST | `/api/admin/quiz` | Create new quiz |
| PUT | `/api/admin/quiz/{id}/toggle` | Toggle quiz active status |
| DELETE | `/api/admin/quiz/{id}` | Delete quiz |
| GET | `/api/admin/results` | Get all user results |

---

## 🔐 Security

- **JWT Tokens** - Stateless authentication with configurable expiration
- **Password Encoding** - BCrypt password hashing
- **Role-Based Access** - `@PreAuthorize` annotations for endpoint protection
- **CORS** - Configured for localhost:4200

---

## 🧪 Testing

### Test Backend
```bash
.\mvnw.cmd test
```

### Test Frontend
```bash
cd quiz-frontend
npm test
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8082
netstat -ano | findstr :8082

# Kill process by PID
taskkill /PID <PID> /F
```

### Database Connection Failed
- Ensure MySQL is running on port 3306
- Check username/password in `application.properties`
- Verify database `quiz_system` exists or `createDatabaseIfNotExist=true` is set

### Frontend Can't Connect to Backend
- Verify backend is running on port 8082
- Check CORS configuration allows `http://localhost:4200`
- Ensure no browser extensions blocking requests

### Password Reset Not Working
- Check backend console for the reset link (printed automatically)
- Ensure the token hasn't expired (1 hour validity)
- Verify the email exists in the database

---

## 📝 License

This project is for educational purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review backend console logs for errors
3. Check browser developer console (F12) for frontend errors

---

**Happy Quizzing! 🎉**

#   Q u i z M a n a g e m e n t  
 