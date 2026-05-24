import { useEffect, useMemo, useState } from 'react';
import { LabCard } from '../components/LabCard.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { createLab, deleteLab, getLabs } from '../services/labService.js';

export function DashboardPage() {
  const { user, token } = useAuth();
  const [labs, setLabs] = useState([]);
  const [selectedType, setSelectedType] = useState('docker');
  const [creating, setCreating] = useState(false);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [message, setMessage] = useState('');
  const [activeDeleteId, setActiveDeleteId] = useState('');

  const stats = useMemo(
    () => [
      { label: 'Active labs', value: labs.length.toString() },
      { label: 'Preferred type', value: selectedType },
      { label: 'Student', value: user?.name ?? 'Unknown' },
    ],
    [labs.length, selectedType, user?.name]
  );

  useEffect(() => {
    let mounted = true;

    async function loadLabs() {
      try {
        const response = await getLabs(token);
        if (mounted) {
          setLabs(response.labs);
        }
      } catch (error) {
        if (mounted) {
          setMessage(error.message);
        }
      } finally {
        if (mounted) {
          setLoadingLabs(false);
        }
      }
    }

    loadLabs();

    return () => {
      mounted = false;
    };
  }, [token]);

  async function handleCreateLab() {
    setCreating(true);
    setMessage('');

    try {
      const response = await createLab(token, selectedType);
      setLabs((currentLabs) => [response.lab, ...currentLabs]);
      setMessage(`Lab created in ${response.namespace}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteLab(lab) {
    setActiveDeleteId(lab.id);
    setMessage('');

    try {
      await deleteLab(token, lab.id);
      setLabs((currentLabs) => currentLabs.filter((currentLab) => currentLab.id !== lab.id));
      setMessage(`Deleted ${lab.deployment_name}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActiveDeleteId('');
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-8">
          <p className="field-label">Welcome back</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white">
            Create a new isolated AKS lab in one click.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            CloudLab provisions a namespace, deployment, service, and access URL for either Docker or Terraform practice environments.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className={selectedType === 'docker' ? 'primary-button' : 'secondary-button'}
              onClick={() => setSelectedType('docker')}
            >
              Docker Lab
            </button>
            <button
              type="button"
              className={selectedType === 'terraform' ? 'primary-button' : 'secondary-button'}
              onClick={() => setSelectedType('terraform')}
            >
              Terraform Lab
            </button>
            <button type="button" className="primary-button" onClick={handleCreateLab} disabled={creating}>
              {creating ? 'Creating lab...' : 'Create Lab'}
            </button>
          </div>

          {message ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {message}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((item) => (
            <div key={item.label} className="glass-panel rounded-[1.75rem] p-5">
              <p className="field-label">{item.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="field-label">Labs</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Active lab environments</h3>
          </div>
          <p className="text-sm text-slate-400">{loadingLabs ? 'Loading...' : `${labs.length} records`}</p>
        </div>

        {labs.length === 0 && !loadingLabs ? (
          <div className="glass-panel rounded-[2rem] p-8 text-slate-300">
            No labs yet. Create your first Docker or Terraform lab to see it here.
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-2">
          {labs.map((lab) => (
            <LabCard key={lab.id} lab={lab} deleting={activeDeleteId === lab.id} onDelete={handleDeleteLab} />
          ))}
        </div>
      </section>
    </div>
  );
}