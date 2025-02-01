import React, { useState } from "react";
import "./styles.css";

function HospitalManagementSystem() {
  // Sample data for doctors
  const [doctors] = useState([
    { id: 1, name: "Dr. Alice Johnson", specialization: "Cardiologist", available: true },
    { id: 2, name: "Dr. Bob Smith", specialization: "Dermatologist", available: false },
    { id: 3, name: "Dr. Carol Lee", specialization: "Neurologist", available: true },
    { id: 4, name: "Dr. David Wilson", specialization: "Pediatrician", available: true },
  ]);

  // State for appointment booking
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({ name: "", date: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Handle booking submission
  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDetails.name || !appointmentDetails.date) {
      alert("Please complete all fields.");
      return;
    }
    setConfirmationMessage(
      `Appointment successfully booked with ${selectedDoctor.name} on ${appointmentDetails.date} for ${appointmentDetails.name}.`
    );
    setSelectedDoctor(null);
    setAppointmentDetails({ name: "", date: "" });
  };

  return (
    <div className="container">
      <h1 className="title">Hospital Management System</h1>

      {/* Doctors List */}
      <div className="doctors-list">
        <h2 className="subtitle">Available Doctors</h2>
        <ul>
          {doctors.map((doctor) => (
            <li
              key={doctor.id}
              className={`doctor-card ${doctor.available ? "available" : "unavailable"}`}
            >
              <div className="doctor-info">
                <div>
                  <p className="doctor-name">{doctor.name}</p>
                  <p className="doctor-specialization">{doctor.specialization}</p>
                </div>
                {doctor.available ? (
                  <button
                    className="button book-button"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Book Appointment
                  </button>
                ) : (
                  <span className="unavailable-text">Not Available</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Appointment Form */}
      {selectedDoctor && (
        <div className="appointment-form">
          <h2 className="subtitle">
            Book Appointment with {selectedDoctor.name}
          </h2>
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                className="input-field"
                value={appointmentDetails.name}
                onChange={(e) =>
                  setAppointmentDetails({ ...appointmentDetails, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Appointment Date</label>
              <input
                type="date"
                className="input-field"
                value={appointmentDetails.date}
                onChange={(e) =>
                  setAppointmentDetails({ ...appointmentDetails, date: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="button submit-button">
              Confirm Appointment
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Message */}
      {confirmationMessage && (
        <div className="confirmation-message">
          <p>{confirmationMessage}</p>
        </div>
      )}
    </div>
  );
}

export default HospitalManagementSystem;