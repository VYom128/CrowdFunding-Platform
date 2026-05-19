import Button from "../common/Button";
import Badge from "../common/Badge";

export default function CampaignerApprovalTable({ rows = [], onApprove, onReject }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-bark/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-bark/60">
            <tr>
              <th className="px-5 py-4">Applicant</th>
              <th className="px-5 py-4">Campaigner Type</th>
              <th className="px-5 py-4">Public Display Name</th>
              <th className="px-5 py-4">Reason</th>
              <th className="px-5 py-4">Verification Document</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id || row.id} className="border-t border-bark/5">
                <td className="px-5 py-4">
                  <div className="font-bold text-ink">{row.userId?.name || "Unknown"}</div>
                  <div className="text-xs text-bark/65">{row.userId?.email || "No email"}</div>
                </td>
                <td className="px-5 py-4 text-bark/80">{row.campaignerType}</td>
                <td className="px-5 py-4 font-bold text-ink">{row.publicDisplayName}</td>
                <td className="px-5 py-4 text-bark/65 max-w-xs truncate" title={row.campaignerReason}>
                  {row.campaignerReason}
                </td>
                <td className="px-5 py-4">
                  <a
                    href={row.verificationDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-moss underline hover:text-sage"
                  >
                    View Document
                  </a>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="teal">{row.status || "pending"}</Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => onApprove?.(row._id || row.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="urgent" onClick={() => onReject?.(row._id || row.id)}>
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-bark/60">
                  No campaigner requests pending right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
