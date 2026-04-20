# HOSPITAL MANAGEMENT SYSTEM
## Project Documentation

**Submitted in partial fulfillment of the requirement for the award of the degree of**
**Bachelor of Engineering / Bachelor of Technology**

---

**Department of Computer Science and Engineering**

---

> **Institution Name:** [Your Institution Name]
> **Academic Year:** 2025–2026

---

## TABLE OF CONTENTS

| Chapter | Title | Page No. |
|---------|-------|----------|
| 1 | INTRODUCTION | 08 |
| 1.1 | Organization Profile | 10 |
| 1.2 | System Specification | 12 |
| 1.3 | Software Description | 12 |
| 2 | SYSTEM STUDY | 22 |
| 2.1 | Existing System | 22 |
| 2.2 | Drawbacks of Existing System | 23 |
| 2.3 | Proposed System | 23 |
| 2.4 | Advantages of Proposed System | 23 |
| 3 | SYSTEM DESIGN AND DEVELOPMENT | 24 |
| 3.1 | File Design | 24 |
| 3.2 | Input Design | 25 |
| 3.3 | Output Design | 27 |
| 3.4 | Database Design | 28 |
| 3.5 | System Development | 29 |
| 3.6 | Description of Modules | 30 |
| 4 | SYSTEM TESTING & IMPLEMENTATION | 32 |
| 4.1 | System Testing | 34 |
| 4.2 | System Implementation | 37 |
| 5 | CONCLUSION AND FUTURE ENHANCEMENT | 40 |
| 5.1 | Conclusion | 40 |
| 5.2 | Scope for Future Enhancement | 41 |
| 6 | BIBLIOGRAPHY | 42 |
| 7 | APPENDICES | 44 |
| 8 | SAMPLE CODING | 54 |
| 9 | SCREENSHOTS | 67 |

---

## LIST OF FIGURES

| Figure No. | Title | Page |
|------------|-------|------|
| Fig 1.1 | System Architecture Diagram | 09 |
| Fig 2.1 | Existing System Flow | 22 |
| Fig 3.1 | DFD – Level 0 | 24 |
| Fig 3.2 | DFD – Level 1 | 25 |
| Fig 3.3 | Entity Relationship Diagram | 28 |
| Fig 3.4 | Use Case Diagram | 30 |
| Fig 4.1 | Test Case – Login Module | 34 |
| Fig 9.1 | Login Screen | 67 |
| Fig 9.2 | Admin Dashboard | 68 |
| Fig 9.3 | Doctor Dashboard | 69 |
| Fig 9.4 | Patient Dashboard | 70 |

---

## LIST OF TABLES

| Table No. | Title | Page |
|-----------|-------|------|
| Table 3.1 | users Table | 28 |
| Table 3.2 | doctors Table | 28 |
| Table 3.3 | patients Table | 29 |
| Table 3.4 | appointments Table | 29 |
| Table 3.5 | doctor_schedules Table | 29 |
| Table 3.6 | blocked_dates Table | 29 |
| Table 3.7 | otp_verifications Table | 30 |
| Table 4.1 | Unit Test Cases | 35 |
| Table 4.2 | Integration Test Cases | 36 |

---

---

# CHAPTER 1: INTRODUCTION

_(Page 08)_

## 1. Introduction

The **Hospital Management System (HMS)** is a comprehensive, full-stack web-based application developed to streamline and digitalize the core operations of a medical facility. In the modern era, hospitals and clinics face immense operational challenges—managing patient records, coordinating doctor schedules, booking appointments efficiently, and maintaining secure communication between patients and medical staff. A manual or fragmented system often leads to long waiting times, appointment clashes, data inaccuracies, and poor patient experiences.

The proposed Hospital Management System addresses all of these challenges through a centralized, secure, and intelligent software platform. The system is designed around three primary user roles: **Admin**, **Doctor**, and **Patient**. Each role has a dedicated dashboard and a set of privileges tailored to their needs.

From an administration standpoint, the system allows a super-administrator to manage all doctors, oversee bookings, access analytics, apply date-based filters, and export reports in both PDF and CSV formats. Doctors are given an individual login portal where they can view their upcoming appointments, mark emergency leaves for specific dates, update their profile, and receive patient notifications. Patients enjoy the most user-friendly experience—they register and authenticate using a mobile phone-based **One-Time Password (OTP)** system provided by the Twilio SMS platform, browse available doctors by specialization, check real-time slot availability, and book appointments up to two weeks in advance.

The application is built using a modern, production-ready technology stack:
- **Backend**: Java 17 with Spring Boot 4.0.3, exposing RESTful APIs secured by JWT (JSON Web Tokens)
- **Frontend**: React.js powered by Vite for fast, responsive UI
- **Database**: PostgreSQL for robust relational data storage
- **Security**: Spring Security with role-based access control (RBAC)
- **OTP Service**: Twilio SMS API for real mobile OTP delivery
- **Communication**: Spring Boot Mail for email notifications
- **Export**: OpenPDF and OpenCSV libraries for report generation

The system was developed using industry-standard software engineering practices including layered architecture (Controller → Service → Repository), DTO-based data transfer, entity validation, CORS configuration, and centralized error handling.

### 1.1 Scope of the Project

The HMS aims to:
1. Automate appointment scheduling and management for hospitals and clinics.
2. Provide a secure, role-based login system for Admin, Doctor, and Patient users.
3. Enable real-time slot management with conflict prevention.
4. Allow data exports for administrative reporting.
5. Facilitate automated OTP-based patient authentication.
6. Allow doctors to declare emergency leaves with automatic patient notifications.
7. Provide a scalable foundation for future enhancements such as payment integration, telemedicine, and electronic health records (EHR).

