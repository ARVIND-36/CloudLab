const statusClasses = {
  running: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20',
  creating: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20',
  failed: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20',
  deleting: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/20',
};

export function LabCard({ lab, onDelete, deleting = false }) {
  return (
    <article className="glass-panel flex h-full flex-col rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{lab.lab_type} lab</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{lab.deployment_name}</h3>
        </div>
        <span className={`status-pill ${statusClasses[lab.status] ?? statusClasses.running}`}>{lab.status}</span>
      </div>

      <dl className="mt-4 grid gap-4 text-sm text-slate-300">
        <div>
          <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Namespace</dt>
          <dd className="mt-1 font-mono text-slate-100">{lab.namespace}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Access URL</dt>
          <dd className="mt-1 break-all font-mono text-slate-100">{lab.access_url}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Created</dt>
          <dd className="mt-1 text-slate-100">{new Date(lab.created_at).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
          {lab.service_name}
        </span>
        <button type="button" className="secondary-button px-4 py-2 text-xs" onClick={() => onDelete(lab)} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Lab'}
        </button>
      </div>
    </article>
  );
}