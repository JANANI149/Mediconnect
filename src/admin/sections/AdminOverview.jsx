export default function AdminOverview({ stats, chartData, quickActions }) {
  return (
    <>
      <div className="admin-grid cols-4">
        {stats.map((stat) => (
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
              {chartData.map((height, idx) => (
                <div className="chart-bar" key={idx} style={{ height: `${height}%` }}>
                  <span>W{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3>Quick Actions</h3>
          {quickActions.map((action) => (
            <div className="quick-action" key={action.title}>
              <div>
                <strong>{action.title}</strong>
                <p className="admin-muted">{action.subtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {action.buttons.map((btn) => (
                  <button key={btn.label} className={btn.variant === 'danger' ? 'admin-btn-reject' : 'admin-btn-approve'}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