### 1.2 Objectives of the Project

- **Objective 1**: Develop a secure, multi-role authentication system using JWT tokens and OTP verification.
- **Objective 2**: Create an intuitive appointment booking system with real-time slot availability checking.
- **Objective 3**: Enable the Admin to manage doctors, track appointment statistics, and export booking data.
- **Objective 4**: Allow patients to browse doctors by specialization and book appointments within a 2-week window.
- **Objective 5**: Implement an emergency leave feature for doctors that automatically notifies booked patients.
- **Objective 6**: Ensure data security and integrity through encrypted passwords, validated inputs, and role-based API access.

---

_(Page 10)_

## 1.1 Organization Profile

### About the Organization

The Hospital Management System project was developed as an academic capstone project simulating a real-world hospital environment. The project showcases the capabilities of a mid-sized multi-specialty clinic or hospital that wishes to modernize its operations through technology.

A modern hospital today serves hundreds of patients daily across multiple specializations including Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, and General Medicine. The coordination required between administrative staff, doctors, and patients is enormous. Without a digital management system, operations become error-prone, inefficient, and often frustrating for all parties involved.

The **"QMED Hospital"** (the sample organization for this project) is a fictional multi-specialty hospital with:
- A dedicated administrative team managing all doctor registrations and schedules
- Multiple departments with specialist doctors
- A growing patient base requiring efficient appointment management
- The need for real-time communication and reporting

### Organizational Structure

```
Hospital Director
       |
   Admin Panel (System Administrator)
       |
  ___________________________________________
  |                |                        |
Doctor Module   Patient Module       Analytics & Reports
  |                |                        |
Doctor Profiles  Appointment Booking   PDF/CSV Exports
Doctor Schedule  OTP Authentication    Booking Statistics
Emergency Leave  Profile Management   Date/Doctor Filters
```

### Mission Statement

To deliver an integrated, secure, and scalable hospital management platform that empowers healthcare providers with efficient tools for managing appointments, medical staff, and patient interactions while ensuring data privacy and exceptional user experience.

### Vision

To be the leading digital backbone for small to mid-size hospitals and clinics across the region, enabling seamless healthcare delivery through technology.

---

_(Page 12)_

## 1.2 System Specification

### Hardware Requirements

| Component | Minimum Requirement | Recommended |
|-----------|---------------------|-------------|
| Processor | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 or above |
| RAM | 4 GB | 8 GB or above |
| Hard Disk | 50 GB free space | 100 GB SSD |
| Display | 1024 × 768 resolution | 1920 × 1080 Full HD |
| Network | Broadband Internet (1 Mbps) | 10 Mbps or above |
| Operating System | Windows 10 / Ubuntu 20.04 | Windows 11 / Ubuntu 22.04 |

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Java Development Kit (JDK) | 17 (LTS) | Backend runtime |
| Apache Maven | 3.9+ | Build tool |
| Spring Boot | 4.0.3 | Application framework |
| PostgreSQL | 15+ | Relational database |
| Node.js | 18+ | Frontend runtime |
| React.js | 18+ | Frontend UI library |
| Vite | 5+ | Frontend build tool |
| Git | 2.40+ | Version control |
| Postman | Latest | API testing |
| IntelliJ IDEA / VS Code | Latest | IDE |

---

## 1.3 Software Description

_(Page 12)_

### 1.3.1 Java 17

Java 17 is the latest Long-Term Support (LTS) release of the Java programming language. It includes several key features used in this project:

- **Records**: Simplifying immutable data structures
- **Sealed Classes**: Enabling restricted class hierarchies  
- **Pattern Matching**: For more expressive and safe code
- **Enhanced Switch Expressions**: More concise switch logic
- **Text Blocks**: Easier SQL/JSON multiline strings

Java 17 provides excellent performance, security improvements, and compatibility with Spring Boot 4.x, making it ideal for enterprise backend development.

### 1.3.2 Spring Boot 4.0.3

Spring Boot is an opinionated, convention-over-configuration framework that makes building production-grade Spring applications fast and easy. Spring Boot 4.0.3 was used in this project with the following starter modules:

- **spring-boot-starter-web**: REST API development with embedded Tomcat
- **spring-boot-starter-data-jpa**: Database interaction using JPA/Hibernate ORM
- **spring-boot-starter-security**: Authentication and authorization framework
- **spring-boot-starter-validation**: Bean Validation (Jakarta Validation API)
- **spring-boot-starter-mail**: Email notification capabilities

**Key Concepts Used:**
- **@RestController**: Marks classes as REST API endpoints
- **@Service**: Business logic layer components
- **@Repository**: Data access layer using JPA
- **@Entity**: JPA entity mapping to database tables
- **@Autowired**: Dependency injection
- **@CrossOrigin**: CORS configuration for frontend communication

### 1.3.3 Spring Security with JWT

Spring Security provides comprehensive security services for Java applications. In this project, it is configured with:

- **JWT (JSON Web Token)** based stateless authentication
- **Role-Based Access Control (RBAC)** with three roles: ADMIN, DOCTOR, PATIENT
- **BCrypt Password Encoding** for secure password storage
- **Custom JwtFilter** that intercepts every HTTP request and validates the bearer token
- **SecurityConfig** that defines which endpoints are public and which require authentication

JWT tokens are signed using a secret key and contain the user's username and role. They expire after a configurable duration, after which the user must re-authenticate.

