import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-foreground text-card py-16 mt-20">
    <div className="container grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <h3 className="font-display text-2xl mb-4 text-card">pebble</h3>
        <p className="text-card/60 text-sm font-body leading-relaxed">
          A curated marketplace for handcrafted, sustainable goods from verified artisans around the world.
        </p>
      </div>
      {[
        { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'] },
        { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
        { title: 'Support', links: ['Help Center', 'Shipping', 'Returns', 'Contact'] },
      ].map(col => (
        <div key={col.title}>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-card/80">{col.title}</h4>
          <ul className="space-y-2.5">
            {col.links.map(link => (
              <li key={link}>
                <Link to="/shop" className="text-sm text-card/50 hover:text-card transition-colors font-body">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mt-12 pt-8 border-t border-card/10 text-center text-card/40 text-xs font-body">
      © 2026 Pebble. All rights reserved.
    </div>
  </footer>
);
