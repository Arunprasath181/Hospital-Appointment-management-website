import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi, fileApi } from '../../services/api';
import { FaUserMd, FaGraduationCap, FaPhone, FaCalendarCheck, FaEdit, FaClock, FaLock, FaBan } from 'react-icons/fa';
import '../admin/Dashboard.css';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState({
        name: '',
        specialization: '',
        experience: 0,
        about: '',
        phone: '',
        photoPath: ''
    });
    const [schedule, setSchedule] = useState([]);
    const [tab, setTab] = useState('appointments');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [leaveDate, setLeaveDate] = useState('');

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user]);

    const loadData = async (date = '') => {
        // Load Appointments
        try {
            const res = date
                ? await doctorApi.filterAppointments(user.id, date)
                : await doctorApi.getAppointments(user.id);
            const sorted = (res.data || []).sort((a, b) => {
                const dateA = new Date(a.appointmentDate);
                const dateB = new Date(b.appointmentDate);
                if (dateA - dateB !== 0) return dateA - dateB;
                return (a.slotTime || '').localeCompare(b.slotTime || '');
            });
            setAppointments(sorted);
        } catch (err) {
            console.error('Failed to load appointments', err);
        }

        // Load Profile
        try {
            const res = await doctorApi.getProfile(user.id);
            setProfile(res.data || {});
        } catch (err) {
            console.error('Failed to load profile', err);
        }

        // Load Schedule
        try {
            const res = await doctorApi.getSchedule(user.id);
            const data = res.data || [];
            const fullSchedule = days.map(day => {
                const match = data.find(s => s.dayOfWeek && s.dayOfWeek.toUpperCase() === day);
                return match
                    ? { ...match, disabled: false }
                    : { dayOfWeek: day, startTime: '09:00:00', endTime: '17:00:00', disabled: true };
            });
            setSchedule(fullSchedule);
        } catch (err) {
            console.error('Failed to load schedule', err);
            setSchedule(days.map(day => ({ dayOfWeek: day, startTime: '09:00:00', endTime: '17:00:00', disabled: true })));
        }
    };

    const handleProfileUpdate = async () => {
        try {
            await doctorApi.updateProfile(user.id, profile);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            loadData();
        } catch (err) {
            setMessage('Failed to update profile.');
        }
    };

    const handleScheduleUpdate = async () => {
        try {
            const activeSchedules = schedule.filter(s => !s.disabled).map(s => {
                const startTimeStr = formatTimeForInput(s.startTime);
                const endTimeStr = formatTimeForInput(s.endTime);
                return {
                    dayOfWeek: s.dayOfWeek,
                    startTime: startTimeStr.length === 5 ? startTimeStr + ':00' : startTimeStr,
                    endTime: endTimeStr.length === 5 ? endTimeStr + ':00' : endTimeStr
                };
            });
            await doctorApi.updateSchedule(user.id, activeSchedules);
            setMessage('Schedule saved successfully! Your availability has been updated.');
            loadData();
        } catch (err) {
            console.error('Save schedule error:', err);
            setMessage('Failed to save schedule. Please check your network connection.');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fileApi.upload(formData);
            await doctorApi.updatePhoto(user.id, res.data);
            setMessage('Photo updated!');
            loadData();
        } catch (err) {
            setMessage('Upload failed.');
        }
    };

    const handleChangePassword = async () => {
        try {
            await doctorApi.changePassword(user.userId, { oldPassword, newPassword });
            setMessage('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setMessage('Failed to change password.');
        }
    };

    const handleFilter = () => {
        loadData(filterDate);
    };

    const handleExport = async (format) => {
        const url = `http://localhost:8081/api/doctor/${user.id}/appointments/export?format=${format}${filterDate ? `&date=${filterDate}` : ''}`;
        try {
            const storedUser = localStorage.getItem('hospital_user');
            const token = storedUser ? JSON.parse(storedUser).jwt : '';
            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `doctor_bookings_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'csv'}`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            setMessage('Export failed. Please try again.');
        }
    };

    const handleMarkEmergencyLeave = async () => {
        if (!leaveDate) {
            setMessage('Please select a date for emergency leave.');
            return;
        }
        if (!window.confirm(`Are you sure you want to mark ${leaveDate} as emergency leave? All appointments for this day will be cancelled and patients will be notified.`)) return;

        try {
            await doctorApi.markEmergencyLeave(user.id, leaveDate);
            setMessage('Emergency leave marked and patients notified successfully!');
            setLeaveDate('');
            loadData();
        } catch (err) {
            setMessage('Failed to mark emergency leave.');
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }) };
    };

    const formatTime12h = (time) => {
        if (!time) return '09:00 AM';
        let h, m;
        if (typeof time === 'string') {
            [h, m] = time.split(':').map(Number);
        } else if (Array.isArray(time)) {
            [h, m] = time;
        } else {
            return '09:00 AM';
        }
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    const formatTimeForInput = (time) => {
        if (!time) return '09:00';
        if (typeof time === 'string') return time.substring(0, 5);
        if (Array.isArray(time)) {
            const [h, m] = time;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
        return '09:00';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Doctor Dashboard</h2>
                <div className="tab-bar">
                    <button className={tab === 'appointments' ? 'tab active' : 'tab'} onClick={() => setTab('appointments')}>
                        <FaCalendarCheck style={{ marginRight: 6, verticalAlign: 'middle' }} /> Appointments
                    </button>
                    <button className={tab === 'profile' ? 'tab active' : 'tab'} onClick={() => setTab('profile')}>
                        <FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Profile
                    </button>
                    <button className={tab === 'schedule' ? 'tab active' : 'tab'} onClick={() => setTab('schedule')}>
                        <FaClock style={{ marginRight: 6, verticalAlign: 'middle' }} /> Availability
                    </button>
                    <button className={tab === 'settings' ? 'tab active' : 'tab'} onClick={() => setTab('settings')}>
                        <FaLock style={{ marginRight: 6, verticalAlign: 'middle' }} /> Settings
                    </button>
                    <button className={tab === 'leave' ? 'tab active' : 'tab'} onClick={() => setTab('leave')}>
                        <FaBan style={{ marginRight: 6, verticalAlign: 'middle' }} /> Emergency Leave
                    </button>
                </div>
            </div>

            {message && <div className="dash-message">{message}</div>}

            {tab === 'appointments' && (
                <div className="dash-section">
                    <div className="section-header">
                        <h3>Upcoming Appointments ({appointments.length})</h3>
                        <div className="export-buttons" style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-text" onClick={() => handleExport('pdf')} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' }}>Export PDF</button>
                            <button className="btn-text" onClick={() => handleExport('csv')} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7' }}>Export CSV</button>
                        </div>
                    </div>

                    <div className="card filter-card" style={{ marginBottom: 20, padding: 20 }}>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
                                <label style={{ marginBottom: 8, display: 'block' }}>Filter by Date</label>
                                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                            </div>
                            <button className="btn-primary" onClick={handleFilter} style={{ height: 42, whiteSpace: 'nowrap' }}>Apply Filter</button>
                        </div>
                    </div>

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
                                        <h4>{appt.patient?.name || 'Patient'}</h4>
                                        <p><FaClock style={{ fontSize: 11, marginRight: 4 }} /> {appt.slotTime} · <FaPhone style={{ fontSize: 10, marginRight: 2, marginLeft: 4 }} /> {appt.patient?.phone || 'N/A'}</p>
                                    </div>
                                    <span className={`status-badge ${appt.status?.toLowerCase()}`}>{appt.status}</span>
                                </div>
                            );
                        })}
                        {appointments.length === 0 && <p className="empty-state">No upcoming appointments</p>}
                    </div>
                </div>
            )}

            {tab === 'profile' && (
                <div className="dash-section profile-centered">
                    <div className="section-header">
                        <h3>My Profile</h3>
                        <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                            <FaEdit style={{ marginRight: 6 }} />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="card profile-full-card">
                        <div className="profile-header-main">
                            <div className="profile-photo-section">
                                <div className="doctor-photo" style={{ width: 120, height: 120 }}>
                                    {profile.photoPath ? (
                                        <img
                                            src={fileApi.getUrl(profile.photoPath)}
                                            alt={profile.name}
                                            style={{ width: 120, height: 120 }}
                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="photo-placeholder" style="width: 120px; height: 120px; font-size: 48px">👨‍⚕️</div>'; }}
                                        />
                                    ) : (
                                        <div className="photo-placeholder" style={{ width: 120, height: 120, fontSize: 48 }}><FaUserMd /></div>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="photo-upload">
                                        <label className="btn-text">
                                            Change Photo
                                            <input type="file" hidden onChange={handlePhotoUpload} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="profile-info-main">
                                {isEditing ? (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Specialization</label>
                                            <input type="text" value={profile.specialization} onChange={e => setProfile({ ...profile, specialization: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Experience (Years)</label>
                                            <input type="number" value={profile.experience} onChange={e => setProfile({ ...profile, experience: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1>{profile.name}</h1>
                                        <p className="specialization-large">{profile.specialization}</p>
                                        <div className="profile-badges">
                                            <span className="info-badge"><FaGraduationCap style={{ marginRight: 4 }} /> {profile.experience} Years Exp.</span>
                                            <span className="info-badge"><FaPhone style={{ marginRight: 4 }} /> {profile.phone || 'No phone set'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="profile-details-section">
                            <h4>About</h4>
                            {isEditing ? (
                                <textarea
                                    value={profile.about}
                                    onChange={e => setProfile({ ...profile, about: e.target.value })}
                                    rows={5}
                                    className="form-control"
                                    placeholder="Write something about yourself..."
                                />
                            ) : (
                                <p className="about-text">{profile.about || 'No description provided yet.'}</p>
                            )}
                        </div>

                        {isEditing && (
                            <button className="btn-primary" style={{ marginTop: 24 }} onClick={handleProfileUpdate}>Save Changes</button>
                        )}
                    </div>
                </div>
            )}

            {tab === 'schedule' && (
                <div className="dash-section">
                    <h3>Availability Schedule</h3>
                    <p className="text-muted" style={{ marginBottom: 20 }}>Set your working hours for each day of the week.</p>
                    <div className="card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Status</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((s, idx) => (
                                    <tr key={s.dayOfWeek}>
                                        <td><strong>{s.dayOfWeek}</strong></td>
                                        <td>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={!s.disabled}
                                                    onChange={e => {
                                                        const newSched = [...schedule];
                                                        newSched[idx].disabled = !e.target.checked;
                                                        setSchedule(newSched);
                                                    }}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="time-input-group">
                                                <input
                                                    type="time"
                                                    disabled={s.disabled}
                                                    value={formatTimeForInput(s.startTime)}
                                                    onChange={e => {
                                                        const newSched = [...schedule];
                                                        newSched[idx].startTime = e.target.value;
                                                        setSchedule(newSched);
                                                    }}
                                                />
                                                {!s.disabled && <span className="time-display-12h">{formatTime12h(s.startTime)}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="time-input-group">
                                                <input
                                                    type="time"
                                                    disabled={s.disabled}
                                                    value={formatTimeForInput(s.endTime)}
                                                    onChange={e => {
                                                        const newSched = [...schedule];
                                                        newSched[idx].endTime = e.target.value;
                                                        setSchedule(newSched);
                                                    }}
                                                />
                                                {!s.disabled && <span className="time-display-12h">{formatTime12h(s.endTime)}</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn-primary" style={{ marginTop: 24, marginLeft: 16, marginBottom: 16 }} onClick={handleScheduleUpdate}>
                            Save Schedule
                        </button>
                    </div>
                </div>
            )}

            {tab === 'settings' && (
                <div className="dash-section">
                    <h3>Account Settings</h3>
                    <div className="card form-card" style={{ maxWidth: 400 }}>
                        <h4><FaLock style={{ marginRight: 6, verticalAlign: 'middle' }} /> Change Password</h4>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <button className="btn-primary" onClick={handleChangePassword}>Update Password</button>
                    </div>
                </div>
            )}

            {tab === 'leave' && (
                <div className="dash-section">
                    <h3>Mark Emergency Leave</h3>
                    <p className="text-muted" style={{ marginBottom: 20 }}>Mark yourself as unavailable for a specific day. All existing appointments for that day will be cancelled and patients will receive a notification.</p>
                    <div className="card form-card" style={{ maxWidth: 500 }}>
                        <div className="form-group">
                            <label>Select Date</label>
                            <input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <button className="btn-primary btn-danger" onClick={handleMarkEmergencyLeave}>
                            <FaBan style={{ marginRight: 6 }} /> Mark Emergency Leave
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
