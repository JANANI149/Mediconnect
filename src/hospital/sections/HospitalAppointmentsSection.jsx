export default function HospitalAppointmentsSection({
  doctors,
  appointments,
  appointmentFilter,
  onFilterChange,
  onExportClick,
  onStatusUpdate,
}) {
  const handleDoctorChange = (event) => {
    onFilterChange({ ...appointmentFilter, doctor: event.target.value });
  };

  const handleDateChange = (event) => {
    onFilterChange({ ...appointmentFilter, date: event.target.value });
  };

  return (
    <div className="hospital-card">
      <h3>Appointments</h3>
      <div className="filters">
        <select className="hospital-select" value={appointmentFilter.doctor} onChange={handleDoctorChange}>
          <option value="all">All doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>
        <input className="hospital-input" type="date" value={appointmentFilter.date} onChange={handleDateChange} />
        <button type="button" className="btn-hospital-outline" onClick={onExportClick}>
          Export CSV
        </button>
      </div>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient}</td>
              <td>{appointment.doctor}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>
                <span className={`badge ${appointment.status}`}>{appointment.status}</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn-hospital-outline"
                  onClick={() => onStatusUpdate?.(appointment)}
                >
                  Update status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
