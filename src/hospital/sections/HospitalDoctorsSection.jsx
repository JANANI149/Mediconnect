export default function HospitalDoctorsSection({ doctorSearch, onDoctorSearchChange, doctors }) {
  return (
    <div className="hospital-grid">
      <div className="hospital-card">
        <h3>Doctors</h3>
        <input
          className="hospital-input"
          placeholder="Search name or specialization"
          value={doctorSearch}
          onChange={(event) => onDoctorSearchChange(event.target.value)}
        />
        <div className="hospital-grid cols-2" style={{ marginTop: '1rem' }}>
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <strong>{doctor.name}</strong>
              <span className="doctor-meta">
                {doctor.specialization} · {doctor.experience} yrs
              </span>
              <span className="doctor-meta">{doctor.qualification}</span>
              <div className="schedule-chip">Hours · {doctor.workingHours}</div>
              <div className="doctor-meta">Today · {doctor.appointmentsToday} appointments</div>
              <div className="doctor-actions">
                <button type="button">Edit</button>
                <button type="button">Schedule</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hospital-card">
        <h3>Register Doctor</h3>
        <form className="hospital-grid cols-2">
          <div>
            <label className="form-label">Full name</label>
            <input className="hospital-input" placeholder="Dr. Ananya Varma" />
          </div>
          <div>
            <label className="form-label">Specialization</label>
            <input className="hospital-input" placeholder="Dermatology" />
          </div>
          <div>
            <label className="form-label">Qualification</label>
            <input className="hospital-input" placeholder="MD" />
          </div>
          <div>
            <label className="form-label">Experience</label>
            <input className="hospital-input" placeholder="10 years" />
          </div>
          <div>
            <label className="form-label">Working hours</label>
            <input className="hospital-input" placeholder="08:00 - 15:00" />
          </div>
          <div className="hospital-form-actions">
            <button type="button" className="btn-hospital-outline">
              Reset
            </button>
            <button type="button" className="btn-hospital-primary">
              Add doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
