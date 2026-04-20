package com.hospital.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

public class DTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class LoginResponse {
        private String jwt;
        private String role;
        private String username;
        private Long id; // doctor or patient ID
        private Long userId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpRequest {
        private String phone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpVerifyRequest {
        private String phone;
        private String otp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientRegisterRequest {
        private String name;
        private String phone;
        private String address;
        private int age;
        private String gender;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DoctorDTO {
        private Long id;
        private String name;
        private String specialization;
        private int experience;
        private String photoPath;
        private String about;
        private String phone;
        private String username;
        private String password; // only for creation
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorProfileUpdate {
        private String name;
        private String specialization;
        private int experience;
        private String about;
        private String phone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleDTO {
        private String dayOfWeek;
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime startTime;
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime endTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentRequest {
        private Long doctorId;
        private LocalDate date;
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime slot;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SlotResponse {
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime slot;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AppointmentResponse {
        private Long id;
        private String doctorName;
        private String specialization;
        private LocalDate date;
        @JsonFormat(pattern = "HH:mm:ss")
        private LocalTime slot;
        private String status;
        private String patientName;
        private String patientPhone;
    }

    @Data
    @AllArgsConstructor
    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;
    }

    @Data
    @AllArgsConstructor
    public static class BlockDateRequest {
        private Long doctorId;
        private LocalDate date;
    }
}