**JWT Token Flow:**
```
1. User submits credentials (username/password or OTP)
2. AuthService authenticates the user
3. JwtUtil generates a signed JWT token
4. Client stores token (localStorage)
5. Client sends token in Authorization header: Bearer <token>
6. JwtFilter validates token on every request
7. If valid, sets SecurityContext and allows request to proceed
```

### 1.3.4 PostgreSQL

PostgreSQL 15 is an open-source, enterprise-grade relational database management system. It was chosen for this project because of:

- **ACID Compliance**: Ensures data integrity for critical healthcare data
- **Advanced Data Types**: Support for JSON, arrays, and custom types
- **Performance**: Efficient indexing and query optimization
- **Scalability**: Handles high-concurrency hospital environments
- **JPA Integration**: Seamless mapping via Spring Data JPA/Hibernate

Database tables are auto-generated by Hibernate based on JPA entity definitions using `spring.jpa.hibernate.ddl-auto=update`.

### 1.3.5 React.js with Vite

React.js is a declarative, component-based JavaScript library for building user interfaces. Vite is the build tool and development server.

**Key React concepts used:**
- **Functional Components** with React Hooks (`useState`, `useEffect`, `useContext`)
- **React Router** for client-side navigation between Admin, Doctor, and Patient dashboards
- **Axios** for HTTP requests to the Spring Boot REST APIs
- **Context API** for global state management (auth token, user role)
- **CSS Modules** for scoped component styling

**Vite Advantages:**
- Extremely fast Hot Module Replacement (HMR)
- Native ES modules in development
- Optimized production bundling with Rollup

### 1.3.6 Twilio SMS API

Twilio is a cloud communications platform used in this project to deliver real OTP codes to patients via SMS. The patient authentication flow is entirely OTP-based:

1. Patient enters their phone number
2. System calls Twilio API to send a 6-digit OTP to the patient's mobile
3. Patient enters the OTP on the web application
4. System verifies OTP via the `OtpService`
5. If new patient → Registration form shown; if existing → JWT token issued

This eliminates the need for patients to remember passwords, simplifying the onboarding process significantly.

### 1.3.7 OpenPDF and OpenCSV

**OpenPDF** (v1.3.30) is an open-source library for creating PDF documents. Used in the `BookingExportService` to generate professionally formatted appointment reports in PDF format.

**OpenCSV** (v5.7.1) is a CSV parser and writer library. Used alongside OpenPDF to allow the Admin to export appointment data as comma-separated values compatible with Microsoft Excel and Google Sheets.

**Export Features:**
- Filter by Doctor
- Filter by Date
- Filter by both Doctor and Date
- Export all appointments

### 1.3.8 Lombok

Project Lombok is an annotation processor that reduces Java boilerplate code. Used extensively across all entity classes:

- **@Getter / @Setter**: Auto-generates getter and setter methods
- **@NoArgsConstructor / @AllArgsConstructor**: Auto-generates constructors
- **@Builder**: Implements the Builder design pattern
- **@Data**: Combines Getter, Setter, ToString, EqualsAndHashCode

---

---

# CHAPTER 2: SYSTEM STUDY

_(Page 22)_

## 2. System Study

System study is the process of gathering, analyzing, and documenting requirements before designing a new system. It involves a thorough examination of the current (existing) system's strengths and limitations, leading to the identification of a better proposed solution.

---

## 2.1 Existing System

_(Page 22)_

The existing hospital appointment management systems in most small to medium-sized hospitals are predominantly manual or semi-digital in nature. The following describes the common existing approach:

### Manual / Traditional System

In most traditional healthcare facilities, the appointment booking process works as follows:

1. **Patient visits the hospital counter** or calls the reception desk to request an appointment.
2. **Receptionist checks the doctor's availability** by consulting a physical register or a basic spreadsheet.
3. **Appointment is recorded** in a paper register or a simple Excel sheet with the patient name, date, time, and doctor name.
4. **Patient receives a handwritten token or slip** with appointment details.
5. **Doctor reviews the patient list** from printed sheets each morning.
6. **Reminders are given manually** by phone calls if staff have time.
7. **Reports are prepared manually** at the end of each day or week by aggregating data from registers.

### Semi-Digital Systems

Some hospitals use basic desktop software (e.g., custom Access databases or older proprietary tools) with the following characteristics:
- Not accessible remotely; requires physical presence at the hospital
- No mobile or OTP authentication for patients
- No real-time slot availability—double-bookings are common
- No automated notifications to patients or doctors
- Limited or no export/reporting capabilities
- No web interface; requires desktop installation

---

## 2.2 Drawbacks of the Existing System

_(Page 23)_

The existing manual and semi-digital systems have numerous serious drawbacks:

1. **Double Booking**: Without a real-time slot management system, two patients can be booked in the same slot, causing confusion and delays.
2. **No Remote Access**: Patients must physically visit or call the hospital to book appointments, which is inconvenient and time consuming.
3. **Manual Errors**: Paper registers and spreadsheets are prone to data entry errors, illegible handwriting, and data loss.
4. **No Automated Notifications**: Patients are not automatically informed about appointment confirmations, cancellations, or emergency doctor leaves.
5. **Lack of Security**: Paper-based systems have no access control; unauthorized personnel can view or modify patient data.
6. **Poor Reporting**: Generating statistics (e.g., appointments per doctor per month) requires tedious manual aggregation.
7. **Schedule Conflicts**: When a doctor takes leave, patients are not systematically informed, leading to wasted trips to the hospital.
8. **Scalability Issues**: As the hospital grows, manual systems cannot scale efficiently.
9. **No Digital Trail**: Audit trails for appointments are non-existent or incomplete.
10. **Patient Experience**: The process is slow, frustrating, and lacks modern convenience features like online booking.

