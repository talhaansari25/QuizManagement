# Quiz System API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most API endpoints require JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Standard Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

# Authentication Endpoints

## 1. Register User

**POST** `/api/auth/register`

Creates a new user account.

### Request Body
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| username | string | Yes | 3-50 characters | Unique username |
| email | string | Yes | Valid email format | User's email address |
| password | string | Yes | Min 6 characters | User's password |
| fullName | string | No | - | User's full name |

### Example Request
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Username already exists",
  "data": null
}
```

---

## 2. Login User

**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | User's username |
| password | string | Yes | User's password |

### Example Request
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid username or password",
  "data": null
}
```

---

# Quiz Endpoints

## 3. Get All Active Quizzes

**GET** `/api/quiz`

Retrieves all active quizzes available for users to take.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "Java Basics Quiz",
      "description": "Test your knowledge of Java fundamentals",
      "timeLimitMinutes": 30,
      "totalMarks": 100.0,
      "passingMarks": 40.0,
      "negativeMarking": false,
      "negativeMarkValue": 0.0,
      "isActive": true,
      "questionCount": 10,
      "createdAt": "2024-01-15T10:30:00"
    }
  ]
}
```

---

## 4. Get All Quizzes (Admin)

**GET** `/api/quiz/all`

Retrieves all quizzes including inactive ones (Admin only).

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "Java Basics Quiz",
      "description": "Test your knowledge of Java fundamentals",
      "timeLimitMinutes": 30,
      "totalMarks": 100.0,
      "passingMarks": 40.0,
      "negativeMarking": false,
      "negativeMarkValue": 0.0,
      "isActive": true,
      "questionCount": 10,
      "createdAt": "2024-01-15T10:30:00"
    },
    {
      "id": 2,
      "title": "Python Quiz",
      "description": "Python programming assessment",
      "timeLimitMinutes": 45,
      "totalMarks": 50.0,
      "passingMarks": 25.0,
      "negativeMarking": true,
      "negativeMarkValue": 0.5,
      "isActive": false,
      "questionCount": 5,
      "createdAt": "2024-01-10T09:00:00"
    }
  ]
}
```

---

## 5. Get Quiz by ID

**GET** `/api/quiz/{id}`

Retrieves a specific quiz with all its questions and options.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "title": "Java Basics Quiz",
    "description": "Test your knowledge of Java fundamentals",
    "timeLimitMinutes": 30,
    "totalMarks": 100.0,
    "passingMarks": 40.0,
    "negativeMarking": false,
    "negativeMarkValue": 0.0,
    "questions": [
      {
        "id": 1,
        "questionText": "What is the size of int in Java?",
        "marks": 10.0,
        "options": [
          {
            "id": 1,
            "optionKey": "A",
            "optionText": "16 bits"
          },
          {
            "id": 2,
            "optionKey": "B",
            "optionText": "32 bits"
          },
          {
            "id": 3,
            "optionKey": "C",
            "optionText": "64 bits"
          },
          {
            "id": 4,
            "optionKey": "D",
            "optionText": "8 bits"
          }
        ]
      }
    ]
  }
}
```

### Error Response (404 Not Found)
No response body.

---

## 6. Create Quiz (Admin)

**POST** `/api/quiz`

Creates a new quiz with questions and options.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |
| Content-Type | application/json | Yes |

### Authorization
Requires `ADMIN` role.

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Quiz title |
| description | string | No | Quiz description |
| timeLimitMinutes | integer | Yes | Time limit in minutes |
| totalMarks | double | Yes | Total marks for the quiz |
| passingMarks | double | No | Minimum marks to pass |
| negativeMarking | boolean | No | Enable negative marking |
| negativeMarkValue | double | No | Marks to deduct for wrong answers |
| questions | array | No | Array of questions |

### Question Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| questionText | string | Yes | Question text |
| marks | double | Yes | Marks for this question |
| correctKey | string | Yes | Correct option key (e.g., "A", "B") |
| options | array | No | Array of options |

### Option Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| optionKey | string | Yes | Option identifier (e.g., "A", "B") |
| optionText | string | Yes | Option text |

### Example Request
```json
{
  "title": "Java Basics Quiz",
  "description": "Test your knowledge of Java fundamentals",
  "timeLimitMinutes": 30,
  "totalMarks": 100.0,
  "passingMarks": 40.0,
  "negativeMarking": true,
  "negativeMarkValue": 0.25,
  "questions": [
    {
      "questionText": "What is the size of int in Java?",
      "marks": 10.0,
      "correctKey": "B",
      "options": [
        { "optionKey": "A", "optionText": "16 bits" },
        { "optionKey": "B", "optionText": "32 bits" },
        { "optionKey": "C", "optionText": "64 bits" },
        { "optionKey": "D", "optionText": "8 bits" }
      ]
    }
  ]
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "id": 1,
    "title": "Java Basics Quiz",
    "description": "Test your knowledge of Java fundamentals",
    "timeLimitMinutes": 30,
    "totalMarks": 100.0,
    "passingMarks": 40.0,
    "negativeMarking": true,
    "negativeMarkValue": 0.25,
    "isActive": true,
    "questionCount": 1,
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

---

## 7. Update Quiz (Admin)

**PUT** `/api/quiz/{id}`

Updates an existing quiz.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID to update |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |
| Content-Type | application/json | Yes |

### Authorization
Requires `ADMIN` role.

### Request Body
Same as Create Quiz.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Java Quiz",
    ...
  }
}
```

### Error Response (404 Not Found)
No response body.

---

## 8. Delete Quiz (Admin)

**DELETE** `/api/quiz/{id}`

Deletes a quiz and all associated data.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID to delete |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz deleted successfully",
  "data": null
}
```

