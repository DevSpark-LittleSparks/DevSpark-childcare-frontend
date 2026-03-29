import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import logo from '@/shared/assets/images/logo.png';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="LittleSparks" className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold text-gray-900 tracking-tight leading-none uppercase">LittleSparks</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#why" onClick={(e) => handleScroll(e, 'why')} className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors cursor-pointer">Why</a>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors cursor-pointer">Features</a>
          <a href="#safety" onClick={(e) => handleScroll(e, 'safety')} className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors cursor-pointer">Safety</a>
          <a href="#discover" onClick={(e) => handleScroll(e, 'discover')} className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors cursor-pointer">Discover</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">Get-Started</Button>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-500 px-4">Login</Link>
        </div>
      </div>
    </header>
  );
};