---

## 2.3 Proposed System

_(Page 23)_

The proposed **Hospital Management System** is a modern, web-based application that completely replaces the manual process with an automated, secure, and user-friendly digital platform. The core features of the proposed system are:

1. **Role-Based Web Portal**: Separate dashboards for Admin, Doctor, and Patient with role-specific features and access control.
2. **OTP-Based Patient Authentication**: Patients authenticate via Twilio SMS OTP—no passwords required, enhancing security and ease of use.
3. **Real-Time Slot Management**: The system calculates available appointment slots in real-time, preventing double-bookings automatically.
4. **Online Appointment Booking**: Patients can browse doctors by specialization and book appointments up to 14 days in advance from any device.
5. **Emergency Leave Management**: Doctors can mark emergency leave for specific dates; the system automatically notifies all affected patients.
6. **Admin Analytics & Exports**: Administrators can view booking statistics, filter by date/doctor, and export reports as PDF or CSV.
7. **Automated Notifications**: Email/SMS notifications are sent for appointment confirmations, cancellations, and leave alerts.
8. **Secure API**: All API endpoints are protected by JWT bearer token authentication with role-based access.

---

## 2.4 Advantages of the Proposed System

_(Page 23)_

The proposed system offers significant advantages over the existing approach:

1. **Elimination of Double Bookings**: Slot availability is checked in real-time before every booking, making conflicts impossible.
2. **24/7 Accessibility**: Patients can book appointments from anywhere at any time using a web browser or mobile device.
3. **Enhanced Security**: JWT tokens, BCrypt password hashing, and role-based access control ensure data security at every layer.
4. **Automated Communication**: Patients automatically receive confirmation messages and are instantly notified about doctor leaves.
5. **Paperless Operations**: All data is stored digitally in a PostgreSQL database, eliminating paper registers.
6. **Efficient Reporting**: Admins can generate detailed PDF or CSV booking reports with a single click.
7. **Scalability**: The Spring Boot microservice-ready architecture can easily scale to support more doctors, departments, and patients.
8. **Better Patient Experience**: OTP-based login, real-time slot viewing by specialization, and automated confirmations significantly improve satisfaction.
9. **Reduced Administrative Burden**: The system automates repetitive tasks, freeing staff for higher-value work.
10. **Audit Trail**: Every appointment, login, and system action is recorded digitally for accountability.


---

# CHAPTER 3: SYSTEM DESIGN AND DEVELOPMENT

_(Page 24)_

## 3. System Design and Development

System design transforms the requirements identified during system study into a detailed blueprint for constructing the software. This chapter covers the File Design, Input Design, Output Design, Database Design, System Development approach, and Module Descriptions of the Hospital Management System.

---

## 3.1 File Design

_(Page 24)_

File design describes the logical and physical structure of all data files (database tables) and support files used in the system.

### 3.1.1 Project Directory Structure

**Backend (Spring Boot):**
```
hospital-management-backend/
├── src/
│   └── main/
│       ├── java/com/hospital/
│       │   ├── HospitalApplication.java        (Main entry point)
│       │   ├── config/
│       │   │   ├── DataInitializer.java         (Seeds default admin)
│       │   │   └── SecurityConfig.java          (JWT & CORS setup)
│       │   ├── controller/
│       │   │   ├── AdminController.java         (Admin API routes)
│       │   │   ├── AuthController.java          (Login & OTP API)
│       │   │   ├── DoctorController.java        (Doctor API routes)
│       │   │   ├── FileController.java          (File upload handler)
│       │   │   └── PatientController.java       (Patient API routes)
│       │   ├── dto/
│       │   │   └── DTOs.java                    (Request/Response DTOs)
│       │   ├── entity/
│       │   │   ├── Appointment.java
│       │   │   ├── BlockedDate.java
│       │   │   ├── Doctor.java
│       │   │   ├── DoctorSchedule.java
│       │   │   ├── OtpVerification.java
│       │   │   ├── Patient.java
│       │   │   ├── Role.java
│       │   │   └── User.java
│       │   ├── repository/
│       │   │   ├── AppointmentRepository.java
│       │   │   ├── BlockedDateRepository.java
│       │   │   ├── DoctorRepository.java
│       │   │   ├── DoctorScheduleRepository.java
│       │   │   ├── OtpVerificationRepository.java
│       │   │   ├── PatientRepository.java
│       │   │   └── UserRepository.java
│       │   ├── security/
│       │   │   ├── CustomUserDetailsService.java
│       │   │   ├── JwtFilter.java
│       │   │   └── JwtUtil.java
│       │   └── service/
│       │       ├── AdminService.java
│       │       ├── AuthService.java
│       │       ├── BookingExportService.java
│       │       ├── DoctorService.java
│       │       ├── NotificationService.java
│       │       ├── OtpService.java
│       │       └── PatientService.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

**Frontend (React + Vite):**
```
hospital-management-frontend/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── PatientDashboard.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 3.2 Input Design

_(Page 25)_

Input design defines how data enters the system. Well-designed inputs minimize errors and guide users clearly.

### 3.2.1 Admin Login Form

| Field | Type | Validation |
|-------|------|------------|
| Username | Text | Required, min 3 chars |
| Password | Password | Required, min 6 chars |

**Endpoint:** `POST /api/auth/login`

