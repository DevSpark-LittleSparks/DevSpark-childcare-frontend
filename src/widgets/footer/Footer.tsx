import { Link } from 'react-router-dom';

const FooterColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-bold text-gray-900 leading-tight">{title}</h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link.label}>
          <Link to={link.href} className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-left">
        <FooterColumn 
          title="Features" 
          links={[
            { label: 'Tracking development', href: '#' },
            { label: 'Activities List', href: '#' },
            { label: 'Daily Checklist & Follow', href: '#' },
            { label: 'Reporting & Messaging', href: '#' },
            { label: 'Staff management', href: '#' },
          ]} 
        />
        <FooterColumn 
          title="Solutions" 
          links={[
            { label: 'Managing the day', href: '#' },
            { label: 'Tracking development', href: '#' },
            { label: 'Activities List', href: '#' },
            { label: 'Daily Checklist & Follow', href: '#' },
            { label: 'Reporting & Messaging', href: '#' },
            { label: 'Staff management', href: '#' },
          ]} 
        />
        <FooterColumn 
          title="Company" 
          links={[
            { label: 'About Us', href: '#' },
            { label: 'Contact', href: '#' },
          ]} 
        />
        <FooterColumn 
          title="Legal & Support" 
          links={[
            { label: 'Terms and Conditions', href: '#' },
            { label: 'Privacy', href: '#' },
            { label: 'Chat with us', href: '#' },
          ]} 
        />
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm font-medium text-gray-500 italic">
          2026 LittleSparks.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
