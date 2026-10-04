import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, MapPin, Layers, CalendarDays, Trash2,
  LayoutDashboard, Sprout, Droplets, DollarSign, Search, Filter
} from 'lucide-react';
import { getAdvisories, deleteAdvisory } from '../lib/api';
import type { Advisory } from '../lib/schema';
import LoadingSpinner from '../components/LoadingSpinner';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function seasonBadgeClass(season: string): string {
  const map: Record<string, string> = {
    Spring: 'badge-emerald',
    Summer: 'badge-harvest',
    Monsoon: 'badge-blue',
    Autumn: 'badge-harvest',
    Winter: 'badge-blue',
  };
  return map[season] ?? 'badge-slate';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSeason, setFilterSeason] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisories();
  }, []);

  async function fetchAdvisories() {
    setLoading(true);
    setError('');
    try {
      const data = await getAdvisories();
      setAdvisories(data.advisories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load advisories');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this advisory? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteAdvisory(id);
      setAdvisories((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete advisory');
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = advisories.filter((a) => {
    const matchSearch =
      search === '' ||
      a.region.toLowerCase().includes(search.toLowerCase()) ||
      a.soil_type.toLowerCase().includes(search.toLowerCase());
    const matchSeason = filterSeason === '' || a.season === filterSeason;
    return matchSearch && matchSeason;
  });

  const totalAcreage = advisories.reduce((sum, a) => sum + Number(a.land_size_acre), 0);

  return (
    <div className="page-container py-10 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={20} className="text-emerald-400" />
            <h1 className="section-title mb-0">My Dashboard</h1>
          </div>
          <p className="section-subtitle">Manage and review your crop advisories</p>
        </div>
        <Link to="/advisory/new" id="dashboard-new-advisory-btn" className="btn-primary">
          <Plus size={18} />
          New Advisory
        </Link>
      </div>

      {/* ── Metric tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Sprout size={18} className="text-emerald-400" />, label: 'Total Advisories', value: advisories.length },
          { icon: <Layers size={18} className="text-harvest-400" />, label: 'Acres Analysed', value: `${totalAcreage.toFixed(1)} ac` },
          {
            icon: <CalendarDays size={18} className="text-blue-400" />,
            label: 'Latest Advisory',
            value: advisories.length > 0 ? formatDate(advisories[0].created_at) : '—',
          },
        ].map((tile) => (
          <div key={tile.label} className="glass-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              {tile.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{tile.value}</p>
              <p className="text-xs text-slate-500">{tile.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      {advisories.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search by region or soil type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select
              id="dashboard-season-filter"
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="form-select pl-10 pr-8 min-w-[160px]"
            >
              <option value="">All Seasons</option>
              {['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" message="Loading advisories..." />
        </div>
      ) : error ? (
        <div className="alert-danger">
          <span>{error}</span>
          <button onClick={fetchAdvisories} className="ml-auto text-sm underline hover:no-underline">
            Retry
          </button>
        </div>
      ) : advisories.length === 0 ? (
        /* Empty state */
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-950/50 border border-emerald-800/30 flex items-center justify-center mx-auto mb-6 animate-float">
            <Sprout size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No advisories yet</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm">
            Create your first AI-powered crop advisory by entering your farm parameters.
            It only takes a minute.
          </p>
          <Link to="/advisory/new" id="empty-state-new-btn" className="btn-primary">
            <Plus size={18} />
            Create Your First Advisory
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          No advisories match your search filters.
        </div>
      ) : (
        /* Advisory grid */
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((advisory) => (
            <div
              key={advisory.id}
              className="glass-card p-5 flex flex-col gap-4"
            >
              {/* Top row: region + season */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
                    <h3 className="text-sm font-bold text-white truncate">{advisory.region}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(advisory.created_at)}</p>
                </div>
                <span className={seasonBadgeClass(advisory.season)}>{advisory.season}</span>
              </div>

              {/* Detail pills */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Layers size={11} className="text-slate-500" />
                  {advisory.soil_type}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Droplets size={11} className="text-slate-500" />
                  {advisory.irrigation}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <DollarSign size={11} className="text-slate-500" />
                  {advisory.budget_range} budget
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Sprout size={11} className="text-slate-500" />
                  {advisory.land_size_acre} acres
                </div>
              </div>

              {/* Crop preview */}
              {advisory.ai_response?.recommendedCrops && (
                <div className="flex flex-wrap gap-1.5">
                  {advisory.ai_response.recommendedCrops.slice(0, 3).map((c, i) => (
                    <span key={i} className="badge-emerald text-xs">{c.cropName.split(' ')[0]}</span>
                  ))}
                  {advisory.ai_response.recommendedCrops.length > 3 && (
                    <span className="badge-slate text-xs">+{advisory.ai_response.recommendedCrops.length - 3}</span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                <button
                  id={`advisory-view-${advisory.id}`}
                  onClick={() => navigate(`/advisory/${advisory.id}`)}
                  className="btn-secondary text-sm py-2 px-4 flex-1"
                >
                  View Report
                </button>
                <button
                  id={`advisory-delete-${advisory.id}`}
                  onClick={() => handleDelete(advisory.id)}
                  disabled={deletingId === advisory.id}
                  className="btn-danger p-2"
                  aria-label="Delete advisory"
                >
                  {deletingId === advisory.id ? (
                    <span className="w-4 h-4 border-2 border-red-900 border-t-red-400 rounded-full animate-spin inline-block" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