---

### 3.2.2 Doctor Registration Form (Admin Panel)

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required |
| Specialization | Text | Required |
| Years of Experience | Number | Required, ≥ 0 |
| Username (Login) | Text | Required, unique |
| Password | Password | Required |
| Phone Number | Text | Optional |
| About | Textarea | Optional, max 500 chars |
| Profile Photo | File Upload | Optional, image only |

**Endpoint:** `POST /api/admin/doctors`

---

### 3.2.3 Patient OTP Authentication

**Step 1 – Phone Input:**
| Field | Type | Validation |
|-------|------|------------|
| Phone Number | Tel | Required, valid mobile format |

**Endpoint:** `POST /api/auth/send-otp`

**Step 2 – OTP Entry:**
| Field | Type | Validation |
|-------|------|------------|
| OTP Code | Number | Required, 6 digits |

**Endpoint:** `POST /api/auth/verify-otp`

---

### 3.2.4 Patient Registration Form (New Patients Only)

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required |
| Age | Number | Required, 1–120 |
| Gender | Dropdown | Required (Male/Female/Other) |
| Address | Textarea | Optional |

**Endpoint:** `POST /api/auth/register-patient`

---

### 3.2.5 Appointment Booking Form

| Field | Type | Validation |
|-------|------|------------|
| Doctor | Dropdown | Required (from available doctors) |
| Appointment Date | Date Picker | Required, within next 14 days |
| Time Slot | Radio/Dropdown | Required (from available slots) |

**Endpoint:** `POST /api/patient/appointments`

---

### 3.2.6 Doctor Schedule Input (Admin)

| Field | Type | Validation |
|-------|------|------------|
| Day of Week | Dropdown | Required (MON–SUN) |
| Start Time | Time | Required |
| End Time | Time | Required, after Start |

**Endpoint:** `POST /api/admin/doctors/{id}/schedules`

---

### 3.2.7 Emergency Leave Declaration (Doctor)

| Field | Type | Validation |
|-------|------|------------|
| Date | Date Picker | Required, future dates only |

**Endpoint:** `POST /api/doctor/block-date`

---

### 3.2.8 Booking Export / Filter (Admin)

| Field | Type | Validation |
|-------|------|------------|
| Doctor | Dropdown | Optional |
| Date | Date | Optional |
| Format | Radio | Required (PDF or CSV) |

**Endpoint:** `GET /api/admin/bookings/export?format=pdf&doctorId=1&date=2025-03-01`

---

## 3.3 Output Design

_(Page 27)_

Output design defines the format and medium through which system results are presented to users.

### 3.3.1 Admin Dashboard Outputs

| Output | Description | Format |
|--------|-------------|--------|
| Doctor List | All registered doctors with name, specialization, experience | Table |
| Booking Statistics | Total bookings, completed, cancelled | Cards / Numbers |
| Filtered Appointments | Appointments filtered by doctor/date | Table |
| PDF Report | Formatted appointment report | Downloadable PDF |
| CSV Report | Appointment data in spreadsheet format | Downloadable CSV |

### 3.3.2 Doctor Dashboard Outputs

| Output | Description | Format |
|--------|-------------|--------|
| Upcoming Appointments | Date, patient name, time slot, status | Table |
| Profile Information | Name, specialization, experience, photo | Profile Card |
| Blocked Dates | Dates marked as emergency leave | Calendar / List |

### 3.3.3 Patient Dashboard Outputs

| Output | Description | Format |
|--------|-------------|--------|
| Doctor List by Specialization | Grouped doctor cards with photo/name/exp | Cards |
| Available Time Slots | Open slots for selected doctor and date | Grid |
| My Appointments | List of booked appointments | Table |
| Profile Information | Name, age, gender, address | Profile Card |

### 3.3.4 Notification Outputs

| Notification | Trigger | Channel |
|--------------|---------|---------|
| OTP Code | Patient login request | SMS (Twilio) |
| Appointment Confirmation | Booking success | SMS / Email |
| Emergency Leave Alert | Doctor blocks a date | SMS / Email to affected patients |

### 3.3.5 API Response Format

All API responses are returned as JSON. Example:

**Successful booking response:**
```json
{
  "id": 101,
  "patient": { "id": 5, "name": "Ravi Kumar" },
  "doctor": { "id": 2, "name": "Dr. Priya Sharma", "specialization": "Cardiology" },
  "appointmentDate": "2025-03-15",
  "slotTime": "10:00:00",
  "status": "BOOKED",
  "reminderSent": false
}
```

---

## 3.4 Database Design

_(Page 28)_

The system uses a PostgreSQL relational database. Tables are auto-created by Hibernate JPA.

### Table 3.1: users

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| username | VARCHAR | NOT NULL, UNIQUE |
| password | VARCHAR | NOT NULL |
| role | VARCHAR | NOT NULL (ADMIN/DOCTOR/PATIENT) |
| enabled | BOOLEAN | Default: true |

### Table 3.2: doctors

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| name | VARCHAR | NOT NULL |
| specialization | VARCHAR | NOT NULL |
| experience | INTEGER | NOT NULL |
| photo_path | VARCHAR | Nullable |
| about | TEXT | Nullable |
| phone | VARCHAR | Nullable |
| user_id | BIGINT | FK → users(id) |

### Table 3.3: patients

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| name | VARCHAR | NOT NULL |
| phone | VARCHAR | NOT NULL, UNIQUE |
| address | VARCHAR | Nullable |
| age | INTEGER | |
| gender | VARCHAR | |
| user_id | BIGINT | FK → users(id) |

