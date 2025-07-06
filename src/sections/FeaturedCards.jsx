import { skills } from "../constants";

const FeatureCards = () => (
    <div className="w-full padding-x-lg ">
        <div id="skills"className="mx-auto grid-4-cols">
            {skills.map(({ imgPath, title, desc }) => (
                <div
                    key={title}
                    className="card-border rounded-xl p-8 flex flex-col gap-4 mb-12"
                >
                    <div className="size-12 flex items-center justify-center rounded-full">
                        <img src={imgPath} alt={title} />
                    </div>
                    <h3 className="text-white text-2xl font-semibold mt-2">{title}</h3>
                    <p className="text-white-50 text-lg">{desc}</p>
                </div>
            ))}
        </div>
    </div>
);

export default FeatureCards;