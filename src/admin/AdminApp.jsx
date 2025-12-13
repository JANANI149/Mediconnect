import { useState, useMemo, useEffect } from 'react';
import { auth, db } from '../../backend/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './admin.css';

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ICON_LIBRARY = {
  dashboard: (
    <svg {...iconProps}>
      <path d="M4 20v-6" />
      <path d="M10 20V4" />
      <path d="M16 20v-9" />
      <path d="M22 20H2" />
    </svg>
  ),
  hospitals: (
    <svg {...iconProps}>
      <path d="M5 20V8l7-4 7 4v12" />
      <path d="M9 20v-5h6v5" />
      <path d="M12 9v4" />
      <path d="M10 11h4" />
    </svg>
  ),
  doctors: (
    <svg {...iconProps}>
      <path d="M6 4v6a3 3 0 0 0 6 0V4" />
      <path d="M18 6v8a4 4 0 0 1-4 4h-1" />
      <path d="M8 20h4" />
      <circle cx="18" cy="18" r="2.25" />
    </svg>
  ),
  patients: (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" />
      <path d="M14 17a4 4 0 0 1 4-4 4 4 0 0 1 4 4" />
    </svg>
  ),
  reports: (
    <svg {...iconProps}>
      <path d="M4 17l5-5 4 4 7-11" />
      <path d="M15 5h5v5" />
    </svg>
  ),
  announcements: (
    <svg {...iconProps}>
      <path d="M3 11l10-5v12L3 13v-2z" />
      <path d="M13 13h5a3 3 0 0 0 0-6h-5" />
      <path d="M3 16a4 4 0 0 0 4 4h2" />
    </svg>
  ),
  notifications: (
    <svg {...iconProps}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  support: (
    <svg {...iconProps}>
      <path d="M4 4h16v9a4 4 0 0 1-4 4H9l-5 5V4z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  ),
  close: (
    <svg {...iconProps}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

const NAV_SECTIONS = [
  { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
  { id: 'hospitals', label: 'Hospitals', icon: 'hospitals' },
  { id: 'doctors', label: 'Doctors', icon: 'doctors' },
  { id: 'patients', label: 'Patients', icon: 'patients' },
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { id: 'announcements', label: 'Announcements', icon: 'announcements' },
];

const DEFAULT_HOSPITALS = [
  { id: 1, name: 'Sunrise Multispeciality', location: 'Bengaluru, KA', status: 'approved', doctors: 42, appointments: 380, services: ['Cardiology', 'Nephrology', 'Tele-ICU'] },
  { id: 2, name: 'Lotus Care Hospital', location: 'Chennai, TN', status: 'pending', doctors: 25, appointments: 210, services: ['Orthopedics', 'OB-GYN'] },
  { id: 3, name: 'Riverfront Health', location: 'Pune, MH', status: 'approved', doctors: 31, appointments: 287, services: ['Oncology', 'Pediatrics', 'Tele-OPD'] },
  { id: 4, name: 'Northern Plains Medical', location: 'Jaipur, RJ', status: 'rejected', doctors: 14, appointments: 98, services: ['General Medicine'] },
];

const DOCTORS = [
  { id: 101, name: 'Dr. Kavya R', hospital: 'Sunrise Multispeciality', specialization: 'Cardiologist', experience: '12 yrs', qualifications: 'MD, DM', appointments: 46 },
  { id: 102, name: 'Dr. Arjun Mehta', hospital: 'Riverfront Health', specialization: 'Oncologist', experience: '10 yrs', qualifications: 'MS, MCh', appointments: 32 },
  { id: 103, name: 'Dr. Sanjana Rao', hospital: 'Lotus Care Hospital', specialization: 'OB-GYN', experience: '8 yrs', qualifications: 'MS', appointments: 27 },
  { id: 104, name: 'Dr. Vijay Patel', hospital: 'Sunrise Multispeciality', specialization: 'Nephrologist', experience: '14 yrs', qualifications: 'MD, DM', appointments: 39 },
];

const PATIENTS = [
  { id: 201, name: 'Ananya Singh', age: 32, gender: 'Female', appointments: 9, lastVisit: '12 Dec 2025', chronic: 'Hypertension' },
  { id: 202, name: 'Rishi Gupta', age: 44, gender: 'Male', appointments: 5, lastVisit: '10 Dec 2025', chronic: 'Diabetes Type II' },
  { id: 203, name: 'Meera Thomas', age: 28, gender: 'Female', appointments: 3, lastVisit: '05 Dec 2025', chronic: 'Asthma' },
  { id: 204, name: 'Parth Menon', age: 65, gender: 'Male', appointments: 12, lastVisit: '01 Dec 2025', chronic: 'Cardiomyopathy' },
];

const REPORT_CARDS = [
  { title: 'Hospital Coverage', metric: '72%', detail: '18/25 target regions live' },
  { title: 'Doctor Utilization', metric: '84%', detail: 'Avg slots filled' },
  { title: 'Patient Retention', metric: '91%', detail: 'Rolling 3-month' },
];

const DEFAULT_ANNOUNCEMENTS = [
  { id: 'a-1', title: 'Tele-ICU launch briefing', target: 'Hospitals', schedule: null, createdAt: 'Today, 10:15 AM' },
  { id: 'a-2', title: 'Audit data freeze - Dec', target: 'All users', schedule: '20 Dec 2025', createdAt: 'Yesterday, 5:40 PM' },
  { id: 'a-3', title: 'Platform maintenance window', target: 'Doctors', schedule: '18 Dec 2025', createdAt: '08 Dec 2025' },
];

const EMPTY_HOSPITAL_FORM = {
  name: '',
  email: '',
  password: '',
  location: '',
  services: '',
};

const DASHBOARD_STATS = [
  { label: 'Hospitals', value: 132, trend: '+8.4%', direction: 'up' },
  { label: 'Doctors', value: 864, trend: '+4.2%', direction: 'up' },
  { label: 'Patients', value: '24.3K', trend: '+11.1%', direction: 'up' },
  { label: 'Pending Approvals', value: 9, trend: '-2.0%', direction: 'down' },
];

export default function AdminApp({ role = 'admin', adminName = 'Aarav Patel' }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', target: 'All users', schedule: '', message: '' });
  const [hospitalForm, setHospitalForm] = useState({ ...EMPTY_HOSPITAL_FORM });
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [hospitals, setHospitals] = useState(DEFAULT_HOSPITALS);
  const [hospitalStatus, setHospitalStatus] = useState({ loading: false, error: '' });
  const [hospitalSubmitStatus, setHospitalSubmitStatus] = useState({ loading: false, error: '', success: '' });
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authStatus, setAuthStatus] = useState({ checking: true, error: '' });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthStatus({
        checking: false,
        error: user ? '' : 'Please sign in with an admin account to sync live hospital data.',
      });
      if (!user) {
        setHospitalStatus({ loading: false, error: 'Sign in required to load hospitals from the database.' });
        setHospitals(DEFAULT_HOSPITALS);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return undefined;

    setHospitalStatus({ loading: true, error: '' });
    const hospitalsRef = collection(db, 'adminHospitals');
    const unsubscribe = onSnapshot(
      hospitalsRef,
      (snapshot) => {
        if (snapshot.empty) {
          setHospitals(DEFAULT_HOSPITALS);
        } else {
          const next = snapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data() || {};
            return {
              id: docSnapshot.id,
              name: data.name || 'Unnamed Hospital',
              email: data.email || '',
              location: data.location || 'Not specified',
              status: data.status || 'pending',
              doctors: data.doctors ?? 0,
              appointments: data.appointments ?? 0,
              tempPassword: data.tempPassword || '',
              services: Array.isArray(data.services)
                ? data.services
                : typeof data.services === 'string'
                  ? data.services.split(',').map((service) => service.trim()).filter(Boolean)
                  : [],
              createdAt: data.createdAt,
            };
          });
          setHospitals(next);
        }
        setHospitalStatus({ loading: false, error: '' });
      },
      (error) => {
        console.error('Failed to fetch hospitals', error);
        setHospitalStatus({ loading: false, error: 'Unable to sync hospitals right now. Showing cached data.' });
        setHospitals(DEFAULT_HOSPITALS);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const filteredHospitals = useMemo(
    () => hospitals.filter((hospital) => hospital.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [hospitals, searchTerm]
  );

  const filteredDoctors = useMemo(
    () => DOCTORS.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const filteredPatients = useMemo(
    () => PATIENTS.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const resetHospitalForm = () => {
    setHospitalForm({ ...EMPTY_HOSPITAL_FORM });
    setHospitalSubmitStatus({ loading: false, error: '', success: '' });
  };

  const closeHospitalModal = () => {
    setIsHospitalModalOpen(false);
    setEditingHospitalId(null);
    resetHospitalForm();
  };

  const openCreateHospitalModal = () => {
    setEditingHospitalId(null);
    resetHospitalForm();
    setIsHospitalModalOpen(true);
  };

  const handleEditHospital = (hospital) => {
    setEditingHospitalId(hospital.id);
    setHospitalForm({
      name: hospital.name || '',
      email: hospital.email || '',
      password: hospital.tempPassword || '',
      location: hospital.location || '',
      services: Array.isArray(hospital.services) ? hospital.services.join(', ') : hospital.services || '',
    });
    setHospitalSubmitStatus({ loading: false, error: '', success: '' });
    setIsHospitalModalOpen(true);
  };

  const isEditingHospital = Boolean(editingHospitalId);

  const handleAnnouncementSubmit = (event) => {
    event.preventDefault();
    if (!announcementForm.title.trim()) return;

    setAnnouncements((prev) => [
      {
        id: crypto.randomUUID(),
        title: announcementForm.title,
        target: announcementForm.target,
        schedule: announcementForm.schedule || null,
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    setAnnouncementForm({ title: '', target: 'All users', schedule: '', message: '' });
  };

  const handleHospitalSubmit = async (event) => {
    event.preventDefault();
    if (!hospitalForm.name.trim()) return;
    if (!currentUser) {
      setHospitalSubmitStatus({ loading: false, error: 'Sign in required before adding hospitals.', success: '' });
      return;
    }
    setHospitalSubmitStatus({ loading: true, error: '', success: '' });

    try {
      const normalizedServices = hospitalForm.services
        .split(',')
        .map((service) => service.trim())
        .filter(Boolean);

      if (editingHospitalId) {
        await updateDoc(doc(db, 'adminHospitals', editingHospitalId), {
          name: hospitalForm.name.trim(),
          email: hospitalForm.email.trim(),
          tempPassword: hospitalForm.password,
          location: hospitalForm.location.trim(),
          services: normalizedServices,
          updatedAt: serverTimestamp(),
        });

        setHospitalSubmitStatus({ loading: false, error: '', success: 'Hospital details updated.' });
      } else {
        // Create Firebase Auth user first
        let firebaseUser = null;
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            hospitalForm.email.trim(), 
            hospitalForm.password
          );
          firebaseUser = userCredential.user;
          console.log('Firebase Auth user created:', firebaseUser.email);
        } catch (authError) {
          console.error('Error creating Firebase Auth user:', authError);
          if (authError.code === 'auth/email-already-in-use') {
            console.log('Firebase Auth user already exists:', hospitalForm.email.trim());
          } else {
            // If we can't create the auth user, we shouldn't create the hospital record
            throw new Error(`Failed to create hospital account: ${authError.message}`);
          }
        }

        // Then store hospital data in Firestore
        await addDoc(collection(db, 'adminHospitals'), {
          name: hospitalForm.name.trim(),
          email: hospitalForm.email.trim(),
          tempPassword: hospitalForm.password,
          location: hospitalForm.location.trim(),
          services: normalizedServices,
          status: 'pending',
          doctors: 0,
          appointments: 0,
          createdAt: serverTimestamp(),
        });

        setHospitalSubmitStatus({ 
          loading: false, 
          error: '', 
          success: `Hospital "${hospitalForm.name.trim()}" added successfully! Login credentials created for ${hospitalForm.email.trim()}.` 
        });
      }

      resetHospitalForm();
      setEditingHospitalId(null);
      setIsHospitalModalOpen(false);
    } catch (error) {
      console.error('Failed to add hospital', error);
      setHospitalSubmitStatus({ loading: false, error: error.message || 'Something went wrong while saving. Try again.', success: '' });
    }
  };

  const handleExport = (format, scope) => {
    const summary = `[Mock Export] ${scope} exported as ${format.toUpperCase()} at ${new Date().toLocaleString()}`;
    alert(summary);
  };

  if (role !== 'admin') {
    return (
      <div className="admin-shell">
        <div className="access-denied">
          <h3>Access Restricted</h3>
          <p>This module is only available to platform administrators. Please contact your system owner for privileged access.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="admin-grid cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <div className="admin-card" key={stat.label}>
            <h3>{stat.label}</h3>
            <p className="stat-value">{stat.value}</p>
            <span className={`stat-trend ${stat.direction === 'up' ? 'trend-up' : 'trend-down'}`}>{stat.trend} vs last month</span>
          </div>
        ))}
      </div>

      <div className="admin-grid cols-2">
        <div className="admin-card">
          <h3>Patient Registrations</h3>
          <div className="chart-canvas">
            <div className="chart-grid" />
            <div className="chart-bars">
              {[45, 68, 54, 88, 72, 95, 80].map((height, idx) => (
                <div className="chart-bar" key={idx} style={{ height: `${height}%` }}>
                  <span>W{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3>Quick Actions</h3>
          <div className="quick-action">
            <div>
              <strong>Approve Sunrise Cancer Care</strong>
              <p className="admin-muted">Therapy center · Pune</p>
            </div>
            <div>
              <button className="admin-btn-approve">Approve</button>
              <button className="admin-btn-reject" style={{ marginLeft: '0.35rem' }}>
                Reject
              </button>
            </div>
          </div>
          <div className="quick-action">
            <div>
              <strong>Validate Radiology upload</strong>
              <p className="admin-muted">Dr. Arjun Mehta</p>
            </div>
            <button className="admin-btn-approve">Review Docs</button>
          </div>
          <div className="quick-action">
            <div>
              <strong>Pending telemedicine slots</strong>
              <p className="admin-muted">Lotus Care Hospital</p>
            </div>
            <button className="admin-btn-approve">Assign</button>
          </div>
        </div>
      </div>
    </>
  );

  const renderHospitalManagement = () => (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Hospitals</h3>
            <p className="admin-muted">Track all facilities, statuses, and approvals</p>
            {hospitalStatus.loading && <p className="admin-muted">Syncing latest hospital list…</p>}
            {hospitalStatus.error && <p className="admin-error">{hospitalStatus.error}</p>}
          </div>
          <button className="admin-btn-primary" type="button" onClick={openCreateHospitalModal}>
            + Add hospital
          </button>
        </div>
        <table className="entity-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Doctors</th>
              <th>Appointments</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td>{hospital.name}</td>
                <td>{hospital.location}</td>
                <td>
                  <span className={`status-pill status-${hospital.status}`}>{hospital.status}</span>
                </td>
                <td>{hospital.doctors}</td>
                <td>{hospital.appointments}</td>
                <td className="table-actions">
                  <button type="button" onClick={() => handleEditHospital(hospital)}>
                    Edit
                  </button>
                  <button type="button" disabled title="Coming soon">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-panel">
        <h4>Selected Hospital · Sunrise Multispeciality</h4>
        <div className="admin-grid cols-2">
          <div>
            <strong>Associated Doctors</strong>
            <p>42 active · 8 onboarding</p>
          </div>
          <div>
            <strong>Services</strong>
            <p>Cardiology · Nephrology · Tele-ICU</p>
          </div>
        </div>
        <ul className="timeline">
          <li>12 Dec · Tele-ICU wing onboarded</li>
          <li>08 Dec · 180 remote appointments completed</li>
          <li>04 Dec · Compliance audit passed</li>
        </ul>
      </div>

      {isHospitalModalOpen && (
        <div className="admin-modal-overlay" onClick={closeHospitalModal}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>{isEditingHospital ? 'Edit Hospital' : 'Register Hospital'}</h3>
                <p>{isEditingHospital ? 'Update credentials and facility profile' : 'Issue credentials for newly onboarded facilities'}</p>
              </div>
              <button className="admin-icon-button" onClick={closeHospitalModal} aria-label="Close">
                {ICON_LIBRARY.close}
              </button>
            </div>
            <form onSubmit={handleHospitalSubmit}>
          <div className="form-grid cols-2">
            <div>
              <label className="form-label" htmlFor="hospitalName">
                Hospital name
              </label>
              <input
                id="hospitalName"
                className="admin-input"
                value={hospitalForm.name}
                onChange={(event) => setHospitalForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Lotus Care Hospital"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="hospitalEmail">
                Email
              </label>
              <input
                id="hospitalEmail"
                type="email"
                className="admin-input"
                value={hospitalForm.email}
                onChange={(event) => setHospitalForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="ops@lotuscare.in"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="hospitalPassword">
                Temporary password
              </label>
              <input
                id="hospitalPassword"
                type="password"
                className="admin-input"
                value={hospitalForm.password}
                onChange={(event) => setHospitalForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Create secure passphrase"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="hospitalLocation">
                Location
              </label>
              <input
                id="hospitalLocation"
                className="admin-input"
                value={hospitalForm.location}
                onChange={(event) => setHospitalForm((prev) => ({ ...prev, location: event.target.value }))}
                placeholder="City, State"
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="hospitalServices">
              Services offered
            </label>
            <textarea
              id="hospitalServices"
              className="admin-textarea"
              value={hospitalForm.services}
              onChange={(event) => setHospitalForm((prev) => ({ ...prev, services: event.target.value }))}
              placeholder="Cardiology, Tele-ICU, Diagnostics"
            />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-outline" onClick={resetHospitalForm}>
              Reset
            </button>
            <button type="submit" className="admin-btn-primary" disabled={hospitalSubmitStatus.loading}>
              {hospitalSubmitStatus.loading ? 'Saving…' : isEditingHospital ? 'Save changes' : 'Add hospital'}
            </button>
          </div>
          {hospitalSubmitStatus.error && <p className="admin-error">{hospitalSubmitStatus.error}</p>}
          {hospitalSubmitStatus.success && <p className="admin-success">{hospitalSubmitStatus.success}</p>}
        </form>
          </div>
        </div>
      )}
    </>
  );

  const renderDoctorManagement = () => (
    <>
      <div className="admin-card">
        <h3>Doctors</h3>
        <table className="entity-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hospital</th>
              <th>Specialization</th>
              <th>Qualifications</th>
              <th>Appointments (7d)</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.hospital}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.qualifications}</td>
                <td>{doctor.appointments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-panel">
        <h4>Profile Snapshot · Dr. Kavya R</h4>
        <p>12 years of interventional cardiology. Handles high-acuity tele-consults and Cath lab handoffs.</p>
        <ul className="timeline">
          <li>Handled 18 critical escalations this month.</li>
          <li>Patient satisfaction · 4.9/5 · 320 ratings.</li>
          <li>Last credential verification · Oct 2025.</li>
        </ul>
      </div>
    </>
  );

  const renderPatientManagement = () => (
    <>
      <div className="admin-card">
        <h3>Patients</h3>
        <table className="entity-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Visits</th>
              <th>Last visit</th>
              <th>Chronic condition</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.appointments}</td>
                <td>{patient.lastVisit}</td>
                <td>{patient.chronic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-panel">
        <h4>Patient Journey · Ananya Singh</h4>
        <p>Care team: Sunrise Multispeciality Cardiology · Remote monitoring enabled · Medication adherence 96%.</p>
        <ul className="timeline">
          <li>12 Dec · Virtual follow-up · BP stabilized.</li>
          <li>30 Nov · New prescription synced to pharmacy partner.</li>
          <li>25 Nov · Lab panel uploaded by Sunrise diagnostics.</li>
        </ul>
      </div>
    </>
  );

  const renderReports = () => (
    <>
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Insights</h3>
          <div className="reports-grid">
            {REPORT_CARDS.map((report) => (
              <div key={report.title} className="announcement-card">
                <strong>{report.title}</strong>
                <p className="stat-value" style={{ fontSize: '1.6rem' }}>
                  {report.metric}
                </p>
                <p>{report.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-card">
        <h3>Export Center</h3>
        <p>Download CSV or PDF snapshots. Each export is audit-logged with your admin ID.</p>
        <div className="export-actions">
          <button onClick={() => handleExport('csv', 'Hospital statistics')}>Hospitals · CSV</button>
          <button onClick={() => handleExport('pdf', 'Hospital statistics')}>Hospitals · PDF</button>
          <button onClick={() => handleExport('csv', 'Doctor appointments')}>Doctors · CSV</button>
          <button onClick={() => handleExport('pdf', 'Doctor appointments')}>Doctors · PDF</button>
          <button onClick={() => handleExport('csv', 'Patient activity')}>Patients · CSV</button>
          <button onClick={() => handleExport('pdf', 'Patient activity')}>Patients · PDF</button>
        </div>
      </div>
    </>
  );

  const renderAnnouncements = () => (
    <>
      <div className="admin-card">
        <h3>Broadcast Center</h3>
        <form onSubmit={handleAnnouncementSubmit}>
          <div className="form-grid cols-2">
            <div>
              <label htmlFor="announcementTitle">Title</label>
              <input
                id="announcementTitle"
                className="admin-input"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Quarterly quality update"
              />
            </div>
            <div>
              <label htmlFor="announcementTarget">Target audience</label>
              <select
                id="announcementTarget"
                className="admin-select"
                value={announcementForm.target}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, target: e.target.value }))}
              >
                <option>All users</option>
                <option>Hospitals</option>
                <option>Doctors</option>
                <option>Patients</option>
              </select>
            </div>
          </div>
          <div className="form-grid cols-2" style={{ marginTop: '1rem' }}>
            <div>
              <label htmlFor="schedule">Schedule (optional)</label>
              <input
                id="schedule"
                type="datetime-local"
                className="admin-input"
                value={announcementForm.schedule}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, schedule: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="alertType">Alert Type</label>
              <select id="alertType" className="admin-select">
                <option>System alert</option>
                <option>Feature launch</option>
                <option>Compliance</option>
                <option>Engagement</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className="admin-textarea"
              value={announcementForm.message}
              onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Add release notes, SLA communication, or escalation guidance..."
            />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-outline">
              Save draft
            </button>
            <button type="submit" className="admin-btn-primary">
              Publish / Schedule
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3>Recent Announcements</h3>
        <div className="admin-grid">
          {announcements.map((announcement) => (
            <div className="announcement-card" key={announcement.id}>
              <div className="announcement-meta">
                <span>{announcement.createdAt}</span>
                <span className={`notification-pill ${announcement.schedule ? 'scheduled' : 'sent'}`}>
                  {announcement.schedule ? `Scheduled · ${announcement.schedule}` : 'Sent'}
                </span>
              </div>
              <strong>{announcement.title}</strong>
              <p>Audience: {announcement.target}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const sectionRenderers = {
    dashboard: renderDashboard,
    hospitals: renderHospitalManagement,
    doctors: renderDoctorManagement,
    patients: renderPatientManagement,
    reports: renderReports,
    announcements: renderAnnouncements,
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">MC</div>
          <h1>MediConnect Admin</h1>
        </div>
        <nav className="admin-nav">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              className={`admin-nav-button ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="admin-nav-icon">{ICON_LIBRARY[section.icon]}</span>
              {section.label}
            </button>
          ))}
        </nav>
        <div className="admin-role">
          <h2>Role</h2>
          <p>Platform Administrator</p>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2>{NAV_SECTIONS.find((section) => section.id === activeSection)?.label}</h2>
          <input
            className="admin-search"
            placeholder="Search hospitals, doctors, patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="admin-actions">
            <button className="admin-icon-button" title="Notifications">
              {ICON_LIBRARY.notifications}
            </button>
            <button className="admin-icon-button" title="Support">
              {ICON_LIBRARY.support}
            </button>
            <button className="admin-exit-button">Exit</button>
          </div>
        </div>

        <div className="admin-content">
          <header style={{ marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, color: 'var(--admin-muted)' }}>Signed in as</p>
            <h2 style={{ margin: '0.3rem 0 0 0' }}>{adminName}</h2>
            <p style={{ margin: '0.3rem 0 0 0', color: 'var(--admin-muted)' }}>
              Full control · Monitoring hospitals, doctors, and patients across India
            </p>
          </header>
          <div className="admin-grid">{sectionRenderers[activeSection]()}</div>
        </div>
      </main>
    </div>
  );
}
