import React from 'react';
import { Button } from '../components/Button';
import { HeroExperience } from '../components/HeroModels/HeroExperience';
import AnimatedCounter from '../components/AnimatedCounter';
import { heroContent } from '../constants/index';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = (): React.JSX.Element => {
  useGSAP(() => {
    gsap.fromTo(
      '.hero-text h1',
      {
        y: -50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        ease: 'power2.out',
        duration: 1,
      }
    );
  });

  return (
    <section
      id="hero"
      className="relative overflow-x-hidden overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute top-0 left-0 z-10" />

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center w-full px-5 md:px-20">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1>
                {heroContent.heroTitleWord}
                <span className="slide">
                  <span className="wrapper">
                    <span className="flex items-center gap-1 pb-2 md:gap-3">
                      <img
                        src="/images/sparkles.svg"
                        alt="sparkle"
                        className="p-1 size-7 md:p-2 md:size-10 xl:size-12 rounded-full"
                      />
                      <span>{heroContent.animatedWord}</span>
                    </span>
                  </span>
                </span>
              </h1>
              <h1>{heroContent.heroSubtitle}</h1>
            </div>

            <div className="relative z-10 text-white-50 tracking-wide md:text-xl lg:max-w-[50vw]">
              <p>{heroContent.heroIntroduction}</p>
            </div>
            <Button
              className="w-60 h-12 md:w-80 md:h-16"
              id="button"
              text="See My Work"
            />
          </div>
        </header>

        {/* RIGHT: 3D Model */}
        <figure className="w-full h-full p-2 flex items-center justify-center">
          <div className="hero-3d-layout">
            <HeroExperience />
            {/* Mobile-only invisible overlay to enable scrolling over 3D canvas */}
            <div className="mobile-scroll-overlay md:hidden"></div>
          </div>
        </figure>
      </div>
      <AnimatedCounter />
    </section>
  );
};

export default Hero;
