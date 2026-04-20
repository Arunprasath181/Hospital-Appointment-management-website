package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.hospital.dto.DTOs.*;

@Service
public class DoctorService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Appointment> getAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public void updatePhoto(Long doctorId, String photoPath) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setPhotoPath(photoPath);
        doctorRepository.save(doctor);
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public DoctorDTO getProfile(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .experience(doctor.getExperience())
                .photoPath(doctor.getPhotoPath())
                .about(doctor.getAbout())
                .phone(doctor.getPhone())
                .username(doctor.getUser().getUsername())
                .build();
    }

    public void updateProfile(Long doctorId, DoctorProfileUpdate update) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setName(update.getName());
        doctor.setSpecialization(update.getSpecialization());
        doctor.setExperience(update.getExperience());
        doctor.setAbout(update.getAbout());
        doctor.setPhone(update.getPhone());
        doctorRepository.save(doctor);
    }

    @Transactional
    public void updateSchedule(Long doctorId, List<ScheduleDTO> schedules) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Delete existing schedules
        List<com.hospital.entity.DoctorSchedule> existing = scheduleRepository.findByDoctorId(doctorId);
        scheduleRepository.deleteAll(existing);

        // Add new schedules
        List<com.hospital.entity.DoctorSchedule> newSchedules = schedules.stream()
                .map(dto -> com.hospital.entity.DoctorSchedule.builder()
                        .doctor(doctor)
                        .dayOfWeek(dto.getDayOfWeek())
                        .startTime(dto.getStartTime())
                        .endTime(dto.getEndTime())
                        .build())
                .collect(Collectors.toList());

        scheduleRepository.saveAll(newSchedules);
    }

    @Autowired
    private BlockedDateRepository blockedDateRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ScheduleDTO> getSchedule(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId).stream()
                .map(s -> new ScheduleDTO(s.getDayOfWeek(), s.getStartTime(), s.getEndTime()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void markEmergencyLeave(Long doctorId, java.time.LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 1. Block the date
        if (blockedDateRepository.findByDoctorIdAndBlockedDate(doctorId, date).isEmpty()) {
            com.hospital.entity.BlockedDate blocked = com.hospital.entity.BlockedDate.builder()
                    .doctor(doctor)
                    .blockedDate(date)
                    .build();
            blockedDateRepository.save(blocked);
        }

        // 2. Notify booked patients
        List<Appointment> affected = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
        for (Appointment appt : affected) {
            appt.setStatus("CANCELLED");
            notificationService.sendEmergencyLeaveNotification(appt);
            appointmentRepository.save(appt);
        }
    }
}
