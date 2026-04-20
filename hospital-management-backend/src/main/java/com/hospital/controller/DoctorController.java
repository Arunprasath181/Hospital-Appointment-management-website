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
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BookingExportService exportService;

    @PostMapping("/{id}/emergency-leave")
    public ResponseEntity<?> markEmergencyLeave(@PathVariable Long id, @RequestParam String date) {
        doctorService.markEmergencyLeave(id, java.time.LocalDate.parse(date));
        return ResponseEntity.ok("Emergency leave marked and patients notified");
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAppointments(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<DoctorDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getProfile(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody DoctorProfileUpdate update) {
        doctorService.updateProfile(id, update);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<ScheduleDTO>> getSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getSchedule(id));
    }

    @PutMapping("/{id}/schedule")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody List<ScheduleDTO> schedules) {
        doctorService.updateSchedule(id, schedules);
        return ResponseEntity.ok("Schedule updated successfully");
    }

    @PutMapping("/{id}/photo")
    public ResponseEntity<?> updatePhoto(@PathVariable Long id, @RequestBody String photoPath) {
        doctorService.updatePhoto(id, photoPath);
        return ResponseEntity.ok("Photo updated successfully");
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestParam Long userId, @RequestBody PasswordChangeRequest request) {
        doctorService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/{id}/appointments/filter")
    public ResponseEntity<List<Appointment>> filterAppointments(
            @PathVariable Long id,
            @RequestParam(required = false) String date) {

        if (date != null) {
            return ResponseEntity
                    .ok(appointmentRepository.findByDoctorIdAndAppointmentDate(id, java.time.LocalDate.parse(date)));
        }
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(id));
    }

    @GetMapping("/{id}/appointments/export")
    public ResponseEntity<byte[]> exportAppointments(
            @PathVariable Long id,
            @RequestParam String format,
            @RequestParam(required = false) String date) throws java.io.IOException {

        List<Appointment> list;
        if (date != null) {
            list = appointmentRepository.findByDoctorIdAndAppointmentDate(id, java.time.LocalDate.parse(date));
        } else {
            list = appointmentRepository.findByDoctorId(id);
        }

        byte[] content;
        String contentType;
        String fileName = "doctor_bookings_" + java.time.LocalDate.now();

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
