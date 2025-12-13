export default function HospitalNotificationsSection({
  announcements,
  announcementForm,
  onAnnouncementChange,
  onSubmit,
}) {
  const handleChange = (field) => (event) => {
    onAnnouncementChange({ ...announcementForm, [field]: event.target.value });
  };

  return (
    <div className="hospital-grid cols-2">
      <div className="hospital-card">
        <h3>Announcements</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="hospital-grid cols-2">
            <div>
              <label className="form-label">Title</label>
              <input
                className="hospital-input"
                value={announcementForm.title}
                onChange={handleChange('title')}
                placeholder="Radiology update"
              />
            </div>
            <div>
              <label className="form-label">Audience</label>
              <select
                className="hospital-select"
                value={announcementForm.target}
                onChange={handleChange('target')}
              >
                <option>Doctors</option>
                <option>Staff</option>
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="form-label">Schedule</label>
              <input
                type="datetime-local"
                className="hospital-input"
                value={announcementForm.schedule}
                onChange={handleChange('schedule')}
              />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                className="hospital-textarea"
                value={announcementForm.message}
                onChange={handleChange('message')}
                placeholder="Add reminder or SOP details..."
              />
            </div>
          </div>
          <div className="hospital-form-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn-hospital-outline">
              Save draft
            </button>
            <button type="submit" className="btn-hospital-primary">
              Publish / Schedule
            </button>
          </div>
        </form>
      </div>
      <div className="hospital-card">
        <h3>Alerts</h3>
        <div className="alert-feed">
          {announcements.map((alert) => (
            <div key={alert.id} className="alert-item">
              <strong>{alert.title}</strong>
              <span>{alert.description}</span>
              <small style={{ color: 'var(--hospital-muted)' }}>{alert.timestamp}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
