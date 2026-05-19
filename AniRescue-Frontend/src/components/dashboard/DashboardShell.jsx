import { useAuthStore } from "../../store/authStore";

export default function DashboardShell({ title, subtitle, actions, children }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">AniRescue Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-bark/70">{subtitle}</p>}
        </div>
        {actions}
      </div>

      {user && (
        <div className="mb-8 flex items-center gap-4 rounded-3xl border border-bark/10 bg-white p-5 shadow-soft">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-moss text-xl font-extrabold text-white">
            {(user.name || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-ink">{user.name || "User"}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-bark/70">
              <span>{user.email}</span>
              <span className="h-1 w-1 rounded-full bg-bark/30"></span>
              <span className="rounded-md bg-sage/60 px-2 py-0.5 font-semibold capitalize text-moss">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
