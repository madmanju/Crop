import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Sprout, ChevronRight, Wand2 } from 'lucide-react';
import { AdvisoryRequestSchema, type AdvisoryRequest } from '../lib/schema';
import { generateAdvisory } from '../lib/api';

const SOIL_OPTIONS = [
  { value: 'Alluvial', desc: 'Fertile, river-deposited — excellent for cereals & vegetables' },
  { value: 'Black', desc: 'High moisture retention, ideal for cotton & soybean' },
  { value: 'Red', desc: 'Iron-rich, well-drained — suited for groundnut & millet' },
  { value: 'Laterite', desc: 'Leached, acidic — best for tea, coffee, cashew' },
  { value: 'Arid', desc: 'Low organic matter, drought-adapted crops recommended' },
  { value: 'Saline', desc: 'High salt content, salt-tolerant varieties required' },
  { value: 'Peaty', desc: 'High organic matter, excellent water retention' },
];

const IRRIGATION_OPTIONS = [
  { value: 'Rainfed', desc: 'Dependent on rainfall — drought-tolerant crops advised' },
  { value: 'Drip', desc: 'Precision delivery, 40–60% water savings' },
  { value: 'Sprinkler', desc: 'Overhead spray, good for field crops and orchards' },
  { value: 'Canal', desc: 'Surface flow, good water availability' },
  { value: 'Tube well', desc: 'Groundwater access, flexible scheduling' },
];

const LOADING_STAGES = [
  'Analysing soil parameters…',
  'Cross-referencing seasonal conditions…',
  'Generating crop recommendations…',
  'Scheduling fertilizer phases…',
  'Assessing risk factors…',
  'Compiling your advisory…',
];

