import { Button } from "../components/Button.jsx";
import { words } from "../constants";
import { HeroExperience } from "../components/HeroModels/HeroExperience.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
    useGSAP(() => {
        gsap.fromTo('.hero-text h1',
            {
                y: 50,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                ease: "power2.out",
                duration: 1,
            },
        )
    })

    return (
        <section id="hero" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 z-10">
            </div>

            <div className="hero-layout">
                {/* LEFT: Hero Content */}
                <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
                    <div className="flex flex-col gap-7">
                        <div className="hero-text">
                            <h1>
                                Engineering
                                <span className="slide">
                                  <span className="wrapper">
                                    {words.map((word, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center md:gap-3 gap-1 pb-2"
                                        >
                                            <img
                                                src={word.imgPath}
                                                alt="person"
                                                className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full"
                                            />
                                        <span>{word.text}</span>
                                      </span>
                                    ))}
                                  </span>
                                  </span>
                            </h1>
                            <h1>into Projects</h1>
                            <h1>that Delight and Inspire</h1>
                        </div>

                        <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                            I'm Cici Woolf, a Full Stack Developer at the Science Museum of Minnesota.
                        </p>

                        <Button
                            className="md:w-80 md:h-16 w60 h-12"
                            id="button"
                            text="See My Work"
                        />
                    </div>
                </header>

                {/* RIGHT: 3D Model */}
                <figure>
                    <div className="hero-3d-layout">
                        <HeroExperience />
                    </div>
                </figure>

            </div>
            <AnimatedCounter />
        </section>
    );
};

export default Hero;
