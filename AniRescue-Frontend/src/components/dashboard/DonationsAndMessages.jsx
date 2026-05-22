import { MessageSquare, Heart } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";

export default function DonationsAndMessages({ donations = [] }) {
  if (!donations.length) {
    return (
      <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
        <h3 className="mb-4 text-lg font-extrabold text-ink">Donations & Messages</h3>
        <p className="text-sm text-bark/60">No donations found yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-extrabold text-ink">Donations & Messages</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {donations.map((donation) => (
          <div key={donation._id || donation.id} className="flex flex-col justify-between gap-3 rounded-3xl bg-cream p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-coral shadow-sm">
                  <Heart size={18} fill="currentColor" />
                </span>
                <div>
                  <p className="font-extrabold text-ink">
                    {donation.isAnonymous ? "Anonymous donor" : donation.donor?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-bark/55">{formatDate(donation.createdAt)}</p>
                </div>
              </div>
              <p className="text-lg font-extrabold text-moss">{formatCurrency(donation.amount)}</p>
            </div>
            
            <div className="mt-1">
              <Badge variant="teal" className="text-xs font-semibold">
                Campaign: {donation.campaign?.title || "Unknown campaign"}
              </Badge>
            </div>

            {donation.message && (
              <div className="mt-2 flex gap-2 rounded-2xl bg-white/60 p-3 text-sm italic text-bark/80">
                <MessageSquare size={16} className="mt-0.5 shrink-0 text-sage/80" />
                <p>"{donation.message}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
