import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { FaHospitalAlt, FaArrowRight } from 'react-icons/fa';
import './Auth.css';

const AdminDoctorLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'DOCTOR') navigate('/doctor');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authApi.login({ username, password });
            const data = res.data;
            login(data);
            if (data.role === 'ADMIN') navigate('/admin');
            else if (data.role === 'DOCTOR') navigate('/doctor');
            else navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon-wrapper">
                        <FaHospitalAlt className="auth-icon" />
                    </span>
                    <h1>QMED</h1>
                    <p>Admin & Doctor Portal</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    <a href="/login">Patient? Login with Phone <FaArrowRight style={{ fontSize: 10, marginLeft: 4 }} /></a>
                </div>
            </div>
        </div>
    );
};

export default AdminDoctorLogin;
