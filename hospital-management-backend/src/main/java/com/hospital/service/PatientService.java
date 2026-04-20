package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BlockedDateRepository blockedDateRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        // 1. Check if date is blocked
        if (!blockedDateRepository.findByDoctorIdAndBlockedDate(doctorId, date).isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Get doctor's schedule for that day of week
        String dayOfWeek = date.getDayOfWeek().name();
        List<DoctorSchedule> schedules = scheduleRepository.findByDoctorId(doctorId).stream()
                .filter(s -> s.getDayOfWeek().equalsIgnoreCase(dayOfWeek))
                .collect(Collectors.toList());

        if (schedules.isEmpty()) {
            return new ArrayList<>();
        }

        DoctorSchedule schedule = schedules.get(0);
        List<LocalTime> allSlots = new ArrayList<>();
        LocalTime current = schedule.getStartTime();
        while (current.isBefore(schedule.getEndTime())) {
            allSlots.add(current);
            current = current.plusMinutes(30);
        }

        // 3. Filter out already booked slots
        List<LocalTime> bookedSlots = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date)
                .stream()
                .map(Appointment::getSlotTime)
                .collect(Collectors.toList());

        allSlots.removeAll(bookedSlots);

        // 4. Block default slots (12:30 PM, 1:00 PM, 1:30 PM)
        List<LocalTime> blockedLunchSlots = List.of(
                LocalTime.of(12, 30),
                LocalTime.of(13, 0),
                LocalTime.of(13, 30));
        allSlots.removeIf(blockedLunchSlots::contains);

        return allSlots;
    }

    public Appointment bookAppointment(Long patientId, Long doctorId, LocalDate date, LocalTime slot) {
        if (date.isAfter(LocalDate.now().plusDays(14))) {
            throw new RuntimeException("Can only book up to 14 days in advance");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Double check availability
        List<LocalTime> available = getAvailableSlots(doctorId, date);
        LocalTime targetSlot = slot.withSecond(0).withNano(0);

        boolean match = available.stream()
                .anyMatch(a -> a.getHour() == targetSlot.getHour() && a.getMinute() == targetSlot.getMinute());

        if (!match) {
            throw new RuntimeException(
                    "Selected slot " + targetSlot + " is no longer available. Available slots: " + available);
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(date)
                .slotTime(slot)
                .status("BOOKED")
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public Patient getProfile(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void updateProfile(Long id, Patient update) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setName(update.getName());
        patient.setAddress(update.getAddress());
        patient.setAge(update.getAge());
        patient.setGender(update.getGender());
        patientRepository.save(patient);
    }
}
