import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { FaUserInjured, FaArrowRight } from 'react-icons/fa';
import './Auth.css';

const PatientLogin = () => {
    const [step, setStep] = useState('phone'); // phone, otp, register
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'PATIENT') {
            navigate('/patient');
        }
    }, [user, navigate]);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Allow only digits and limit to 10 characters
        if (/^\d*$/.test(value) && value.length <= 10) {
            setPhone(value);
        }
    };

    const handleSendOtp = async () => {
        setError('');
        if (phone.length !== 10) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        setLoading(true);
        try {
            await authApi.sendOtp(phone);
            setSuccess('OTP sent to ' + phone);
            setStep('otp');
        } catch (err) {
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await authApi.verifyOtp(phone, otp);
            if (res.data === 'NEW_USER') {
                setStep('register');
                setSuccess('OTP verified! Please complete registration.');
            } else {
                login(res.data);
                navigate('/patient');
            }
        } catch (err) {
            setError('Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authApi.register({ name, phone, address, age: parseInt(age), gender });
            login(res.data);
            navigate('/patient');
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon-wrapper">
                        <FaUserInjured className="auth-icon" />
                    </span>
                    <h1>QMED</h1>
                    <p>Patient Login</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                {step === 'phone' && (
                    <div className="auth-form">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Enter 10 digit mobile number"
                                required
                            />
                        </div>
                        <button onClick={handleSendOtp} className="btn-primary btn-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="auth-form">
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <div className="otp-section">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                />
                                <button onClick={handleSendOtp} className="btn-secondary" disabled={loading}>Resend</button>
                            </div>
                        </div>
                        <button onClick={handleVerifyOtp} className="btn-primary btn-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}

                {step === 'register' && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" required />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Age</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary btn-full" disabled={loading}>
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <a href="/admin-login">Admin & Doctor Portal <FaArrowRight style={{ fontSize: 10, marginLeft: 4 }} /></a>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
