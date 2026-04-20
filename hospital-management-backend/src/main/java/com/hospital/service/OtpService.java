package com.hospital.service;

import com.hospital.entity.OtpVerification;
import com.hospital.repository.OtpVerificationRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Value("${hospital.twilio.account-sid}")
    private String twilioAccountSid;

    @Value("${hospital.twilio.auth-token}")
    private String twilioAuthToken;

    @Value("${hospital.twilio.from-number}")
    private String twilioFromNumber;

    public void sendOtp(String phone) {
        String otp = String.format("%06d", new Random().nextInt(1000000));

        OtpVerification otpVerification = OtpVerification.builder()
                .phone(phone)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        otpRepository.save(otpVerification);

        // Fallback for dev: always print to log
        System.out.println("OTP for " + phone + ": " + otp);

        try {
            if (!twilioAccountSid.startsWith("ACXXXX")) {
                Twilio.init(twilioAccountSid, twilioAuthToken);
                Message.creator(
                        new PhoneNumber(phone),
                        new PhoneNumber(twilioFromNumber),
                        "Your Hospital Booking OTP is: " + otp).create();
            }
        } catch (Exception e) {
            System.err.println("Twilio fail: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String phone, String otp) {
        return otpRepository.findTopByPhoneOrderByExpiresAtDesc(phone)
                .map(v -> {
                    if (!v.isUsed() && v.getOtp().equals(otp) && v.getExpiresAt().isAfter(LocalDateTime.now())) {
                        v.setUsed(true);
                        otpRepository.save(v);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}
