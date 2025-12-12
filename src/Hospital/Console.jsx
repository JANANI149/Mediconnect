import { useMemo, useState } from 'react';
import './console.css';

const hospitalProfile = {
  name: 'MediConnect General Hospital',
  location: '247 Healthway Ave, Seattle, WA',
  contact: '+1 (425) 555-0192',
  email: 'hello@mediconnect.health',
  services: ['Emergency', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Telehealth'],
  hours: 'Open 24/7',
  rating: 4.7,
  ratingCount: 1264,
  logo: 'https://img.freepik.com/free-vector/hospital-logo-design-vector_23-2149519244.jpg',
};

const doctorDirectory = [
  {
    id: 'd1',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiology',
    experience: '12 yrs',
    status: 'Active',
    workingHours: '9:00 AM - 5:00 PM',
    next: '2 appts today',
  },
  {
    id: 'd2',
    name: 'Dr. James Lee',
    specialization: 'Orthopedics',
    experience: '9 yrs',
    status: 'On Leave',
    workingHours: '10:00 AM - 6:00 PM',
    next: 'Back tomorrow',
  },
  {
    id: 'd3',
    name: 'Dr. Aisha Khan',
    specialization: 'Pediatrics',
    experience: '7 yrs',
    status: 'Active',
    workingHours: '8:00 AM - 2:00 PM',
    next: '3 appts today',
  },
  {
    id: 'd4',
    name: 'Dr. Mateo Garcia',
    specialization: 'Dermatology',
    experience: '6 yrs',
    status: 'Active',
    workingHours: '11:00 AM - 7:00 PM',
    next: '1 appt today',
  },
];

const appointmentData = [
  {
    id: 'a1',
    patient: 'Sarah Chen',
    doctorId: 'd1',
    start: '2025-02-10T09:30:00',
    end: '2025-02-10T10:00:00',
    status: 'Booked',
    reason: 'Follow-up | Cardio',
  },
  {
    id: 'a2',
    patient: 'Liam Smith',
    doctorId: 'd3',
    start: '2025-02-10T10:30:00',
    end: '2025-02-10T11:00:00',
    status: 'Booked',
    reason: 'Vaccination consult',
  },
  {
    id: 'a3',
    patient: 'Emily Davis',
    doctorId: 'd4',
    start: '2025-02-10T11:30:00',
    end: '2025-02-10T12:00:00',
    status: 'Completed',
    reason: 'Skin rash',
  },
  {
    id: 'a4',
    patient: 'Michael Brown',
    doctorId: 'd2',
    start: '2025-02-10T15:00:00',
    end: '2025-02-10T15:30:00',
    status: 'Cancelled',
    reason: 'Knee pain',
  },
];

const notificationFeed = [
  {
    id: 'n1',
    type: 'booking',
    title: 'New booking created',
    body: 'Sarah Chen booked with Dr. Priya Sharma for 9:30 AM.',
    time: '5m ago',
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Reminder sent',
    body: '2 reminders sent for appointments starting in the next hour.',
    time: '18m ago',
  },
  {
    id: 'n3',
    type: 'announcement',
    title: 'Announcement',
    body: 'MRI suite maintenance tonight 8 PM - 11 PM.',
    time: '1h ago',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Low availability',
    body: 'Orthopedics has only 1 slot left today. Consider adding coverage.',
    time: '2h ago',
  },
];

const statusClass = {
  Booked: 'pill pill-booked',
  Completed: 'pill pill-completed',
  Cancelled: 'pill pill-cancelled',
  'On Leave': 'pill pill-warning',
  Active: 'pill pill-active',
};

const formatTimeRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
};

