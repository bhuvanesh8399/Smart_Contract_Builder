const stats = [
  { label: "Total Contracts", value: "12" },
  { label: "Draft Contracts", value: "4" },
  { label: "High Risk Alerts", value: "2" },
  { label: "Protected Deals", value: "8" },
];

const recentContracts = [
  { title: "Website Development Agreement", status: "Draft", risk: "Medium" },
  { title: "Logo Design Contract", status: "Completed", risk: "Low" },
  { title: "Content Writing Agreement", status: "Review", risk: "High" },
];

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Core Product Dashboard</span>
          <h1>Smart Contract Builder with Risk Detection</h1>
          <p>
            Create professional agreements, identify risky clauses, and improve
            contract clarity before you send anything to a client.
          </p>
        </div>
        <button className="button primary">Create New Contract</button>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card lift-card">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </div>
        ))}
      </section>

      <section className="content-grid two-col">
        <div className="card">
          <div className="section-head">
            <h3>Recent Contracts</h3>
            <span className="muted">Latest activity</span>
          </div>

          <div className="list-stack">
            {recentContracts.map((contract) => (
              <div key={contract.title} className="list-row">
                <div>
                  <h4>{contract.title}</h4>
                  <p className="muted">
                    Status: {contract.status} {"•"} Risk: {contract.risk}
                  </p>
                </div>
                <button className="button ghost">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <h3>Why this project matters</h3>
          </div>

          <ul className="feature-list">
            <li>Protect freelancers from unclear agreements</li>
            <li>Detect missing payment and ownership clauses</li>
            <li>Reduce scope creep and dispute risk</li>
            <li>Generate cleaner and more professional contracts</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