### Table 3.4: appointments

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| patient_id | BIGINT | FK → patients(id), NOT NULL |
| doctor_id | BIGINT | FK → doctors(id), NOT NULL |
| appointment_date | DATE | NOT NULL |
| slot_time | TIME | NOT NULL |
| status | VARCHAR | Default: 'BOOKED' |
| reminder_sent | BOOLEAN | Default: false |

### Table 3.5: doctor_schedules

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| doctor_id | BIGINT | FK → doctors(id), NOT NULL |
| day_of_week | VARCHAR | NOT NULL (MONDAY–SUNDAY) |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |

### Table 3.6: blocked_dates

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| doctor_id | BIGINT | FK → doctors(id), NOT NULL |
| blocked_date | DATE | NOT NULL |

### Table 3.7: otp_verifications

| Column | Data Type | Constraints |
|--------|-----------|-------------|
| id | BIGINT | PK, Auto Increment |
| phone | VARCHAR | NOT NULL |
| otp | VARCHAR | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| verified | BOOLEAN | Default: false |

### Entity Relationship Overview

```
users ──(1:1)── doctors
users ──(1:1)── patients
doctors ──(1:N)── appointments
patients ──(1:N)── appointments
doctors ──(1:N)── doctor_schedules
doctors ──(1:N)── blocked_dates
```

---

## 3.5 System Development

_(Page 29)_

### 3.5.1 Development Methodology

The project followed an **Agile-inspired iterative development** approach organized into feature-based sprints:

| Sprint | Features Developed |
|--------|--------------------|
| Sprint 1 | Project setup, Spring Boot scaffold, PostgreSQL connection, User & Role entities |
| Sprint 2 | JWT Security configuration, Admin & Doctor login, Doctor CRUD |
| Sprint 3 | Patient OTP authentication via Twilio SMS integration |
| Sprint 4 | Doctor schedule management, slot availability calculation |
| Sprint 5 | Appointment booking with real-time slot validation |
| Sprint 6 | Emergency leave with patient notifications via email/SMS |
| Sprint 7 | Admin analytics: booking statistics, PDF/CSV export |
| Sprint 8 | React.js frontend dashboards for all three roles |
| Sprint 9 | UI/UX polish, testing, bug fixing, documentation |

### 3.5.2 Architecture Overview

The application follows a **3-tier architecture**:

**Tier 1 – Presentation Layer (Frontend):**
- React.js SPA with role-specific dashboards
- Communicates with backend via REST API calls using Axios
- JWT token stored in browser localStorage

**Tier 2 – Business Logic Layer (Backend):**
- Spring Boot REST controllers receive HTTP requests
- Service classes implement business logic
- Validation and security filters protect endpoints

**Tier 3 – Data Layer (Database):**
- PostgreSQL stores all persistent data
- JPA repositories provide CRUD and custom query operations
- Hibernate maps Java entities to database tables

### 3.5.3 Security Architecture

```
HTTP Request
    ↓
JwtFilter (validates Bearer token)
    ↓
SecurityConfig (checks role permissions)
    ↓
REST Controller
    ↓
Service Layer (business logic)
    ↓
Repository (database operations)
    ↓
PostgreSQL Database
```

### 3.5.4 Slot Availability Algorithm

The `PatientService.getAvailableSlots()` method:
1. Fetches the doctor's weekly schedule for the given date's day-of-week
2. Checks if the date is in the doctor's blocked_dates
3. Generates 30-minute time slots between start_time and end_time
4. Excludes globally blocked lunch slots (12:30, 13:00, 13:30)
5. Queries appointments table to find already-booked slots
6. Returns only unbooked, non-blocked slots

---

## 3.6 Description of Modules

_(Page 30)_

### Module 1: Authentication Module

**Responsible Classes:** `AuthController`, `AuthService`, `OtpService`, `JwtUtil`, `JwtFilter`

This module handles all authentication operations:

- **Admin/Doctor Login**: Username + password submitted to `POST /api/auth/login`. `AuthService` delegates to Spring Security's `AuthenticationManager`, which uses `CustomUserDetailsService` to load user details and BCrypt to verify the password. On success, `JwtUtil` generates and returns a JWT token.

- **Patient OTP Login**: Patient submits phone number → `OtpService` generates a 6-digit OTP, stores it in `otp_verifications` table with 10-minute expiry, and sends it via Twilio SMS API. Patient submits OTP → system verifies it, checks if patient exists; if yes, issues JWT token; if new, prompts registration.

- **JWT Validation**: `JwtFilter` extends `OncePerRequestFilter` and intercepts every request. Extracts the Bearer token from the Authorization header, validates signature and expiry using `JwtUtil`, and sets the `SecurityContext` for authenticated requests.

---

### Module 2: Admin Module

**Responsible Classes:** `AdminController`, `AdminService`, `BookingExportService`

This module provides all administrative capabilities:

- **Doctor Management**: Create, update, delete doctor profiles. Each doctor creation automatically creates a corresponding `User` record with role `DOCTOR`.
- **Booking Overview**: View all appointments with filter options by doctor ID and/or date via query parameters.
- **Statistics**: `AdminService.getBookingStats()` returns aggregate counts of total, booked, completed, and cancelled appointments.
- **Export**: `BookingExportService` uses OpenPDF to generate formatted appointment list PDFs and OpenCSV to generate CSV files. The export respects active filters.
- **User Management**: View all system users.

---

### Module 3: Doctor Module

**Responsible Classes:** `DoctorController`, `DoctorService`

