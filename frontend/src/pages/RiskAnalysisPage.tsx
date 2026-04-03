const risks = [
  "No advance payment is defined",
  "Revision count is not limited",
  "Ownership transfer timing is unclear",
  "Cancellation clause is missing",
];

export default function RiskAnalysisPage() {
  return (
    <div className="page-stack">
      <section className="content-grid two-col">
        <div className="card risk-card">
          <span className="eyebrow">Smart Protection Engine</span>
          <h2>Contract Risk Score</h2>
          <div className="risk-gauge">
            <div className="risk-circle">
              <span>72</span>
              <small>Medium Risk</small>
            </div>
          </div>
          <p className="muted">
            This agreement is usable, but it still has missing protection areas
            that may increase dispute risk.
          </p>
        </div>

        <div className="card accent-card">
          <h3>Detected Issues</h3>
          <ul className="feature-list">
            {risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h3>Recommended Fixes</h3>
        </div>
        <ul className="feature-list">
          <li>Add 30% or 50% advance payment before project start</li>
          <li>Limit revisions to a fixed number</li>
          <li>Define ownership transfer only after full payment</li>
          <li>Add a cancellation and termination section</li>
        </ul>
      </section>
    </div>
  );
}
