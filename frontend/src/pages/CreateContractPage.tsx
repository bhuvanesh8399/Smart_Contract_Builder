const steps = [
  "Project Info",
  "Client Info",
  "Payment Terms",
  "Timeline",
  "Revisions",
  "Ownership",
  "Review",
];

export default function CreateContractPage() {
  return (
    <div className="page-stack">
      <div className="card">
        <div className="section-head">
          <div>
            <span className="eyebrow">Hero Module</span>
            <h2>Create Contract Wizard</h2>
          </div>
          <button className="button primary">Save Draft</button>
        </div>

        <div className="stepper-row">
          {steps.map((step, index) => (
            <div key={step} className={`step-pill ${index === 0 ? "active" : ""}`}>
              {index + 1}. {step}
            </div>
          ))}
        </div>
      </div>

      <div className="content-grid two-col">
        <div className="card">
          <h3>Step 1 - Project Information</h3>
          <div className="form-grid">
            <label>
              <span>Project Title</span>
              <input type="text" placeholder="Website Development Agreement" />
            </label>
            <label>
              <span>Freelancer Role</span>
              <select>
                <option>Web Developer</option>
                <option>Designer</option>
                <option>Writer</option>
                <option>Consultant</option>
              </select>
            </label>
            <label className="full-width">
              <span>Project Scope</span>
              <textarea placeholder="Describe deliverables and responsibilities" rows={6} />
            </label>
          </div>
        </div>

        <div className="card accent-card">
          <h3>Smart Suggestions</h3>
          <ul className="feature-list">
            <li>Add a milestone-based payment schedule</li>
            <li>Define revision limits to avoid scope creep</li>
            <li>Clarify ownership transfer after final payment</li>
            <li>Include late feedback and delay handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
