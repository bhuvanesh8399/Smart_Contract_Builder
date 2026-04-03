const contracts = [
  { title: "Mobile App UI Contract", status: "Draft", updated: "Today" },
  { title: "Brand Identity Agreement", status: "Completed", updated: "Yesterday" },
  { title: "SEO Consulting Contract", status: "Review", updated: "2 days ago" },
];

export default function MyContractsPage() {
  return (
    <div className="page-stack">
      <div className="card">
        <div className="section-head">
          <div>
            <span className="eyebrow">Contract Management</span>
            <h2>My Contracts</h2>
          </div>
          <button className="button primary">Create New</button>
        </div>

        <div className="list-stack">
          {contracts.map((contract) => (
            <div key={contract.title} className="list-row">
              <div>
                <h4>{contract.title}</h4>
                <p className="muted">
                  Status: {contract.status} {"•"} Updated: {contract.updated}
                </p>
              </div>
              <div className="row-actions">
                <button className="button ghost">Edit</button>
                <button className="button ghost">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
