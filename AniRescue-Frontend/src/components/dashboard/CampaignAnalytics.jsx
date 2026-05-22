import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Heart, IndianRupee, Target, Users } from "lucide-react";
import Select from "../common/Select";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateProgress } from "../../utils/calculateProgress";

const COLORS = ["#49705b", "#eadccb"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-2xl border border-bark/10 bg-white px-4 py-3 shadow-soft">
      <p className="text-sm font-bold text-ink">{name}</p>
      <p className="text-sm text-bark/70">{formatCurrency(value)}</p>
    </div>
  );
}

export default function CampaignAnalytics({ campaigns = [] }) {
  const [selectedId, setSelectedId] = useState(campaigns[0]?._id || campaigns[0]?.id || "");

  const campaign = campaigns.find((c) => (c._id || c.id) === selectedId) || campaigns[0];

  if (!campaigns.length) {
    return (
      <div className="rounded-[1.75rem] border border-bark/10 bg-white p-6 shadow-card">
        <h3 className="text-lg font-extrabold text-ink">Campaign analytics</h3>
        <p className="mt-4 text-sm text-bark/50">No campaigns yet. Create one to see analytics.</p>
      </div>
    );
  }

  const raised = campaign?.raisedAmount || campaign?.raised || 0;
  const goal = campaign?.goalAmount || campaign?.goal || 1;
  const remaining = Math.max(0, goal - raised);
  const progress = calculateProgress(raised, goal);
  const donorCount = campaign?.donationCount || campaign?.donorsCount || 0;

  const pieData = [
    { name: "Funds Raised", value: raised },
    { name: "Remaining", value: remaining },
  ];

  // If both are 0, show a placeholder pie
  const hasData = raised > 0 || remaining > 0;

  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-lg font-extrabold text-ink">Campaign analytics</h3>
        <div className="w-full sm:w-64">
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {campaigns.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <div className="h-64 w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hasData ? pieData : [{ name: "No data", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={hasData ? 4 : 0}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {hasData ? (
                    pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))
                  ) : (
                    <Cell fill="#eadccb" />
                  )}
                </Pie>
                {hasData && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-2 flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-moss" />
              <span className="text-xs font-semibold text-bark/70">Raised</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#eadccb]" />
              <span className="text-xs font-semibold text-bark/70">Remaining</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-cream p-4">
            <IndianRupee className="mb-2 text-moss" size={20} />
            <p className="text-xl font-extrabold text-ink">{formatCurrency(raised)}</p>
            <p className="text-xs font-semibold text-bark/55">Funds raised</p>
          </div>
          <div className="rounded-2xl bg-sage p-4">
            <Target className="mb-2 text-moss" size={20} />
            <p className="text-xl font-extrabold text-ink">{formatCurrency(remaining)}</p>
            <p className="text-xs font-semibold text-bark/55">Still needed</p>
          </div>
          <div className="rounded-2xl bg-cream p-4">
            <Users className="mb-2 text-teal-600" size={20} />
            <p className="text-xl font-extrabold text-ink">{donorCount}</p>
            <p className="text-xs font-semibold text-bark/55">Donors</p>
          </div>
          <div className="rounded-2xl bg-sage p-4">
            <Heart className="mb-2 text-coral" size={20} />
            <p className="text-xl font-extrabold text-ink">{progress}%</p>
            <p className="text-xs font-semibold text-bark/55">Funded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
