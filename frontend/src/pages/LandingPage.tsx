import { Link } from 'react-router-dom';
import {
  Sprout, ArrowRight, Zap, BarChart3, Leaf,
  CheckCircle, ChevronRight, Star, FlaskConical, CloudRain, TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: <FlaskConical size={22} className="text-emerald-400" />,
    title: 'Hyper-Localized Soil Analysis',
    desc: 'Deep soil chemistry interpretation across 7 soil types — Alluvial, Black, Red, Laterite, Arid, Saline, and Peaty — with tailored amendment strategies.',
  },
  {
    icon: <Leaf size={22} className="text-emerald-400" />,
    title: 'Dynamic Fertilizer Scheduling',
    desc: 'AI-generated fertilizer calendars covering the full crop lifecycle from pre-sowing through post-harvest soil restoration.',
  },
  {
    icon: <CloudRain size={22} className="text-emerald-400" />,
    title: 'Climate & Pest Risk Mitigation',
    desc: 'Season-aware risk assessment covering disease pressure, pest cycles, irrigation stress, and extreme weather contingency strategies.',
  },
  {
    icon: <TrendingUp size={22} className="text-emerald-400" />,
    title: 'Multi-Crop Yield Optimisation',
    desc: 'Ranked crop recommendations with expected yield per acre, economic analysis, and sustainable rotation planning.',
  },
];

const steps = [
  { num: '01', title: 'Set Your Farm Profile', desc: 'Enter region, acreage, soil type, season, and irrigation method.' },
  { num: '02', title: 'AI Analyses Your Parameters', desc: 'Gemini AI cross-references your conditions against agronomic science.' },
  { num: '03', title: 'Receive Your Advisory', desc: 'Get a complete crop plan with recommendations, schedule, and risk strategies.' },
  { num: '04', title: 'Save & Track History', desc: 'All advisories saved — compare seasons and monitor your land over time.' },
];

const metrics = [
  { value: '+35%', label: 'Average Yield Improvement' },
  { value: '-28%', label: 'Fertilizer Waste Reduction' },
  { value: '4.9★', label: 'Agronomist Accuracy Score' },
  { value: '<30s', label: 'Advisory Generation Time' },
];

const sampleCrops = [
  { name: 'Wheat', yield: '18–22 quintals/acre', badge: 'Top Pick' },
  { name: 'Chickpea', yield: '6–9 quintals/acre', badge: 'N-Fixing' },
  { name: 'Mustard', yield: '8–12 quintals/acre', badge: 'Cash Crop' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-pattern">
        {/* Background glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-green-700/5 blur-3xl" />
        </div>

        <div className="page-container relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              <div className="badge-emerald mb-6 w-fit">
                <Zap size={12} />
                Powered by Google Gemini AI
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
                AI-Powered<br />
                <span className="text-gradient">Crop Advisory</span><br />
                for Every Farm
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Get hyper-personalized crop recommendations, fertilizer schedules, 
                and risk management strategies — tailored to your exact soil, season, 
                and land parameters.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/register"
                  id="hero-get-started-btn"
                  className="btn-primary text-base px-8 py-3.5"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  id="hero-sign-in-btn"
                  className="btn-ghost text-base px-8 py-3.5"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                {['No credit card required', 'Instant AI advisories', 'Secure & private'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Sample Preview */}
            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="ml-auto text-xs text-slate-500 font-mono">Sample Advisory</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { label: 'Region', value: 'Punjab, India' },
                  { label: 'Soil', value: 'Alluvial' },
                  { label: 'Season', value: 'Winter' },
                  { label: 'Acres', value: '12 acres' },
                ].map((p) => (
                  <div key={p.label} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                    <span className="text-slate-500">{p.label}: </span>
                    <span className="text-emerald-300 font-semibold">{p.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Recommended Crops
              </p>
              <div className="space-y-2.5">
                {sampleCrops.map((crop, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700/30 flex items-center justify-center">
                        <Sprout size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{crop.name}</p>
                        <p className="text-xs text-slate-400">{crop.yield}</p>
                      </div>
                    </div>
                    <span className="badge-emerald">{crop.badge}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-900/30">
                <p className="text-xs font-semibold text-amber-400 mb-1">⚠ Risk Alert</p>
                <p className="text-xs text-slate-400">Aphid pressure expected in week 6–8. Deploy neem-based bio-pesticide at first signs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics Banner ── */}
      <section className="border-y border-white/5 bg-gradient-to-r from-emerald-950/20 to-transparent">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-gradient mb-1">{m.value}</p>
                <p className="text-sm text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="page-container py-24">
        <div className="text-center mb-16">
          <div className="badge-emerald mb-4 mx-auto w-fit">
            <Star size={12} />
            Core Capabilities
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Everything a Modern Farmer Needs
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From soil chemistry to harvest scheduling, CropAI combines agronomic science 
            with Google's latest AI to deliver insights once only available to expert consultants.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mb-4 group-hover:border-emerald-600/60 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four simple steps from farm profile to actionable crop advisory.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="glass-card p-6 h-full">
                  <div className="text-4xl font-black text-emerald-900 mb-4">{step.num}</div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight
                    size={20}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 text-emerald-800 hidden lg:block z-10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="page-container py-24">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-glow-md animate-float">
              <Sprout size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Start Growing Smarter Today
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Join thousands of farmers already using AI to maximise yields,
              reduce waste, and build more resilient farms.
            </p>
            <Link
              to="/register"
              id="cta-get-started-btn"
              className="btn-primary text-lg px-10 py-4 inline-flex"
            >
              Create Your Free Account
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Badges ── */}
      <section className="page-container pb-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['Google Gemini AI', 'Supabase', 'React + TypeScript', 'Node.js Express', 'Tailwind CSS'].map((tech) => (
            <div key={tech} className="badge-slate">
              <BarChart3 size={10} />
              {tech}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