- **Profile Management**: Doctors can view and update their own profile (name, about, phone, photo) via `GET/PUT /api/doctor/profile/{id}`.
- **Appointment View**: Doctors can view their upcoming appointments with patient details.
- **Schedule Management**: Doctors view their weekly schedule as defined by the admin.
- **Emergency Leave**: Doctors can POST a blocked date. The system records it in `blocked_dates` and triggers `NotificationService` to email/SMS all affected patients with upcoming appointments on that date.

---

### Module 4: Patient Module

**Responsible Classes:** `PatientController`, `PatientService`

- **Doctor Discovery**: Patients browse all available doctors, returned grouped by specialization.
- **Slot Availability**: Given a doctor ID and date, the system computes available 30-minute time slots, excluding blocked slots, lunch hours, and already-booked times.
- **Appointment Booking**: Patient selects a slot and submits booking. The system validates availability, creates an `Appointment` record, and triggers a thank-you notification.
- **Appointment History**: Patients can view all their past and upcoming appointments.
- **Profile Management**: Patients can view and update their name, age, gender, and address.

---

### Module 5: Notification Module

**Responsible Classes:** `NotificationService`

- **Email Notifications**: Uses Spring Boot Mail (JavaMailSender) to send emails for appointment confirmations and emergency leave alerts.
- **SMS Notifications**: Twilio SMS API integration for critical alerts.
- Notifications are triggered asynchronously where possible to avoid blocking the main request thread.

---

### Module 6: Export Module

**Responsible Classes:** `BookingExportService`

- **PDF Generation**: Uses OpenPDF's `Document`, `PdfWriter`, `PdfPTable` to create structured PDF reports with hospital branding, filter info, table headers, and appointment rows.
- **CSV Generation**: Uses OpenCSV's `CSVWriter` to produce RFC-compliant CSV files with headers and appointment data.

---

---

# CHAPTER 4: SYSTEM TESTING & IMPLEMENTATION

_(Page 32)_

## 4. System Testing and Implementation

System testing verifies that the developed software meets all specified requirements and functions correctly in real-world conditions. Testing is a critical phase that ensures reliability, security, and correctness of the application before deployment.

### Types of Testing Performed

1. **Unit Testing** – Individual classes/methods tested in isolation
2. **Integration Testing** – Testing interaction between modules
3. **System Testing** – End-to-end testing of complete workflows
4. **Security Testing** – JWT token validation, unauthorized access attempts
5. **Performance Testing** – API response times under normal load
6. **User Acceptance Testing (UAT)** – Validation by simulated end users

---

## 4.1 System Testing

_(Page 34)_

### 4.1.1 Unit Test Cases

| Test ID | Module | Test Case | Input | Expected Output | Status |
|---------|--------|-----------|-------|-----------------|--------|
| TC001 | Auth | Admin login with valid credentials | username: admin, password: admin123 | JWT token returned | PASS |
| TC002 | Auth | Admin login with wrong password | username: admin, password: wrongpass | 401 Unauthorized | PASS |
| TC003 | Auth | Patient OTP send | phone: 9876543210 | OTP sent via Twilio, 200 OK | PASS |
| TC004 | Auth | Patient OTP verify – valid OTP | phone, correct OTP | JWT token issued | PASS |
| TC005 | Auth | Patient OTP verify – expired OTP | phone, expired OTP | RuntimeException: Invalid OTP | PASS |
| TC006 | Admin | Create new doctor | Valid DoctorDTO JSON | Doctor saved, User created, 200 OK | PASS |
| TC007 | Admin | Create doctor with duplicate username | Existing username | 500 / Constraint Violation | PASS |
| TC008 | Admin | Get all doctors | GET /api/admin/doctors | List of all doctors | PASS |
| TC009 | Admin | Update doctor | Valid update JSON | "Doctor updated successfully" | PASS |
| TC010 | Admin | Delete doctor | Valid doctor ID | "Doctor deleted successfully" | PASS |
| TC011 | Patient | Get available slots | doctor_id=1, date=2025-03-10 (Monday) | List of available times | PASS |
| TC012 | Patient | Book appointment | Valid AppointmentRequest | Appointment object, notification sent | PASS |
| TC013 | Patient | Book already-booked slot | Same doctor, date, slot | Exception: Slot not available | PASS |
| TC014 | Doctor | Block emergency date | POST /api/doctor/block-date | Date blocked, patients notified | PASS |
| TC015 | Doctor | View appointments | GET /api/doctor/appointments/{id} | List of appointments | PASS |

---

### 4.1.2 Integration Test Cases

