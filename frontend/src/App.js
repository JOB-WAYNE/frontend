import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const API_BASE_URL = "https://hospital-backend-0ak1.onrender.com";

function HospitalManagementSystem() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    email: "",
    age: ""
  });
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "",
    time: ""
  });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Load doctors
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/doctors`)
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error loading doctors:", err));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (
      !selectedDoctor ||
      !patientDetails.name ||
      !patientDetails.email ||
      !patientDetails.age ||
      !appointmentDetails.date ||
      !appointmentDetails.time
    ) {
      alert("Please fill out all fields");
      return;
    }

    try {
      // Step 1: Create patient
      const patientRes = await axios.post(`${API_BASE_URL}/patients/`, {
        name: patientDetails.name,
        email: patientDetails.email,
        age: parseInt(patientDetails.age)
      });

      const patientId = patientRes.data.id;

      // Step 2: Create appointment
      await axios.post(`${API_BASE_URL}/appointments`, {
        doctor_id: selectedDoctor.id,
        patient_id: patientId,
        date: appointmentDetails.date,
        time: appointmentDetails.time
      });

      setConfirmationMessage(
        `✅ Appointment booked with Dr. ${selectedDoctor.name} on ${appointmentDetails.date} at ${appointmentDetails.time} for ${patientDetails.name}`
      );

      // Reset form
      setSelectedDoctor(null);
      setPatientDetails({ name: "", email: "", age: "" });
      setAppointmentDetails({ date: "", time: "" });
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>🏥 Hospital Management System</h1>

      <h2>Available Doctors</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.name}</strong> — {doc.specialty || doc.specialization}
            <button onClick={() => setSelectedDoctor(doc)}>Book</button>
          </li>
        ))}
      </ul>

      {selectedDoctor && (
        <form onSubmit={handleBooking} className="booking-form">
          <h3>Book with Dr. {selectedDoctor.name}</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={patientDetails.name}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={patientDetails.email}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, email: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Your Age"
            value={patientDetails.age}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, age: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={appointmentDetails.date}
            onChange={(e) =>
              setAppointmentDetails({ ...appointmentDetails, date: e.target.value })
            }
            required
          />
          <input
            type="time"
            value={appointmentDetails.time}
            onChange={(e) =>
              setAppointmentDetails({ ...appointmentDetails, time: e.target.value })
            }
            required
          />

          <button type="submit">Confirm Appointment</button>
        </form>
      )}

      {confirmationMessage && <p className="confirmation">{confirmationMessage}</p>}
    </div>
  );
}

export default HospitalManagementSystem;
