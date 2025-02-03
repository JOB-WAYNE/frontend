import React, { useState, useEffect } from "react";
import "./styles.css";

function HospitalManagementSystem() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({ name: "", date: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/doctors")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        return response.json();
      })
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching doctors:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDetails.name || !appointmentDetails.date) {
      alert("Please complete all fields.");
      return;
    }

    const appointmentData = {
      patient_name: appointmentDetails.name,
      doctor_id: selectedDoctor.id,
      date: appointmentDetails.date,
    };

    fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setConfirmationMessage(data.message);
        } else {
          setConfirmationMessage(
            `Appointment successfully booked with Dr. ${selectedDoctor.name} on ${appointmentDetails.date} for ${appointmentDetails.name}.`
          );
          // Reset form fields after booking
          setSelectedDoctor(null);
          setAppointmentDetails({ name: "", date: "" });
        }
        // Clear message after 5 seconds
        setTimeout(() => setConfirmationMessage(""), 5000);
      })
      .catch(error => {
        console.error("Error booking appointment:", error);
        setConfirmationMessage("An error occurred while booking your appointment.");
        setTimeout(() => setConfirmationMessage(""), 5000);
      });
  };

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">Hospital Management System</h1>

      <div className="doctors-list">
        <h2 className="subtitle">Available Doctors</h2>
        <ul>
          {doctors.length > 0 ? (
            doctors.map(doctor => (
              <li key={doctor.id} className="doctor-card">
                <div className="doctor-info">
                  <div>
                    <p className="doctor-name">{doctor.name}</p>
                    <p className="doctor-specialization">{doctor.specialization}</p>
                  </div>
                  <button
                    className="button book-button"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Book Appointment
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No doctors available</p>
          )}
        </ul>
      </div>

      {selectedDoctor && (
        <div className="appointment-form">
          <h2 className="subtitle">Book Appointment with {selectedDoctor.name}</h2>
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                className="input-field"
                value={appointmentDetails.name}
                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Appointment Date</label>
              <input
                type="date"
                className="input-field"
                value={appointmentDetails.date}
                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                required
                pattern="\d{4}-\d{2}-\d{2}"
                title="Enter date in YYYY-MM-DD format"
              />
            </div>
            <button type="submit" className="button submit-button">
              Confirm Appointment
            </button>
          </form>
        </div>
      )}

      {confirmationMessage && (
        <div className="confirmation-message">
          <p>{confirmationMessage}</p>
        </div>
      )}
    </div>
  );
}

export default HospitalManagementSystem;