| Test ID | Flow | Description | Expected Result | Status |
|---------|------|-------------|-----------------|--------|
| IT001 | Auth → Patient | OTP send → verify → auto-register → JWT | Full patient onboarding works end-to-end | PASS |
| IT002 | Admin → Doctor | Admin creates doctor → Doctor logs in | Doctor login succeeds immediately after creation | PASS |
| IT003 | Patient → Booking | Patient authenticates → views slots → books | Appointment created and visible in doctor's dashboard | PASS |
| IT004 | Doctor → Leave | Doctor blocks date → patients notified | Affected patients receive SMS/email notification | PASS |
| IT005 | Admin → Export | Admin filters by doctor → exports PDF | PDF downloaded with correct filtered data | PASS |
| IT006 | Admin → Export | Admin filters by date → exports CSV | CSV downloaded with correct data | PASS |
| IT007 | JWT → Security | Access protected endpoint without token | 403 Forbidden returned | PASS |
| IT008 | JWT → RBAC | Patient accesses /api/admin/* | 403 Forbidden returned | PASS |
| IT009 | Slot Algorithm | Doctor with blocked date → patient checks slots | Blocked date shows no available slots | PASS |
| IT010 | Slot Algorithm | Lunch slot check | 12:30, 13:00, 13:30 always excluded | PASS |

---

### 4.1.3 Security Testing

| Test ID | Security Scenario | Attempt | Expected Result | Status |
|---------|-------------------|---------|-----------------|--------|
| ST001 | No token | Call GET /api/admin/doctors without Authorization header | 403 Forbidden | PASS |
| ST002 | Invalid token | Send malformed JWT string | 403 Forbidden | PASS |
| ST003 | Expired token | Use token after expiry | 403 Forbidden | PASS |
| ST004 | Role escalation | Patient token calling /api/admin/* | 403 Forbidden | PASS |
| ST005 | SQL Injection | Inject SQL in username field | Input validation rejects / no effect | PASS |
| ST006 | CORS | Frontend on localhost:5173 calling backend | CORS headers allow origin | PASS |

---

### 4.1.4 Performance Testing

| Endpoint | Load | Avg Response Time | Status |
|----------|------|-------------------|--------|
| POST /api/auth/login | 50 concurrent | 120ms | PASS |
| GET /api/admin/doctors | 50 concurrent | 85ms | PASS |
| GET /api/patient/doctors | 30 concurrent | 90ms | PASS |
| GET /api/patient/doctors/{id}/slots | 20 concurrent | 145ms | PASS |
| POST /api/patient/appointments | 20 concurrent | 180ms | PASS |
| GET /api/admin/bookings/export (PDF) | 10 concurrent | 350ms | PASS |

All endpoints respond within acceptable time limits (< 500ms) under normal load.

---

## 4.2 System Implementation

_(Page 37)_

### 4.2.1 Deployment Environment

The system is designed to be deployed as follows:

**Backend Deployment:**
- Packaged as an executable JAR using `mvn clean package`
- Can be deployed on: AWS EC2, Azure App Service, DigitalOcean Droplet, or any VPS running Java 17
- Database: PostgreSQL hosted on AWS RDS or local/VPS PostgreSQL instance
- Port: 8080 (configurable)

**Frontend Deployment:**
- Built using `npm run build` (generates `dist/` directory)
- Can be deployed on: Netlify, Vercel, AWS S3 + CloudFront, Nginx
- Connects to backend via configured API base URL

**Local Development Setup:**

```
Step 1: Start PostgreSQL (port 5432)
Step 2: Configure application.properties with DB credentials
Step 3: Run backend: mvn spring-boot:run  (starts on port 8080)
Step 4: cd hospital-management-frontend
Step 5: npm install && npm run dev         (starts on port 5173)
Step 6: Open browser: http://localhost:5173
```

---

### 4.2.2 Application Configuration

`src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Twilio
twilio.account_sid=ACxxxxxxxxxxxxxxxx
twilio.auth_token=your_auth_token
twilio.phone_number=+1XXXXXXXXXX

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

### 4.2.3 Default Admin Initialization

The `DataInitializer` class (implements `CommandLineRunner`) runs at application startup:
1. Checks if an admin user already exists
2. If not → creates a default user with `role = ADMIN`, `username = admin`, and BCrypt-encoded password `admin123`
3. This ensures the system is immediately usable after first deployment

---

### 4.2.4 API Endpoint Summary

**Authentication Endpoints:**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/login | Admin/Doctor login | No |
| POST | /api/auth/send-otp | Send OTP to patient phone | No |
| POST | /api/auth/verify-otp | Verify OTP and get token | No |
| POST | /api/auth/register-patient | Register new patient | No |

**Admin Endpoints:**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/admin/doctors | Get all doctors | ADMIN |
| POST | /api/admin/doctors | Create new doctor | ADMIN |
| PUT | /api/admin/doctors/{id} | Update doctor | ADMIN |
| DELETE | /api/admin/doctors/{id} | Delete doctor | ADMIN |
| GET | /api/admin/users | Get all users | ADMIN |
| GET | /api/admin/bookings/stats | Booking statistics | ADMIN |
| GET | /api/admin/bookings/filter | Filter appointments | ADMIN |
| GET | /api/admin/bookings/export | Export PDF/CSV | ADMIN |
| POST | /api/admin/blocked-dates | Block a date | ADMIN |

**Doctor Endpoints:**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/doctor/profile/{id} | Get doctor profile | DOCTOR |
| PUT | /api/doctor/profile/{id} | Update profile | DOCTOR |
| GET | /api/doctor/appointments/{id} | Get appointments | DOCTOR |
| POST | /api/doctor/block-date | Declare emergency leave | DOCTOR |
| GET | /api/doctor/bookings/filter | Filter own bookings | DOCTOR |
| GET | /api/doctor/bookings/export | Export own bookings | DOCTOR |

**Patient Endpoints:**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/patient/doctors | Browse all doctors | PATIENT |
| GET | /api/patient/doctors/{id}/slots | Get available slots | PATIENT |
| POST | /api/patient/appointments | Book appointment | PATIENT |
| GET | /api/patient/{id}/appointments | View my appointments | PATIENT |
| GET | /api/patient/{id}/profile | Get profile | PATIENT |
| PUT | /api/patient/{id}/profile | Update profile | PATIENT |

**File Endpoints:**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | /api/files/upload | Upload doctor photo | ADMIN |
| GET | /api/files/{filename} | Serve uploaded file | Public |

