import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BarChart3, HeartHandshake, IndianRupee, ShieldCheck, Users } from "lucide-react";
import {
  approveCampaign,
  approveCampaigner,
  getAdminStats,
  getCampaignerRequests,
  getPendingCampaigns,
  getUsers,
  markCampaignUrgent,
  rejectCampaign,
  rejectCampaigner,
  updateUserRole,
} from "../api/adminApi";
import AdminTabs from "../components/admin/AdminTabs";
import ApprovalTable from "../components/admin/ApprovalTable";
import CampaignerApprovalTable from "../components/admin/CampaignerApprovalTable";
import CampaignPreviewModal from "../components/admin/CampaignPreviewModal";
import UserTable from "../components/admin/UserTable";
import Button from "../components/common/Button";
import DashboardShell from "../components/dashboard/DashboardShell";
import StatCard from "../components/dashboard/StatCard";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import DonationsAndMessages from "../components/dashboard/DonationsAndMessages";
import { formatCurrency } from "../utils/formatCurrency";
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "campaigners", label: "Campaigner requests" },
  { id: "campaigns", label: "Campaign approvals" },
  { id: "users", label: "Users" },
  { id: "analytics", label: "Analytics" },
];

function useAdminAction(mutationFn, success) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(success);
      queryClient.invalidateQueries();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Admin action failed"),
  });
}

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [preview, setPreview] = useState(null);
  const statsQuery = useQuery({ queryKey: ["admin-stats"], queryFn: getAdminStats, retry: false });
  const requestsQuery = useQuery({ queryKey: ["campaigner-requests"], queryFn: getCampaignerRequests, retry: false, select: (data) => data.requests || data || [] });
  const pendingQuery = useQuery({ queryKey: ["pending-campaigns"], queryFn: getPendingCampaigns, retry: false, select: (data) => data.campaigns || data || [] });
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: getUsers, retry: false, select: (data) => data.users || data || [] });
  const stats = statsQuery.data?.stats || statsQuery.data || {};
  const pendingCampaigns = pendingQuery.data || [];

  const approveCampaignerMutation = useAdminAction(approveCampaigner, "Campaigner approved");
  const rejectCampaignerMutation = useAdminAction(rejectCampaigner, "Campaigner rejected");
  const approveCampaignMutation = useAdminAction(approveCampaign, "Campaign approved");
  const rejectCampaignMutation = useAdminAction(rejectCampaign, "Campaign rejected");
  const urgentMutation = useAdminAction(({ id, urgencyLevel }) => markCampaignUrgent(id, urgencyLevel), "Campaign urgency updated");
  const roleMutation = useAdminAction(({ id, role }) => updateUserRole(id, role), "User role updated");

  return (
    <DashboardShell title="Admin command center" subtitle="Approve verified campaigners, review rescue campaigns, manage users, and track platform health.">
      <AdminTabs active={active} setActive={setActive} tabs={tabs} />

      {active === "overview" && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-5">
            <StatCard icon={Users} label="Total users" value={stats.totalUsers?.toLocaleString?.() || 0} />
            <StatCard icon={ShieldCheck} label="Campaigns" value={stats.totalCampaigns || 0} tone="teal" />
            <StatCard icon={HeartHandshake} label="Donations" value={stats.totalDonations?.toLocaleString?.() || 0} />
            <StatCard icon={IndianRupee} label="Funds raised" value={formatCurrency(stats.totalFundsRaised)} />
            <StatCard icon={BarChart3} label="Pending" value={stats.pendingApprovals || 0} tone="coral" />
          </div>
          <AnalyticsChart title="Donation trends" />
          <DonationsAndMessages donations={stats.recentDonations || []} />
        </div>
      )}

      {active === "campaigners" && (
        <div className="mt-8">
          <CampaignerApprovalTable
            rows={requestsQuery.data || []}
            onApprove={(id) => approveCampaignerMutation.mutate(id)}
            onReject={(id) => rejectCampaignerMutation.mutate(id)}
          />
        </div>
      )}

      {active === "campaigns" && (
        <div className="mt-8 space-y-4">
          <ApprovalTable
            rows={pendingCampaigns}
            onPreview={setPreview}
            onApprove={(id) => approveCampaignMutation.mutate(id)}
            onReject={(id) => rejectCampaignMutation.mutate(id)}
          />
          <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
            <h3 className="mb-3 text-lg font-extrabold text-ink">Urgency controls</h3>
            <div className="flex flex-wrap gap-2">
              {pendingCampaigns.map((campaign) => (
                <Button key={campaign._id || campaign.id} variant="urgent" size="sm" onClick={() => urgentMutation.mutate({ id: campaign._id || campaign.id, urgencyLevel: "urgent" })}>
                  Mark {campaign.title.slice(0, 18)} urgent
                </Button>
              ))}
            </div>
          </div>
          <CampaignPreviewModal campaign={preview} open={Boolean(preview)} onClose={() => setPreview(null)} />
        </div>
      )}

      {active === "users" && (
        <div className="mt-8">
          <UserTable users={usersQuery.data || []} onRoleChange={(id, role) => roleMutation.mutate({ id, role })} />
        </div>
      )}

      {active === "analytics" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AnalyticsChart title="Campaign growth" />
          <AnalyticsChart title="Category distribution" type="bar" />
          <AnalyticsChart title="Urgency distribution" type="bar" />
          <AnalyticsChart title="Donor growth" />
        </div>
      )}
    </DashboardShell>
  );
}
