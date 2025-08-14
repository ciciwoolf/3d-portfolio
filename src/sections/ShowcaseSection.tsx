import React, { useRef } from 'react';
import ArtVideo from '../components/ArtVideo';
import { digitalWorks } from '../constants';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = (): React.JSX.Element => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const websiteRef = useRef<HTMLDivElement>(null);
  const javascriptArtRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    const cards = [websiteRef.current, javascriptArtRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
          },
        }
      );
    });
  }, []);

  const { publicId, cloudName } = digitalWorks[0];
  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/** Art Website **/}
          <div ref={websiteRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <a
                href="https://www.theartofciciwoolf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://res.cloudinary.com/dmezw1zxr/image/upload/f_auto,q_auto,w_800/v1750430107/Screenshot_2025-06-19_at_11.12.03_AM_akcbnm.png"
                  alt="Cici Woolf's Art Website"
                />
              </a>
            </div>
            <div className="text-content">
              <a
                href="https://www.theartofciciwoolf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h2 className="hover:text-blue-50">The Art of Cici Woolf</h2>
              </a>
              <p className="text-white-50 md:text-xl">
                An app to display my artwork, built with Next.js, React.js, and
                Tailwind CSS.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            {/** JavaScript Art **/}
            <div ref={javascriptArtRef} className="project">
              <div className="video-wrapper">
                <a
                  href="https://github.com/ciciwoolf/javascript-art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label="JavaScript Art"
                >
                  <ArtVideo publicId={publicId} cloudName={cloudName} />
                </a>
                <h2 className="hover:text-blue-50">
                  <a
                    href="https://github.com/ciciwoolf/javascript-art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    JavaScript Art
                  </a>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowcaseSection;
