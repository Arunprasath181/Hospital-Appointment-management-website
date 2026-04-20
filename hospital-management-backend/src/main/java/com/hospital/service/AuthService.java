package com.hospital.service;

import com.hospital.entity.Patient;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    public String login(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtUtil.generateToken(userDetails);
    }

    public String verifyPatientOtp(String phone, String otp) {
        if (otpService.verifyOtp(phone, otp)) {
            Optional<Patient> patientOpt = patientRepository.findByPhone(phone);
            if (patientOpt.isPresent()) {
                UserDetails userDetails = userDetailsService
                        .loadUserByUsername(patientOpt.get().getUser().getUsername());
                return jwtUtil.generateToken(userDetails);
            }
            return "NEW_USER";
        }
        throw new RuntimeException("Invalid OTP");
    }

    public String registerPatient(Patient patient, String phone) {
        // Create underlying user for patient
        User user = User.builder()
                .username(phone)
                .password("") // OTP based users don't need passwords
                .role(Role.PATIENT)
                .build();
        userRepository.save(user);

        patient.setUser(user);
        patient.setPhone(phone);
        patientRepository.save(patient);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        return jwtUtil.generateToken(userDetails);
    }
}
