import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, Plus, LogOut, Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { to: '/advisory/new', label: 'New Advisory', icon: <Plus size={16} /> },
      ]
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-emerald-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:shadow-emerald-600/50 transition-all duration-300">
              <Sprout size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Crop<span className="text-emerald-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-emerald-700/40 text-emerald-300'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <Leaf size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-300 max-w-[160px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  id="navbar-signout-btn"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="navbar-mobile-menu-btn"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-forest-950/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'bg-emerald-700/40 text-emerald-300'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setMenuOpen(false); handleSignOut(); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm text-center py-2.5">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center py-2.5">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
