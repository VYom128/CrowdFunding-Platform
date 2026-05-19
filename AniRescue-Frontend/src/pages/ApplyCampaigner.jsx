import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { applyCampaigner } from "../api/campaignerApi";
import DashboardShell from "../components/dashboard/DashboardShell";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import Select from "../components/common/Select";
import { useAuthStore } from "../store/authStore";

export default function ApplyCampaigner() {
  const user = useAuthStore((state) => state.user);
  const [values, setValues] = useState({
    campaignerType: "Individual",
    publicDisplayName: "",
    campaignerReason: "",
  });
  const [file, setFile] = useState(null);

  const mutation = useMutation({
    mutationFn: applyCampaigner,
    onSuccess: () => toast.success("Campaigner application submitted successfully."),
    onError: (error) => toast.error(error.response?.data?.message || "Application could not be submitted"),
  });

  const submit = (event) => {
    event.preventDefault();
    if (!file) {
      return toast.error("Verification document is required");
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    formData.append("verificationDocument", file);
    mutation.mutate(formData);
  };

  return (
    <DashboardShell title="Apply as campaigner" subtitle="Share verification details so admins can approve rescue campaign creation.">
      <form onSubmit={submit} className="grid max-w-3xl gap-6 rounded-[2rem] border border-bark/10 bg-white p-6 shadow-soft sm:p-8">
        
        {/* Read-only profile context */}
        <div className="rounded-2xl bg-cream p-4">
          <p className="text-sm font-semibold text-bark">Applying as</p>
          <p className="mt-1 font-extrabold text-ink">{user?.name}</p>
          <p className="text-sm text-bark/70">{user?.email}</p>
        </div>

        <Select
          label="Campaigner Type"
          value={values.campaignerType}
          onChange={(event) => setValues({ ...values, campaignerType: event.target.value })}
          required
        >
          <option value="Individual">Individual</option>
          <option value="NGO/Nonprofit">NGO/Nonprofit</option>
          <option value="Company">Company</option>
          <option value="School/College">School/College</option>
          <option value="Community Group">Community Group</option>
          <option value="Other">Other</option>
        </Select>

        <div>
          <Input
            label="Organization / Public Display Name"
            value={values.publicDisplayName}
            onChange={(event) => setValues({ ...values, publicDisplayName: event.target.value })}
            required
          />
          <p className="mt-1 text-xs text-bark/60">This name will be shown publicly to donors. If you are applying as an individual, you can use your own name.</p>
        </div>

        <div>
          <Textarea
            label="Reason for Becoming a Campaigner"
            value={values.campaignerReason}
            onChange={(event) => setValues({ ...values, campaignerReason: event.target.value })}
            required
          />
          <p className="mt-1 text-xs text-bark/60">Briefly explain who you are, what causes you want to raise funds for, and why donors should trust you.</p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-bark">Verification Document</span>
          <input
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={(event) => setFile(event.target.files?.[0])}
            className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm"
            required
          />
          <div className="mt-2 text-xs leading-relaxed text-bark/60">
            <p>Please upload a valid document to verify that you are a genuine and authorized campaigner.</p>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li><strong>Individual:</strong> Upload a government-issued ID (Aadhaar, PAN, passport, voter ID, driving license). Name must match your registered account.</li>
              <li><strong>Organization:</strong> Upload an organization registration certificate, trust deed, or authorization letter showing official seal or signature.</li>
            </ul>
          </div>
        </label>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit application"}
        </Button>
      </form>
    </DashboardShell>
  );
}
