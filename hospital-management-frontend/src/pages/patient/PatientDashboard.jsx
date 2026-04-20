import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi, fileApi } from '../../services/api';
import { FaUserMd, FaGraduationCap, FaPhone, FaClock, FaArrowLeft, FaCalendarAlt, FaEdit, FaCheckCircle } from 'react-icons/fa';
import '../admin/Dashboard.css';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [tab, setTab] = useState('browse');
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        address: '',
        age: 0,
        gender: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) return;
        patientApi.getDoctors().then(res => setDoctors(res.data)).catch(console.error);
        if (user.id && user.id !== 'undefined') {
            patientApi.getMyAppointments(user.id).then(res => setAppointments(res.data)).catch(console.error);
            loadProfile();
        } else {
            console.warn('User ID is missing or undefined', user);
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user?.id || user.id === 'undefined') return;
        try {
            const res = await patientApi.getProfile(user.id);
            setProfile(res.data || {});
        } catch (err) {
            console.error('Failed to load patient profile', err);
        }
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        setSelectedSlot('');
        if (selectedDoctor && date) {
            try {
                const res = await patientApi.getSlots(selectedDoctor.id, date);
                // Extract slot strings safely - handles both [ {slot: "HH:mm:ss"} ] and [ "HH:mm:ss" ]
                const slotData = res.data.map(s => typeof s === 'object' && s !== null ? (s.slot || s.time || s) : s);
                setSlots(slotData.filter(s => typeof s === 'string'));
            } catch (err) {
                setSlots([]);
                setMessage('No slots available for this date');
            }
        }
    };

    const handleBook = async () => {
        if (!selectedSlot || !selectedDate || !selectedDoctor) return;
        try {
            const slotStr = typeof selectedSlot === 'string' ? selectedSlot :
                Array.isArray(selectedSlot) ? `${String(selectedSlot[0]).padStart(2, '0')}:${String(selectedSlot[1]).padStart(2, '0')}:00` :
                    selectedSlot;

            await patientApi.bookAppointment(user.id, {
                doctorId: selectedDoctor.id,
                date: selectedDate,
                slot: slotStr.length === 5 ? slotStr + ':00' : slotStr
            });
            setMessage('Appointment booked successfully! 🎉');
            setSelectedDoctor(null);
            setSelectedDate('');
            setSlots([]);
            setSelectedSlot('');
            // Refresh appointments
            const res = await patientApi.getMyAppointments(user.id);
            setAppointments(res.data);
            setTab('bookings');
        } catch (err) {
            console.error('Booking failed:', err);
            setMessage(err.response?.data?.message || 'Booking failed. Try another slot.');
        }
    };

    const handleProfileUpdate = async () => {
        try {
            await patientApi.updateProfile(user.id, profile);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            loadProfile();
        } catch (err) {
            setMessage('Failed to update profile.');
        }
    };

    const getMinDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().split('T')[0];
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }) };
    };

    const formatTime12h = (time) => {
        if (!time) return '';
        let h, m;
        if (typeof time === 'string') {
            [h, m] = time.split(':').map(Number);
        } else if (Array.isArray(time)) {
            [h, m] = time;
        } else {
            return '';
        }
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Patient Dashboard</h2>
                <div className="tab-bar">
                    <button className={tab === 'browse' ? 'tab active' : 'tab'} onClick={() => setTab('browse')}>
                        <FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Browse Doctors
                    </button>
                    <button className={tab === 'bookings' ? 'tab active' : 'tab'} onClick={() => setTab('bookings')}>
                        <FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> My Bookings
                    </button>
                    <button className={tab === 'profile' ? 'tab active' : 'tab'} onClick={() => setTab('profile')}>My Profile</button>
                </div>
            </div>

            {message && <div className="dash-message">{message}</div>}

            {tab === 'browse' && !selectedDoctor && (
                <div className="dash-section">
                    <h3>Available Doctors</h3>
                    {Object.entries(
                        doctors.reduce((acc, doc) => {
                            const spec = doc.specialization || 'General';
                            if (!acc[spec]) acc[spec] = [];
                            acc[spec].push(doc);
                            return acc;
                        }, {})
                    ).map(([spec, docsInSpec]) => (
                        <div key={spec} className="specialization-group" style={{ marginBottom: 30 }}>
                            <h4 className="specialization-heading" style={{
                                fontSize: '1.2rem',
                                borderBottom: '2px solid var(--primary)',
                                paddingBottom: 8,
                                marginBottom: 16,
                                color: 'var(--primary)'
                            }}>{spec}</h4>
                            <div className="card-grid">
                                {docsInSpec.map(doc => (
                                    <div key={doc.id} className="card doctor-card" onClick={() => setSelectedDoctor(doc)} style={{ cursor: 'pointer' }}>
                                        <div className="doctor-photo">
                                            {doc.photoPath ? (
                                                <img
                                                    src={fileApi.getUrl(doc.photoPath)}
                                                    alt={doc.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="photo-placeholder">👨‍⚕️</div>'; }}
                                                />
                                            ) : (
                                                <div className="photo-placeholder"><FaUserMd /></div>
                                            )}
                                        </div>
                                        <h4>{doc.name}</h4>
                                        <p className="specialization">{doc.specialization}</p>
                                        <p className="experience">{doc.experience} yrs experience</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'browse' && selectedDoctor && (
                <div className="dash-section">
                    <button className="btn-secondary" onClick={() => { setSelectedDoctor(null); setSlots([]); setSelectedDate(''); }} style={{ marginBottom: 16 }}>
                        <FaArrowLeft style={{ marginRight: 6 }} /> Back to Doctors
                    </button>

                    <div className="card profile-full-card">
                        <div className="profile-header-main">
                            <div className="doctor-photo" style={{ width: 100, height: 100 }}>
                                {selectedDoctor.photoPath ? (
                                    <img
                                        src={fileApi.getUrl(selectedDoctor.photoPath)}
                                        alt={selectedDoctor.name}
                                        style={{ width: 100, height: 100 }}
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="photo-placeholder" style="width: 100px; height: 100px; font-size: 40px">👨‍⚕️</div>'; }}
                                    />
                                ) : (
                                    <div className="photo-placeholder" style={{ width: 100, height: 100, fontSize: 40 }}><FaUserMd /></div>
                                )}
                            </div>
                            <div className="profile-info-main">
                                <h2 style={{ fontSize: 24, marginBottom: 4, fontWeight: 800 }}>{selectedDoctor.name}</h2>
                                <p className="specialization" style={{ fontSize: 16, marginBottom: 12 }}>{selectedDoctor.specialization}</p>
                                <div className="profile-badges">
                                    <span className="info-badge"><FaGraduationCap style={{ marginRight: 4 }} /> {selectedDoctor.experience} Years Exp.</span>
                                    {selectedDoctor.phone && <span className="info-badge"><FaPhone style={{ marginRight: 4 }} /> {selectedDoctor.phone}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="profile-details-section" style={{ marginBottom: 24 }}>
                            <h4>About</h4>
                            <p className="about-text">{selectedDoctor.about || 'No description provided.'}</p>
                        </div>

                        <div className="booking-form-section" style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                            <h4><FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--primary)' }} /> Book an Appointment</h4>
                            <div className="form-group" style={{ maxWidth: 300, marginTop: 16 }}>
                                <label>Select Date (Next 14 days)</label>
                                <input type="date" className="booking-date-picker" value={selectedDate} min={getMinDate()} max={getMaxDate()} onChange={(e) => handleDateChange(e.target.value)} />
                            </div>

                            {slots.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Available Slots</label>
                                    <div className="slot-grid">
                                        {slots.map(slot => (
                                            <button
                                                key={slot}
                                                className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {formatTime12h(slot)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDate && slots.length === 0 && (
                                <p className="empty-state" style={{ textAlign: 'left', padding: '20px 0' }}>No slots available for this date</p>
                            )}

                            {selectedSlot && (
                                <button className="btn-primary" style={{ marginTop: 24 }} onClick={handleBook}>
                                    <FaCheckCircle style={{ marginRight: 6 }} /> Confirm Appointment at {formatTime12h(selectedSlot)}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'bookings' && (
                <div className="dash-section">
                    <h3>My Appointments ({appointments.length})</h3>
                    <div className="appointment-list">
                        {appointments.map(appt => {
                            const { day, month } = formatDate(appt.appointmentDate);
                            return (
                                <div key={appt.id} className="card appointment-card">
                                    <div className="appt-date">
                                        <div className="day">{day}</div>
                                        <div className="month">{month}</div>
                                    </div>
                                    <div className="appt-info">
                                        <h4>Dr. {appt.doctor?.name || 'Doctor'}</h4>
                                        <p><FaClock style={{ fontSize: 11, marginRight: 4 }} /> {formatTime12h(appt.slotTime)} · {appt.doctor?.specialization}</p>
                                    </div>
                                    <span className={`status-badge ${appt.status?.toLowerCase()}`}>{appt.status}</span>
                                </div>
                            );
                        })}
                        {appointments.length === 0 && <p className="empty-state">No appointments yet. Browse doctors to book!</p>}
                    </div>
                </div>
            )}

            {tab === 'profile' && (
                <div className="dash-section">
                    <div className="patient-profile-header">
                        <h3>My Profile</h3>
                        <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                            <FaEdit style={{ marginRight: 6 }} />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="card patient-profile-card">
                        <div className="form-group">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                            ) : (
                                <p className="static-value">{profile.name || '—'}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <p className="static-value">{profile.phone || '—'}</p>
                            <small className="text-muted">Registered phone cannot be changed.</small>
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            {isEditing ? (
                                <input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) })} />
                            ) : (
                                <p className="static-value">{profile.age || '—'}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            {isEditing ? (
                                <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <p className="static-value">{profile.gender || '—'}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            {isEditing ? (
                                <textarea
                                    value={profile.address}
                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    rows={3}
                                />
                            ) : (
                                <p className="static-value">{profile.address || '—'}</p>
                            )}
                        </div>
                        {isEditing && (
                            <button className="btn-primary" style={{ marginTop: 8 }} onClick={handleProfileUpdate}>Save Profile</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
