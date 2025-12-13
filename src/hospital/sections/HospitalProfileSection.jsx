export default function HospitalProfileSection({ profile }) {
  const details = profile ?? {};
  const servicesText = Array.isArray(details.services) ? details.services.join(', ') : details.services || '—';

  return (
    <div className="hospital-grid cols-2">
      <div className="hospital-card">
        <h3>Hospital Profile</h3>
        <div className="profile-details">
          <div className="profile-detail">
            <span>Name</span>
            <strong>{details.name || '—'}</strong>
          </div>
          <div className="profile-detail">
            <span>Location</span>
            <strong>{details.location || '—'}</strong>
          </div>
          <div className="profile-detail">
            <span>Contact</span>
            <strong>{details.contact || '—'}</strong>
          </div>
          <div className="profile-detail">
            <span>Email</span>
            <strong>{details.email || '—'}</strong>
          </div>
          <div className="profile-detail">
            <span>Services</span>
            <strong>{servicesText}</strong>
          </div>
          <div className="profile-detail">
            <span>Timings</span>
            <strong>{details.timings || '—'}</strong>
          </div>
        </div>
      </div>
      <div className="hospital-card">
        <h3>Update Profile</h3>
        <form className="hospital-grid">
          <div>
            <label className="form-label">Hospital Name</label>
            <input className="hospital-input" defaultValue={details.name} />
          </div>
          <div>
            <label className="form-label">Contact Number</label>
            <input className="hospital-input" defaultValue={details.contact} />
          </div>
          <div>
            <label className="form-label">Services</label>
            <textarea className="hospital-textarea" defaultValue={servicesText} />
          </div>
          <div>
            <label className="form-label">Upload Logo</label>
            <input className="hospital-input" type="file" />
          </div>
          <div className="hospital-form-actions">
            <button type="button" className="btn-hospital-outline">
              Cancel
            </button>
            <button type="button" className="btn-hospital-primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
