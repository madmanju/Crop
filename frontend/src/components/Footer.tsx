import { Link } from 'react-router-dom';
import { Sprout, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-forest-950/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <Sprout size={15} className="text-white" />
            </div>
            <span className="text-base font-bold text-white">
              Crop<span className="text-emerald-400">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link to="/advisory/new" className="hover:text-emerald-400 transition-colors">New Advisory</Link>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="GitHub" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <Github size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} CropAI. Powered by Google Gemini AI. Built for farmers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
