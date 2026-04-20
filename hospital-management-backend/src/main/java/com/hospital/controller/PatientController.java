package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.entity.Appointment;
import com.hospital.entity.Patient;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.NotificationService;
import com.hospital.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/doctors")
    public ResponseEntity<?> browseDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(patientService.getAvailableSlots(id, date));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request, @RequestParam Long patientId) {
        Appointment appt = patientService.bookAppointment(patientId, request.getDoctorId(), request.getDate(),
                request.getSlot());
        notificationService.sendThankYou(appt);
        return ResponseEntity.ok(appt);
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientAppointments(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<Patient> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getProfile(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Patient update) {
        patientService.updateProfile(id, update);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
