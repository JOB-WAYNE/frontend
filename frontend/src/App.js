import React, { useState, useEffect } from "react";
import "./styles.css";

function HospitalManagementSystem() {
  const [doctors, setDoctors] = useState([]);  // To hold doctor data
  const [selectedDoctor, setSelectedDoctor] = useState(null);  // For selected doctor
  const [appointmentDetails, setAppointmentDetails] = useState({ name: "", date: "" });  // For appointment details
  const [confirmationMessage, setConfirmationMessage] = useState("");  // For success/failure message

  // Fetch doctors from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/doctors")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Log the data to check if it's fetched correctly
        setDoctors(data);  // Set the doctors list
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);
  

  // Handle form submission for booking an appointment
  const handleBooking = (e) => {
    e.preventDefault();  // Prevent default form submission

    // Check if all fields are filled
    if (!selectedDoctor || !appointmentDetails.name || !appointmentDetails.date) {
      alert("Please complete all fields.");
      return;
    }

    // Create an appointment object
    const appointmentData = {
      patient_name: appointmentDetails.name,
      doctor_id: selectedDoctor.id,
      date: appointmentDetails.date,
    };

    // Send POST request to the backend to book an appointment
    fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // In case of error message from backend
          setConfirmationMessage(data.message);
        } else {
          // Success message
          setConfirmationMessage(
            `Appointment successfully booked with Dr. ${selectedDoctor.name} on ${appointmentDetails.date} for ${appointmentDetails.name}.`
          );
        }
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        setConfirmationMessage("An error occurred while booking your appointment.");
      });

    // Reset form fields after booking
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
                    onClick={() => setSelectedDoctor(doctor)} // Select doctor
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
          <h2 className="subtitle">Book Appointment with {selectedDoctor.name}</h2>
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
