import React, { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
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
                <a className="flex items-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 logo" href="#hero">
                    <img
                        src="/images/logo.png"
                        alt="logo"
                        className="w-[30px] md:w-[50px] h-auto"
                    />
                    Cici Woolf
                </a>
                <nav className="desktop">
                   <ul>
                       {navLinks.map(({link, name}) => (
                           <li key={name} className="group">
                               <a href={link}>
                                   <span>{name}</span>
                                   <span className="underline"></span>
                               </a>
                           </li>
                       ))}
                   </ul>
                </nav>
            </div>

        </header>
    )
}
export default NavBar
