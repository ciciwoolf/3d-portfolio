import React from 'react'

const ShowcaseSection = () => {
    return (
        <div id="work" className="app-showcase">
            <div className="w-full">
                <div className="showcaselayout">
                    <div className="first-project-wrapper">
                        <div className="image-wrapper">
                            <a
                                href="https://www.theartofciciwoolf.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <img
                                    src="https://res.cloudinary.com/dmezw1zxr/image/upload/f_auto,q_auto,w_800/v1750430107/Screenshot_2025-06-19_at_11.12.03_AM_akcbnm.png"
                                    alt="Cici Woolf's Art Website"/>
                            </a>
                        </div>
                        <div className="text-content">
                            <h2>
                                The Art of Cici Woolf Website App
                            </h2>
                            <p className="text-white-50 md:text-xl">
                                An app to display my artwork, built with Next.js, React.js, and Tailwind CSS.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
export default ShowcaseSection
