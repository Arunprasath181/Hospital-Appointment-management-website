package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Run every 15 minutes
    @Scheduled(fixedRate = 900000)
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourFromNow = now.plusHours(1);

        List<Appointment> upcoming = appointmentRepository.findByReminderSentFalseAndStatus("BOOKED");

        for (Appointment appt : upcoming) {
            LocalDateTime apptDateTime = LocalDateTime.of(appt.getAppointmentDate(), appt.getSlotTime());
            if (apptDateTime.isAfter(now) && apptDateTime.isBefore(oneHourFromNow)) {
                sendSmsReminder(appt);
                appt.setReminderSent(true);
                appointmentRepository.save(appt);
            }
        }
    }

    private void sendSmsReminder(Appointment appointment) {
        System.out.println("REMINDER SMS: Dear " + appointment.getPatient().getName() +
                ", your appointment with Dr. " + appointment.getDoctor().getName() +
                " is at " + appointment.getSlotTime() + " today.");
    }

    public void sendThankYou(Appointment appointment) {
        System.out.println("THANK YOU SMS: Dear " + appointment.getPatient().getName() +
                ", thank you for booking with us. Your appointment with Dr. " +
                appointment.getDoctor().getName() + " is confirmed for " +
                appointment.getAppointmentDate() + " at " + appointment.getSlotTime());
    }

    public void sendEmergencyLeaveNotification(Appointment appointment) {
        System.out.println("EMERGENCY SMS: Dear " + appointment.getPatient().getName() +
                ", we regret to inform you that Dr. " + appointment.getDoctor().getName() +
                " is unavailable on " + appointment.getAppointmentDate() +
                " due to an emergency. Your appointment at " + appointment.getSlotTime() +
                " has been cancelled.");
    }
}
