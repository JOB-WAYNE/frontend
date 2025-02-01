// src/services/api.js

import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Change this based on your backend's deployment

const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/login`, { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${baseURL}/doctors`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.doctors;
  } catch (error) {
    console.error('Fetch doctors error:', error);
    throw error;
  }
};

const bookAppointment = async (patientName, doctorId, date) => {
  try {
    const response = await axios.post(`${baseURL}/appointments`, 
      { patient_name: patientName, doctor_id: doctorId, date },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Appointment booking error:', error);
    throw error;
  }
};

export { login, fetchDoctors, bookAppointment };