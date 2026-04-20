package com.hospital.controller;

import com.hospital.dto.DTOs.*;
import com.hospital.entity.*;
import com.hospital.repository.*;
import com.hospital.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BookingExportService exportService;

    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@RequestBody DoctorDTO dto) {
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .experience(dto.getExperience())
                .photoPath(dto.getPhotoPath())
                .build();
        return ResponseEntity.ok(adminService.createDoctor(doctor, dto.getUsername(), dto.getPassword()));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PostMapping("/blocked-dates")
    public ResponseEntity<?> blockDate(@RequestBody BlockDateRequest request) {
        adminService.blockDate(request.getDoctorId(), request.getDate());
        return ResponseEntity.ok("Date blocked successfully");
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/bookings/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getBookingStats());
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor update) {
        adminService.updateDoctor(id, update);
        return ResponseEntity.ok("Doctor updated successfully");
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    @GetMapping("/bookings/filter")
    public ResponseEntity<List<Appointment>> filterBookings(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String date) {

        if (doctorId != null && date != null) {
            return ResponseEntity.ok(
                    appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, java.time.LocalDate.parse(date)));
        } else if (doctorId != null) {
            return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctorId));
        } else if (date != null) {
            return ResponseEntity.ok(appointmentRepository.findByAppointmentDate(java.time.LocalDate.parse(date)));
        }
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/bookings/export")
    public ResponseEntity<byte[]> exportBookings(
            @RequestParam String format,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String date) throws java.io.IOException {

        List<Appointment> list;
        if (doctorId != null && date != null) {
            list = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, java.time.LocalDate.parse(date));
        } else if (doctorId != null) {
            list = appointmentRepository.findByDoctorId(doctorId);
        } else if (date != null) {
            list = appointmentRepository.findByAppointmentDate(java.time.LocalDate.parse(date));
        } else {
            list = appointmentRepository.findAll();
        }

        byte[] content;
        String contentType;
        String fileName = "bookings_" + java.time.LocalDate.now();

        if (format.equalsIgnoreCase("pdf")) {
            content = exportService.generatePdf(list);
            contentType = "application/pdf";
            fileName += ".pdf";
        } else {
            content = exportService.generateCsv(list);
            contentType = "text/csv";
            fileName += ".csv";
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .header("Content-Type", contentType)
                .body(content);
    }
}
