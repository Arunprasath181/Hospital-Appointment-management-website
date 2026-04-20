package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.entity.Patient;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.repository.UserRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.AuthService;
import com.hospital.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String jwt = authService.login(request.getUsername(), request.getPassword());
        User user = userRepository.findByUsername(request.getUsername()).get();

        Long entityId = user.getId(); // Default to User ID (e.g. for Admin)
        if (user.getRole() == Role.DOCTOR) {
            entityId = doctorRepository.findByUserId(user.getId())
                    .map(com.hospital.entity.Doctor::getId)
                    .orElse(user.getId());
        } else if (user.getRole() == Role.PATIENT) {
            entityId = patientRepository.findByUserId(user.getId())
                    .map(com.hospital.entity.Patient::getId)
                    .orElse(user.getId());
        }

        return ResponseEntity
                .ok(new LoginResponse(jwt, user.getRole().name(), user.getUsername(), entityId, user.getId()));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        otpService.sendOtp(request.getPhone());
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {
        String response = authService.verifyPatientOtp(request.getPhone(), request.getOtp());
        if ("NEW_USER".equals(response)) {
            return ResponseEntity.ok(response);
        }

        // Success: build full LoginResponse
        User user = userRepository.findByUsername(request.getPhone()).get();
        Patient patient = patientRepository.findByUserId(user.getId()).get();

        return ResponseEntity.ok(
                new LoginResponse(response, Role.PATIENT.name(), user.getUsername(), patient.getId(), user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody PatientRegisterRequest request) {
        Patient patient = Patient.builder()
                .name(request.getName())
                .address(request.getAddress())
                .age(request.getAge())
                .gender(request.getGender())
                .build();
        String jwt = authService.registerPatient(patient, request.getPhone());
        User user = userRepository.findByUsername(request.getPhone()).get();
        return ResponseEntity
                .ok(new LoginResponse(jwt, Role.PATIENT.name(), request.getPhone(), patient.getId(), user.getId()));
    }
}
