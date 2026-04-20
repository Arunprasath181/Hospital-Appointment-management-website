import React, { useEffect, useState, useRef } from 'react';
import { adminApi, fileApi } from '../../services/api';
import { FaUserMd, FaEdit, FaPlus, FaTimes, FaCalendarAlt, FaBan, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [tab, setTab] = useState('doctors');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', specialization: '', experience: '', username: '', password: ''
    });
    const [photo, setPhoto] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [blockDate, setBlockDate] = useState({ doctorId: '', date: '' });
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [bookingFilters, setBookingFilters] = useState({ doctorId: '', date: '' });
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
    const messageTimer = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    // Auto-dismiss message after 3 seconds
    useEffect(() => {
        if (message) {
            if (messageTimer.current) clearTimeout(messageTimer.current);
            messageTimer.current = setTimeout(() => setMessage(''), 3000);
        }
        return () => { if (messageTimer.current) clearTimeout(messageTimer.current); };
    }, [message]);

    const loadData = async () => {
        try {
            const [doctorsRes, statsRes, usersRes] = await Promise.all([
                adminApi.getDoctors(),
                adminApi.getStats(),
                adminApi.getUsers()
            ]);
            setDoctors(doctorsRes.data);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            let photoPath = formData.photoPath || '';
            if (photo) {
                const fd = new FormData();
                fd.append('file', photo);
                const photoRes = await fileApi.upload(fd);
                photoPath = photoRes.data;
            }

            if (editMode && editingId) {
                await adminApi.updateDoctor(editingId, { ...formData, experience: parseInt(formData.experience), photoPath });
                setMessage('Doctor updated successfully!');
            } else {
                await adminApi.createDoctor({ ...formData, experience: parseInt(formData.experience), photoPath });
                setMessage('Doctor created successfully!');
            }

            setShowForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({ name: '', specialization: '', experience: '', username: '', password: '' });
            setPhoto(null);
            loadData();
        } catch (err) {
            setMessage(editMode ? 'Failed to update doctor' : 'Failed to create doctor');
        }
    };

    const startEdit = (doc) => {
        setEditMode(true);
        setEditingId(doc.id);
        setFormData({
            name: doc.name,
            specialization: doc.specialization,
            experience: doc.experience,
            username: doc.user?.username || '',
            password: '',
            photoPath: doc.photoPath
        });
        setPhoto(null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddClick = () => {
        if (showForm && !editMode) {
            setShowForm(false);
        } else {
            setEditMode(false);
            setEditingId(null);
            setFormData({ name: '', specialization: '', experience: '', username: '', password: '' });
            setPhoto(null);
            setShowForm(true);
        }
    };

    const handleDeleteDoctor = (doc) => {
        setConfirmModal({
            show: true,
            title: 'Delete Doctor',
            message: `Are you sure you want to delete Dr. ${doc.name}? This will also remove all their appointments, schedules, and login account.`,
            onConfirm: async () => {
                try {
                    await adminApi.deleteDoctor(doc.id);
                    setMessage(`Dr. ${doc.name} has been deleted.`);
                    loadData();
                } catch (err) {
                    setMessage('Failed to delete doctor.');
                }
                setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    const handleBlockDate = async () => {
        if (!blockDate.doctorId || !blockDate.date) {
            setMessage('Please select a doctor and a date.');
            return;
        }
        try {
            await adminApi.blockDate({ doctorId: parseInt(blockDate.doctorId), date: blockDate.date });
            setMessage('Date blocked successfully!');
            setBlockDate({ doctorId: '', date: '' });
        } catch (err) {
            setMessage('Failed to block date');
        }
    };

    const handleFilterBookings = async () => {
        try {
            const res = await adminApi.filterBookings(bookingFilters.doctorId, bookingFilters.date);
            setBookings(res.data);
        } catch (err) {
            setMessage('Failed to filter bookings');
        }
    };

    const handleExportBookings = async (format) => {
        const url = `http://localhost:8081/api/admin/bookings/export?format=${format}${bookingFilters.doctorId ? `&doctorId=${bookingFilters.doctorId}` : ''}${bookingFilters.date ? `&date=${bookingFilters.date}` : ''}`;
        try {
            const storedUser = localStorage.getItem('hospital_user');
            const token = storedUser ? JSON.parse(storedUser).jwt : '';
            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `bookings_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'csv'}`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            setMessage('Export failed. Please try again.');
        }
    };

    // Group users by role
    const admins = users.filter(u => u.role === 'ADMIN');
    const doctorUsers = users.filter(u => u.role === 'DOCTOR');
    const patients = users.filter(u => u.role === 'PATIENT');

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div className="tab-bar">
                    <button className={tab === 'doctors' ? 'tab active' : 'tab'} onClick={() => setTab('doctors')}>
                        <FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Doctors
                    </button>
                    <button className={tab === 'stats' ? 'tab active' : 'tab'} onClick={() => setTab('stats')}>
                        <FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Booking Stats
                    </button>
                    <button className={tab === 'users' ? 'tab active' : 'tab'} onClick={() => setTab('users')}>Users</button>
                    <button className={tab === 'bookings' ? 'tab active' : 'tab'} onClick={() => { setTab('bookings'); handleFilterBookings(); }}>Bookings</button>
                    <button className={tab === 'block' ? 'tab active' : 'tab'} onClick={() => setTab('block')}>
                        <FaBan style={{ marginRight: 6, verticalAlign: 'middle' }} /> Block Dates
                    </button>
                </div>
            </div>

            {message && <div className="dash-message">{message}</div>}

            {/* ═══ DOCTORS TAB ═══ */}
            {tab === 'doctors' && (
                <div className="dash-section">
                    <div className="section-header">
                        <h3>Doctor Management</h3>
                        <button className="btn-primary" onClick={handleAddClick}>
                            {showForm ? <><FaTimes style={{ marginRight: 6 }} />Cancel</> : <><FaPlus style={{ marginRight: 6 }} />Add Doctor</>}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleCreateDoctor} className="card form-card">
                            <h4>{editMode ? 'Edit Doctor Profile' : 'Create New Doctor'}</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Doctor Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Experience (years)</label>
                                    <input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Login Username</label>
                                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={editMode} />
                                    {editMode && <small>Username cannot be changed.</small>}
                                </div>
                                {!editMode && (
                                    <div className="form-group">
                                        <label>Login Password</label>
                                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Profile Photo</label>
                                    <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">{editMode ? 'Save Changes' : 'Create Doctor'}</button>
                        </form>
                    )}

                    <div className="card-grid">
                        {doctors.map(doc => (
                            <div key={doc.id} className="card doctor-card">
                                <div className="doctor-photo">
                                    {doc.photoPath ? (
                                        <img src={fileApi.getUrl(doc.photoPath)} alt={doc.name} />
                                    ) : (
                                        <div className="photo-placeholder"><FaUserMd /></div>
                                    )}
                                </div>
                                <h4>{doc.name}</h4>
                                <p className="specialization">{doc.specialization}</p>
                                <p className="experience">{doc.experience} yrs experience</p>
                                <div className="doctor-card-actions">
                                    <button className="btn-text" onClick={(e) => { e.stopPropagation(); startEdit(doc); }}>
                                        <FaEdit style={{ marginRight: 4 }} /> Edit
                                    </button>
                                    <button className="btn-text btn-danger-text" onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doc); }}>
                                        <FaTrash style={{ marginRight: 4 }} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {doctors.length === 0 && <p className="empty-state">No doctors yet. Add one above!</p>}
                    </div>
                </div>
            )}

            {/* ═══ BOOKING STATS TAB ═══ */}
            {tab === 'stats' && (
                <div className="dash-section">
                    <h3>Booking Statistics</h3>
                    {Object.keys(stats).length === 0 ? (
                        <p className="empty-state">No bookings yet</p>
                    ) : (
                        <div className="stats-grid">
                            {Object.entries(stats).map(([name, count]) => (
                                <div key={name} className="card stat-card-item">
                                    <div className="stat-icon"><FaUserMd /></div>
                                    <div className="stat-details">
                                        <h4>{name}</h4>
                                        <p className="stat-number">{count}</p>
                                        <span className="stat-label">Total Bookings</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══ USERS TAB ═══ */}
            {tab === 'users' && (
                <div className="dash-section">
                    {/* Admins */}
                    <div className="user-category">
                        <h3><FaUserShield style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--primary)' }} /> Administrators ({admins.length})</h3>
                        <div className="card">
                            <table className="data-table">
                                <thead>
                                    <tr><th>ID</th><th>Username</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {admins.map(u => (
                                        <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.enabled ? <span className="status-badge booked">Active</span> : <span className="status-badge cancelled">Disabled</span>}</td></tr>
                                    ))}
                                    {admins.length === 0 && <tr><td colSpan={3} className="empty-state">No admins found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Doctors */}
                    <div className="user-category">
                        <h3><FaUserMd style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--primary)' }} /> Doctors ({doctorUsers.length})</h3>
                        <div className="card">
                            <table className="data-table">
                                <thead>
                                    <tr><th>ID</th><th>Username</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {doctorUsers.map(u => (
                                        <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.enabled ? <span className="status-badge booked">Active</span> : <span className="status-badge cancelled">Disabled</span>}</td></tr>
                                    ))}
                                    {doctorUsers.length === 0 && <tr><td colSpan={3} className="empty-state">No doctor users found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Patients */}
                    <div className="user-category">
                        <h3><FaUser style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--primary)' }} /> Patients ({patients.length})</h3>
                        <div className="card">
                            <table className="data-table">
                                <thead>
                                    <tr><th>ID</th><th>Username</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {patients.map(u => (
                                        <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.enabled ? <span className="status-badge booked">Active</span> : <span className="status-badge cancelled">Disabled</span>}</td></tr>
                                    ))}
                                    {patients.length === 0 && <tr><td colSpan={3} className="empty-state">No patients found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ BOOKINGS TAB ═══ */}
            {tab === 'bookings' && (
                <div className="dash-section">
                    <div className="section-header">
                        <h3>Detailed Bookings</h3>
                        <div className="export-buttons" style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-text" onClick={() => handleExportBookings('pdf')} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' }}>Export PDF</button>
                            <button className="btn-text" onClick={() => handleExportBookings('csv')} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7' }}>Export CSV</button>
                        </div>
                    </div>

                    <div className="card filter-card" style={{ marginBottom: 20, padding: 20 }}>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                                <label style={{ marginBottom: 8, display: 'block' }}>Filter by Doctor</label>
                                <select value={bookingFilters.doctorId} onChange={(e) => setBookingFilters({ ...bookingFilters, doctorId: e.target.value })}>
                                    <option value="">All Doctors</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                                <label style={{ marginBottom: 8, display: 'block' }}>Filter by Date</label>
                                <input type="date" value={bookingFilters.date} onChange={(e) => setBookingFilters({ ...bookingFilters, date: e.target.value })} />
                            </div>
                            <button className="btn-primary" onClick={handleFilterBookings} style={{ height: 42, whiteSpace: 'nowrap' }}>Apply Filters</button>
                        </div>
                    </div>

                    <div className="card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.patient?.name}</td>
                                        <td>{b.doctor?.name}</td>
                                        <td>{b.appointmentDate}</td>
                                        <td>{b.slotTime}</td>
                                        <td><span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && <tr><td colSpan={5} className="empty-state">No bookings found for the selected criteria.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══ BLOCK DATES TAB ═══ */}
            {tab === 'block' && (
                <div className="dash-section">
                    <h3>Block Doctor Dates</h3>
                    <div className="card form-card" style={{ maxWidth: 500 }}>
                        <div className="form-group">
                            <label>Select Doctor</label>
                            <select value={blockDate.doctorId} onChange={(e) => setBlockDate({ ...blockDate, doctorId: e.target.value })}>
                                <option value="">-- Select --</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date to Block</label>
                            <input type="date" value={blockDate.date} onChange={(e) => setBlockDate({ ...blockDate, date: e.target.value })} />
                        </div>
                        <button className="btn-primary" onClick={handleBlockDate}>
                            <FaBan style={{ marginRight: 6 }} /> Block Date
                        </button>
                    </div>
                </div>
            )}
            {/* ═══ CONFIRM MODAL ═══ */}
            {confirmModal.show && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <div className="modal-header">
                            <FaUserShield className="modal-icon" />
                            <h3>{confirmModal.title}</h3>
                        </div>
                        <div className="modal-body">
                            <p>{confirmModal.message}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}>Cancel</button>
                            <button className="btn-primary btn-danger" onClick={confirmModal.onConfirm}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
