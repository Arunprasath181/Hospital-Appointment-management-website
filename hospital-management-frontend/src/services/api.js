import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('hospital_user');
    if (storedUser) {
        const { jwt } = JSON.parse(storedUser);
        if (jwt) {
            config.headers.Authorization = `Bearer ${jwt}`;
        }
    }
    return config;
});

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    sendOtp: (phone) => api.post('/auth/otp/send', { phone }),
    verifyOtp: (phone, otp) => api.post('/auth/otp/verify', { phone, otp }),
    register: (patientData) => api.post('/auth/register', patientData),
};

export const adminApi = {
    createDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
    getDoctors: () => api.get('/admin/doctors'),
    deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
    blockDate: (data) => api.post('/admin/blocked-dates', data),
    getUsers: () => api.get('/admin/users'),
    getStats: () => api.get('/admin/bookings/stats'),
    updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
    filterBookings: (doctorId, date) => api.get(`/admin/bookings/filter?${doctorId ? `doctorId=${doctorId}&` : ''}${date ? `date=${date}` : ''}`),
};

export const doctorApi = {
    getAppointments: (id) => api.get(`/doctor/${id}/appointments`),
    getProfile: (id) => api.get(`/doctor/${id}/profile`),
    updateProfile: (id, data) => api.put(`/doctor/${id}/profile`, data),
    getSchedule: (id) => api.get(`/doctor/${id}/schedule`),
    updateSchedule: (id, schedules) => api.put(`/doctor/${id}/schedule`, schedules),
    updatePhoto: (id, photoPath) => api.put(`/doctor/${id}/photo`, photoPath),
    changePassword: (userId, passwords) => api.put(`/doctor/password?userId=${userId}`, passwords),
    filterAppointments: (id, date) => api.get(`/doctor/${id}/appointments/filter?${date ? `date=${date}` : ''}`),
    markEmergencyLeave: (id, date) => api.post(`/doctor/${id}/emergency-leave?date=${date}`),
};

export const patientApi = {
    getDoctors: () => api.get('/patient/doctors'),
    getSlots: (doctorId, date) => api.get(`/patient/doctors/${doctorId}/slots?date=${date}`),
    bookAppointment: (patientId, data) => api.post(`/patient/appointments?patientId=${patientId}`, data),
    getMyAppointments: (id) => api.get(`/patient/${id}/appointments`),
    getProfile: (id) => api.get(`/patient/${id}/profile`),
    updateProfile: (id, data) => api.put(`/patient/${id}/profile`, data),
};

export const fileApi = {
    upload: (formData) => api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getUrl: (filename) => `${API_URL}/files/${filename}`,
};

export default api;