export default function Console({ onExit }) {
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorQuery, setDoctorQuery] = useState('');

  const doctorMap = useMemo(
    () => Object.fromEntries(doctorDirectory.map((doc) => [doc.id, doc])),
    [],
  );

  const filteredDoctors = useMemo(() => {
    const query = doctorQuery.toLowerCase();
    return doctorDirectory.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query),
    );
  }, [doctorQuery]);

  const filteredAppointments = useMemo(() => {
    return appointmentData.filter((appt) => {
      const matchesDoctor = doctorFilter === 'all' || appt.doctorId === doctorFilter;
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchesDoctor && matchesStatus;
    });
  }, [doctorFilter, statusFilter]);

  const kpis = [
    {
      label: 'Appointments today',
      value: `${appointmentData.filter((a) => a.status === 'Booked').length}`,
      detail: 'Booked & upcoming',
    },
    {
      label: 'Doctors active',
      value: `${doctorDirectory.filter((d) => d.status === 'Active').length}`,
      detail: 'On duty now',
    },
    {
      label: 'Completed',
      value: `${appointmentData.filter((a) => a.status === 'Completed').length}`,
      detail: 'Marked done',
    },
    {
      label: 'Alerts',
      value: `${notificationFeed.length}`,
      detail: 'Unread notifications',
    },
  ];

  return (
    <div className="console-shell">
      <header className="console-topbar">
        <div className="console-brand">
          <img src={hospitalProfile.logo} alt="" className="console-logo" />
          <div>
            <div className="brand-name">{hospitalProfile.name}</div>
            <div className="brand-meta">{hospitalProfile.location}</div>
          </div>
        </div>
        <div className="console-actions">
          <button className="ghost" onClick={onExit}>
            ← Back to landing
          </button>
          <button className="outline">Send announcement</button>
          <button className="primary">New appointment</button>
        </div>
      </header>

      <main className="console-content">
        <section className="kpi-grid">
          {kpis.map((kpi) => (
            <div className="kpi-card" key={kpi.label}>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-detail">{kpi.detail}</div>
            </div>
          ))}
        </section>

        <section className="module-grid two">
          <div className="module-card">
            <div className="module-header">
              <div>
                <p className="eyebrow">Hospital Profile</p>
                <h3>Institution overview</h3>
              </div>
              <button className="ghost-sm">Edit</button>
            </div>
            <div className="profile-grid">
              <div>
                <p className="label">Location</p>
                <p className="value">{hospitalProfile.location}</p>
              </div>
              <div>
                <p className="label">Contact</p>
                <p className="value">{hospitalProfile.contact}</p>
                <p className="muted">{hospitalProfile.email}</p>
              </div>
              <div>
                <p className="label">Services</p>
                <div className="chips">
                  {hospitalProfile.services.map((service) => (
                    <span className="chip" key={service}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Hours</p>
                <p className="value">{hospitalProfile.hours}</p>
                <p className="label">Rating</p>
                <p className="value">
                  {hospitalProfile.rating} ⭐ ({hospitalProfile.ratingCount})
                </p>
              </div>
            </div>
          </div>

          <div className="module-card">
            <div className="module-header">
              <div>
                <p className="eyebrow">Notifications</p>
                <h3>Alerts & announcements</h3>
              </div>
              <button className="ghost-sm">Mark all read</button>
            </div>
            <div className="notification-list">
              {notificationFeed.map((note) => (
                <div className="notification-row" key={note.id}>
                  <span className={`badge badge-${note.type}`}>{note.type}</span>
                  <div className="notification-body">
                    <p className="note-title">{note.title}</p>
                    <p className="note-text">{note.body}</p>
                  </div>
                  <span className="note-time">{note.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="module-card">
          <div className="module-header">
            <div>
              <p className="eyebrow">Doctor Management</p>
              <h3>Roster & availability</h3>
            </div>
            <div className="module-actions">
              <input
                type="search"
                placeholder="Search doctor or specialization"
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
              />
              <button className="outline">Add doctor</button>
            </div>
          </div>

          <div className="doctor-table">
            <div className="table-head">
              <div>Name</div>
              <div>Specialization</div>
              <div>Experience</div>
              <div>Status</div>
              <div>Working hours</div>
              <div>Next</div>
            </div>
            {filteredDoctors.map((doc) => (
              <div className="table-row" key={doc.id}>
                <div>
                  <div className="value">{doc.name}</div>
                </div>
                <div>{doc.specialization}</div>
                <div>{doc.experience}</div>
                <div>
                  <span className={statusClass[doc.status]}>{doc.status}</span>
                </div>
                <div>{doc.workingHours}</div>
                <div className="muted">{doc.next}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="module-card">
          <div className="module-header">
            <div>
              <p className="eyebrow">Appointment Management</p>
              <h3>Today&apos;s schedule</h3>
            </div>
            <div className="module-actions">
              <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
                <option value="all">All doctors</option>
                {doctorDirectory.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="Booked">Booked</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button className="primary">Create appointment</button>
            </div>
          </div>

          <div className="appointment-table">
            <div className="table-head">
              <div>Patient</div>
              <div>Doctor</div>
              <div>Time</div>
              <div>Status</div>
              <div>Reason</div>
            </div>
            {filteredAppointments.map((appt) => (
              <div className="table-row" key={appt.id}>
                <div className="value">{appt.patient}</div>
                <div>{doctorMap[appt.doctorId]?.name}</div>
                <div>{formatTimeRange(appt.start, appt.end)}</div>
                <div>
                  <span className={statusClass[appt.status]}>{appt.status}</span>
                </div>
                <div className="muted">{appt.reason}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

