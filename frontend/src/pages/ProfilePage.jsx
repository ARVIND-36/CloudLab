import { useAuth } from '../hooks/useAuth.js';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-panel rounded-[2rem] p-8">
        <p className="field-label">Profile</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Your account details</h2>
        <p className="mt-3 text-slate-300">JWT-protected identity used to scope namespaces and lab records.</p>

        <dl className="mt-8 space-y-6 text-sm text-slate-300">
          <div>
            <dt className="field-label">Name</dt>
            <dd className="mt-2 text-lg text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="field-label">Email</dt>
            <dd className="mt-2 text-lg text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="field-label">User ID</dt>
            <dd className="mt-2 font-mono text-white">{user?.id}</dd>
          </div>
        </dl>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="field-label">Guidance</p>
        <h3 className="mt-4 text-2xl font-semibold text-white">Operational flow</h3>
        <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
          <li>Register or log in to receive a signed JWT.</li>
          <li>Create a Docker or Terraform lab from the dashboard.</li>
          <li>The backend provisions an isolated namespace and stores the lab metadata in PostgreSQL.</li>
          <li>Delete a lab to remove the namespace and its Kubernetes resources.</li>
        </ul>
      </section>
    </div>
  );
}