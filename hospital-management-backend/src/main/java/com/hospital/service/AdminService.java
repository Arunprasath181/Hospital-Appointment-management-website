package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockedDateRepository blockedDateRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Transactional
    public Doctor createDoctor(Doctor doctor, String username, String password) {
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(Role.DOCTOR)
                .build();
        userRepository.save(user);

        doctor.setUser(user);
        Doctor savedDoctor = doctorRepository.save(doctor);

        // Add default schedule (Mon-Fri, 9 AM - 5 PM)
        String[] defaultDays = { "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" };
        for (String day : defaultDays) {
            DoctorSchedule schedule = DoctorSchedule.builder()
                    .doctor(savedDoctor)
                    .dayOfWeek(day)
                    .startTime(java.time.LocalTime.of(9, 0))
                    .endTime(java.time.LocalTime.of(17, 0))
                    .build();
            scheduleRepository.save(schedule);
        }

        return savedDoctor;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public void blockDate(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        BlockedDate blockedDate = BlockedDate.builder()
                .doctor(doctor)
                .blockedDate(date)
                .build();

        blockedDateRepository.save(blockedDate);
    }

    public Map<String, Long> getBookingStats() {
        Map<String, Long> stats = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findAll();
        for (Doctor d : doctors) {
            long count = appointmentRepository.findByDoctorId(d.getId()).size();
            stats.put(d.getName(), count);
        }
        return stats;
    }

    public void updateDoctor(Long id, Doctor update) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setName(update.getName());
        doctor.setSpecialization(update.getSpecialization());
        doctor.setExperience(update.getExperience());
        doctor.setAbout(update.getAbout());
        doctor.setPhone(update.getPhone());
        if (update.getPhotoPath() != null) {
            doctor.setPhotoPath(update.getPhotoPath());
        }
        doctorRepository.save(doctor);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        // Delete related records first
        appointmentRepository.deleteAll(appointmentRepository.findByDoctorId(id));
        scheduleRepository.deleteAll(scheduleRepository.findByDoctorId(id));
        blockedDateRepository.deleteAll(blockedDateRepository.findByDoctorId(id));
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        if (user != null) {
            userRepository.delete(user);
        }
    }
}
