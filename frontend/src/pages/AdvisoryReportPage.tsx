import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Layers, CalendarDays, Droplets,
  DollarSign, Sprout, AlertTriangle, FlaskConical,
  Download, Share2, CheckCircle2, TrendingUp
} from 'lucide-react';
import { getAdvisoryById } from '../lib/api';
import type { Advisory } from '../lib/schema';
import LoadingSpinner from '../components/LoadingSpinner';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

const phaseColors: Record<string, string> = {
  'Pre-Sowing': 'bg-blue-900/40 border-blue-700/40 text-blue-300',
  'Sowing': 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300',
  'Vegetative': 'bg-green-900/40 border-green-700/40 text-green-300',
  'Pre-Flowering': 'bg-purple-900/40 border-purple-700/40 text-purple-300',
  'Grain Filling': 'bg-amber-900/40 border-amber-700/40 text-amber-300',
  'Post-Harvest': 'bg-slate-800/60 border-slate-700/40 text-slate-300',
};

function getPhaseColor(phase: string): string {
  const key = Object.keys(phaseColors).find((k) =>
    phase.toLowerCase().includes(k.toLowerCase())
  );
  return key ? phaseColors[key] : 'bg-white/5 border-white/10 text-slate-300';
}

export default function AdvisoryReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/dashboard'); return; }
    fetchAdvisory(id);
  }, [id]);

  async function fetchAdvisory(advisoryId: string) {
    setLoading(true);
    setError('');
    try {
      const data = await getAdvisoryById(advisoryId);
      setAdvisory(data.advisory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Advisory not found');
    } finally {
      setLoading(false);
    }
  }

  function handleCopySummary() {
    if (!advisory) return;
    const crops = advisory.ai_response.recommendedCrops
      .map((c) => `${c.cropName}: ${c.expectedYieldPerAcre}`)
      .join('\n');
    const text = `CropAI Advisory — ${advisory.region}\nDate: ${formatDate(advisory.created_at)}\n\nRecommended Crops:\n${crops}\n\nRisk Factors:\n${advisory.ai_response.riskFactors.join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading advisory..." />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="page-container py-20 text-center">
        <div className="glass-card p-12 max-w-md mx-auto">
          <AlertTriangle size={32} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Advisory Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'This advisory could not be loaded.'}</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { ai_response } = advisory;

  return (
    <div className="page-container py-10 max-w-5xl animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            id="report-back-btn"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="section-title mb-1 flex items-center gap-2">
            <MapPin size={20} className="text-emerald-400" />
            {advisory.region}
          </h1>
          <p className="text-slate-500 text-sm">{formatDate(advisory.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="report-copy-btn"
            onClick={handleCopySummary}
            className="btn-ghost text-sm py-2 px-4"
          >
            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>
          <button
            id="report-print-btn"
            onClick={() => window.print()}
            className="btn-ghost text-sm py-2 px-4"
          >
            <Download size={16} />
            Print
          </button>
        </div>
      </div>

      {/* ── Farm Parameters Recap ── */}
      <div className="glass-card p-5 mb-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Farm Parameters</p>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: <Layers size={13} />, label: advisory.soil_type },
            { icon: <CalendarDays size={13} />, label: advisory.season },
            { icon: <Droplets size={13} />, label: advisory.irrigation },
            { icon: <DollarSign size={13} />, label: `${advisory.budget_range} Budget` },
            { icon: <Sprout size={13} />, label: `${advisory.land_size_acre} Acres` },
          ].map((pill) => (
            <div key={pill.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
              <span className="text-emerald-500">{pill.icon}</span>
              {pill.label}
            </div>
          ))}
          {advisory.primary_goal && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-sm text-emerald-300">
              <TrendingUp size={13} />
              {advisory.primary_goal}
            </div>
          )}
        </div>
      </div>

      {/* ── Recommended Crops ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sprout size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Recommended Crops</h2>
          <span className="badge-emerald ml-1">{ai_response.recommendedCrops.length} crops</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {ai_response.recommendedCrops.map((crop, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700/40 to-green-900/20 border border-emerald-700/30 flex items-center justify-center flex-shrink-0">
                  <Sprout size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white leading-tight">{crop.cropName}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp size={11} className="text-harvest-400" />
                    <span className="text-xs font-semibold text-harvest-400">{crop.expectedYieldPerAcre}</span>
                  </div>
                </div>
                {i === 0 && <span className="badge-harvest flex-shrink-0">Top Pick</span>}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{crop.reasonForRecommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fertilizer Schedule Timeline ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Fertilizer Schedule</h2>
        </div>
        <div className="glass-card p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-600/50 via-emerald-800/30 to-transparent" />

            <div className="space-y-6">
              {ai_response.fertilizerSchedule.map((item, i) => (
                <div key={i} className="relative flex gap-4">
                  {/* Node */}
                  <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    i === 0
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-glow-sm'
                      : 'bg-forest-800 border-emerald-800/50 text-emerald-400'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg border text-xs font-bold mb-2 ${getPhaseColor(item.phase)}`}>
                      {item.phase}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Risk Factors ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-amber-400" />
          <h2 className="text-lg font-bold text-white">Risk Factors & Mitigation</h2>
          <span className="badge-harvest ml-1">{ai_response.riskFactors.length} risks</span>
        </div>
        <div className="space-y-3">
          {ai_response.riskFactors.map((risk, i) => (
            <div key={i} className="alert-warning">
              <div className="w-6 h-6 rounded-full bg-amber-900/50 border border-amber-700/50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-400">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed">{risk}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/advisory/new" id="report-new-advisory-btn" className="btn-primary">
          <Sprout size={16} />
          Generate New Advisory
        </Link>
        <Link to="/dashboard" id="report-dashboard-btn" className="btn-ghost">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
