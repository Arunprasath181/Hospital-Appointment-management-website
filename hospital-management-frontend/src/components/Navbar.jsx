import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHospitalAlt, FaUserShield, FaUserMd, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'ADMIN': return '/admin';
            case 'DOCTOR': return '/doctor';
            case 'PATIENT': return '/patient';
            default: return '/login';
        }
    };

    const getRoleIcon = () => {
        if (!user) return null;
        switch (user.role) {
            case 'ADMIN': return <FaUserShield />;
            case 'DOCTOR': return <FaUserMd />;
            case 'PATIENT': return <FaUser />;
            default: return <FaUser />;
        }
    };

    return (
        <nav className="medical-header">
            <Link to={getDashboardLink()} className="logo">
                <span className="logo-icon"><FaHospitalAlt /></span>
                QMED
            </Link>
            <div className="nav-links">
                {user && (
                    <>
                        <span className="nav-user">
                            <span className="nav-user-icon">{getRoleIcon()}</span>
                            {user.username}
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            <FaSignOutAlt style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