### Error Response (404 Not Found)
No response body.

---

## 9. Toggle Quiz Status (Admin)

**POST** `/api/quiz/{id}/toggle-status`

Activates or deactivates a quiz.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz status updated",
  "data": {
    "id": 1,
    "title": "Java Basics Quiz",
    "isActive": false,
    ...
  }
}
```

---

## 10. Submit Quiz

**POST** `/api/quiz/submit`

Submits a quiz attempt with user's answers.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |
| Content-Type | application/json | Yes |

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quizId | Long | Yes | ID of the quiz |
| timeTakenSeconds | integer | No | Time taken to complete |
| answers | array | No | Array of answers |

### Answer Object
| Field | Type | Description |
|-------|------|-------------|
| questionId | Long | Question ID |
| selectedKey | string | Selected option key (e.g., "A") |
| selectedOptionKey | string | Alternative field for selected key |

### Example Request
```json
{
  "quizId": 1,
  "timeTakenSeconds": 1200,
  "answers": [
    { "questionId": 1, "selectedKey": "B" },
    { "questionId": 2, "selectedKey": "A" },
    { "questionId": 3, "selectedKey": "C" }
  ]
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "id": 1,
    "quizId": 1,
    "quizTitle": "Java Basics Quiz",
    "totalQuestions": 10,
    "correctAnswers": 8,
    "wrongAnswers": 1,
    "unanswered": 1,
    "totalMarks": 100.0,
    "obtainedMarks": 79.75,
    "percentage": 79.75,
    "isPassed": true,
    "timeTakenSeconds": 1200,
    "submittedAt": "2024-01-15T11:00:00"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Quiz not found",
  "data": null
}
```

---

# Result Endpoints

## 11. Get Results by User ID

**GET** `/api/result/{userId}`

Retrieves all quiz results for a specific user.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | Long | User ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "quizId": 1,
      "quizTitle": "Java Basics Quiz",
      "totalQuestions": 10,
      "correctAnswers": 8,
      "wrongAnswers": 1,
      "unanswered": 1,
      "totalMarks": 100.0,
      "obtainedMarks": 79.75,
      "percentage": 79.75,
      "isPassed": true,
      "timeTakenSeconds": 1200,
      "submittedAt": "2024-01-15T11:00:00"
    }
  ]
}
```

---

## 12. Get All Results (Admin)

**GET** `/api/result/all`

Retrieves all quiz results from all users.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "quizId": 1,
      "quizTitle": "Java Basics Quiz",
      "totalQuestions": 10,
      "correctAnswers": 8,
      "wrongAnswers": 1,
      "unanswered": 1,
      "totalMarks": 100.0,
      "obtainedMarks": 79.75,
      "percentage": 79.75,
      "isPassed": true,
      "timeTakenSeconds": 1200,
      "submittedAt": "2024-01-15T11:00:00"
    }
  ]
}
```

---

## 13. Get Results by Quiz ID (Admin)

**GET** `/api/result/quiz/{quizId}`

Retrieves all results for a specific quiz.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| quizId | Long | Quiz ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "quizId": 1,
      "quizTitle": "Java Basics Quiz",
      "totalQuestions": 10,
      "correctAnswers": 8,
      "wrongAnswers": 1,
      "unanswered": 1,
      "totalMarks": 100.0,
      "obtainedMarks": 79.75,
      "percentage": 79.75,
      "isPassed": true,
      "timeTakenSeconds": 1200,
      "submittedAt": "2024-01-15T11:00:00"
    }
  ]
}
```

