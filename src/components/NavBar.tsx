import { useState, useEffect } from 'react';
import { navLinks, type NavLink } from '../constants';

const NavBar = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollStarted = window.scrollY > 10;
      setScrolled(scrollStarted);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
      <div className="inner">
        <a
          className="flex items-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 logo"
          href="#hero"
        >
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-[30px] md:w-[50px] h-auto"
          />
          C. Woolf
        </a>
        <nav className="desktop">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ link, name }: NavLink) => (
              <li key={name} className="group">
                <a href={link} className="hover:text-white transition-colors">
                  <span>{name}</span>
                  <span className="underline"></span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://www.linkedin.com/in/christinewoolf/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default NavBar;