export default function NewAdvisoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdvisoryRequest>({
    resolver: zodResolver(AdvisoryRequestSchema),
    defaultValues: {
      landSizeAcre: undefined as unknown as number,
      budgetRange: 'Medium',
    },
  });

  const watchedValues = watch();

  async function onSubmit(data: AdvisoryRequest) {
    setLoading(true);
    setServerError('');

    // Cycle through loading stages
    let stage = 0;
    const interval = setInterval(() => {
      stage = Math.min(stage + 1, LOADING_STAGES.length - 1);
      setLoadingStage(stage);
    }, 1800);

    try {
      const result = await generateAdvisory(data);
      clearInterval(interval);
      navigate(`/advisory/${result.id}`);
    } catch (err) {
      clearInterval(interval);
      setServerError(err instanceof Error ? err.message : 'Failed to generate advisory. Please try again.');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center glass-card p-12 max-w-md w-full mx-4 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout size={24} className="text-emerald-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generating Your Advisory</h2>
          <p className="text-emerald-400 text-sm font-medium animate-pulse mb-6">
            {LOADING_STAGES[loadingStage]}
          </p>
          <div className="flex justify-center gap-1.5">
            {LOADING_STAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= loadingStage ? 'bg-emerald-500 w-6' : 'bg-emerald-900 w-3'
                }`}
              />
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-6">Powered by Google Gemini AI — takes ~20 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Wand2 size={20} className="text-emerald-400" />
        <h1 className="section-title mb-0">New Crop Advisory</h1>
      </div>
      <p className="section-subtitle mb-8">
        Fill in your farm parameters and receive an AI-powered advisory in seconds.
      </p>

      {serverError && (
        <div className="alert-danger mb-6">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form id="advisory-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Main Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section 1: Land & Location */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-700/40 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
                Land & Location
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="form-region" className="form-label">Region / Climate Zone</label>
                  <input
                    id="form-region"
                    type="text"
                    placeholder="e.g. Punjab, North India"
                    {...register('region')}
                    className="form-input"
                  />
                  {errors.region && <p className="form-error"><AlertCircle size={12} />{errors.region.message}</p>}
                </div>

                <div>
                  <label htmlFor="form-land-size" className="form-label">Land Size (acres)</label>
                  <input
                    id="form-land-size"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 10.5"
                    {...register('landSizeAcre', { valueAsNumber: true })}
                    className="form-input"
                  />
                  {errors.landSizeAcre && <p className="form-error"><AlertCircle size={12} />{errors.landSizeAcre.message}</p>}
                </div>

                <div>
                  <label htmlFor="form-season" className="form-label">Growing Season</label>
                  <select id="form-season" {...register('season')} className="form-select">
                    <option value="">Select season</option>
                    {['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.season && <p className="form-error"><AlertCircle size={12} />{errors.season.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Soil Type */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-700/40 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
                Soil Type
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {SOIL_OPTIONS.map((soil) => {
                  const isSelected = watchedValues.soilType === soil.value;
                  return (
                    <label
                      key={soil.value}
                      htmlFor={`soil-${soil.value}`}
                      className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-emerald-600/60 bg-emerald-900/30 shadow-glow-sm'
                          : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          id={`soil-${soil.value}`}
                          type="radio"
                          value={soil.value}
                          {...register('soilType')}
                          className="accent-emerald-500"
                        />
                        <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                          {soil.value}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 pl-5">{soil.desc}</p>
                    </label>
                  );
                })}
              </div>
              {errors.soilType && <p className="form-error mt-2"><AlertCircle size={12} />{errors.soilType.message}</p>}
            </div>

            {/* Section 3: Irrigation, Budget & Goal */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-700/40 text-emerald-400 text-xs flex items-center justify-center font-bold">3</span>
                Irrigation, Budget & Goal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Irrigation Method</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {IRRIGATION_OPTIONS.map((irr) => {
                      const isSelected = watchedValues.irrigation === irr.value;
                      return (
                        <label
                          key={irr.value}
                          htmlFor={`irrigation-${irr.value}`}
                          className={`flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-emerald-600/60 bg-emerald-900/30'
                              : 'border-white/10 bg-white/3 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              id={`irrigation-${irr.value}`}
                              type="radio"
                              value={irr.value}
                              {...register('irrigation')}
                              className="accent-emerald-500"
                            />
                            <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                              {irr.value}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 pl-5">{irr.desc}</p>
                        </label>
                      );
                    })}
                  </div>
                  {errors.irrigation && <p className="form-error mt-2"><AlertCircle size={12} />{errors.irrigation.message}</p>}
                </div>

                <div>
                  <label htmlFor="form-budget" className="form-label">Budget Range</label>
                  <div className="flex gap-3">
                    {(['Low', 'Medium', 'High'] as const).map((b) => {
                      const isSelected = watchedValues.budgetRange === b;
                      const colors = {
                        Low: 'border-blue-800/50 bg-blue-950/20 text-blue-300',
                        Medium: 'border-emerald-800/50 bg-emerald-950/20 text-emerald-300',
                        High: 'border-amber-800/50 bg-amber-950/20 text-amber-300',
                      };
                      return (
                        <label
                          key={b}
                          htmlFor={`budget-${b}`}
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-semibold ${
                            isSelected ? colors[b] : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <input
                            id={`budget-${b}`}
                            type="radio"
                            value={b}
                            {...register('budgetRange')}
                            className="sr-only"
                          />
                          {b}
                        </label>
                      );
                    })}
                  </div>
                  {errors.budgetRange && <p className="form-error mt-2"><AlertCircle size={12} />{errors.budgetRange.message}</p>}
                </div>

                <div>
                  <label htmlFor="form-goal" className="form-label">Primary Farming Goal <span className="text-slate-500 font-normal">(optional)</span></label>
                  <textarea
                    id="form-goal"
                    rows={3}
                    placeholder="e.g. Maximum yield, Organic farming, Drought resistance, Export quality produce..."
                    {...register('primaryGoal')}
                    className="form-input resize-none"
                  />
                  {errors.primaryGoal && <p className="form-error"><AlertCircle size={12} />{errors.primaryGoal.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar Summary ── */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 sticky top-24">
              <h3 className="text-sm font-bold text-white mb-4">Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Region', value: watchedValues.region || '—' },
                  { label: 'Land Size', value: watchedValues.landSizeAcre ? `${watchedValues.landSizeAcre} acres` : '—' },
                  { label: 'Soil Type', value: watchedValues.soilType || '—' },
                  { label: 'Season', value: watchedValues.season || '—' },
                  { label: 'Irrigation', value: watchedValues.irrigation || '—' },
                  { label: 'Budget', value: watchedValues.budgetRange || '—' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className={`text-xs font-semibold truncate max-w-[120px] ${item.value === '—' ? 'text-slate-600' : 'text-emerald-300'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <button
                id="advisory-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                <Wand2 size={16} />
                Generate Advisory
                <ChevronRight size={16} />
              </button>

              <p className="text-xs text-slate-600 text-center mt-3">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