---

# Admin Endpoints

## 14. Get Admin Statistics

**GET** `/api/admin/stats`

Retrieves dashboard statistics for admin.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "totalQuizzes": 15,
    "totalUsers": 100,
    "totalAttempts": 500,
    "averageScore": 68.5
  }
}
```

---

## 15. Get All Results (Admin Dashboard)

**GET** `/api/admin/results`

Retrieves detailed results for admin dashboard.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "quizTitle": "Java Basics Quiz",
      "score": 79.75,
      "totalMarks": 100.0,
      "correctAnswers": 8,
      "wrongAnswers": 1,
      "unanswered": 1,
      "percentage": 79.75,
      "passed": true,
      "attemptedAt": "2024-01-15T11:00:00"
    }
  ]
}
```

---

## 16. Get All Quizzes (Admin Dashboard)

**GET** `/api/admin/quizzes`

Retrieves all quizzes with detailed information.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quizzes retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Java Basics Quiz",
      "description": "Test your knowledge of Java fundamentals",
      "timeLimitMinutes": 30,
      "totalMarks": 100.0,
      "passingMarks": 40.0,
      "negativeMarking": true,
      "negativeMarkValue": 0.25,
      "isActive": true,
      "questionCount": 10,
      "attemptCount": 50,
      "createdAt": "2024-01-15T10:30:00"
    }
  ]
}
```

---

## 17. Create Quiz (Admin Dashboard)

**POST** `/api/admin/quiz`

Creates a new quiz via admin dashboard.

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |
| Content-Type | application/json | Yes |

### Authorization
Requires `ADMIN` role.

### Request Body
Same as Create Quiz endpoint (#6).

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "id": 1,
    "title": "Java Basics Quiz",
    ...
  }
}
```

---

## 18. Toggle Quiz Status (Admin Dashboard)

**PUT** `/api/admin/quiz/{id}/toggle`

Toggles quiz active status.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz status updated",
  "data": "activated"
}
```

or

```json
{
  "success": true,
  "message": "Quiz status updated",
  "data": "deactivated"
}
```

---

## 19. Delete Quiz (Admin Dashboard)

**DELETE** `/api/admin/quiz/{id}`

Deletes a quiz and all related data.

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Long | Quiz ID |

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {admin_token} | Yes |

### Authorization
Requires `ADMIN` role.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Quiz deleted successfully",
  "data": "deleted"
}
```

---

# Error Codes Summary

| HTTP Code | Description |
|-----------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

# Data Models

## User Roles
| Role | Description |
|------|-------------|
| USER | Regular user who can take quizzes |
| ADMIN | Administrator with full access |

## Quiz Status
| Status | Description |
|--------|-------------|
| isActive: true | Quiz is available for users to take |
| isActive: false | Quiz is hidden from users |

---

# Frontend Integration Notes

## CORS Configuration
The API allows requests from `http://localhost:4200` (Angular development server).

## Token Storage
Store the JWT token securely (e.g., localStorage or sessionStorage) and include it in all authenticated requests.

## Token Format
```javascript
// Example header setup
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

---

# API Endpoint Summary Table

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | /api/auth/register | Register new user | No | No |
| POST | /api/auth/login | User login | No | No |
| GET | /api/quiz | Get active quizzes | Yes | No |
| GET | /api/quiz/all | Get all quizzes | Yes | Yes |
| GET | /api/quiz/{id} | Get quiz details | Yes | No |
| POST | /api/quiz | Create quiz | Yes | Yes |
| PUT | /api/quiz/{id} | Update quiz | Yes | Yes |
| DELETE | /api/quiz/{id} | Delete quiz | Yes | Yes |
| POST | /api/quiz/{id}/toggle-status | Toggle quiz status | Yes | Yes |
| POST | /api/quiz/submit | Submit quiz answers | Yes | No |
| GET | /api/result/{userId} | Get user results | Yes | No |
| GET | /api/result/all | Get all results | Yes | Yes |
| GET | /api/result/quiz/{quizId} | Get results by quiz | Yes | Yes |
| GET | /api/admin/stats | Get admin statistics | Yes | Yes |
| GET | /api/admin/results | Get all results (detailed) | Yes | Yes |
| GET | /api/admin/quizzes | Get all quizzes (detailed) | Yes | Yes |
| POST | /api/admin/quiz | Create quiz | Yes | Yes |
| PUT | /api/admin/quiz/{id}/toggle | Toggle quiz status | Yes | Yes |
| DELETE | /api/admin/quiz/{id} | Delete quiz | Yes | Yes |

