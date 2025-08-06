
export const Button = ({ text, className, id }) => {
    const handleClick = (e) => {
        e.preventDefault();
        // Add touch feedback
        e.currentTarget.classList.add('active');
        setTimeout(() => {
            e.currentTarget.classList.remove('active');
        }, 200);

        const target = document.getElementById('counter');
        if (target && id) {
            const offset = window.innerHeight * 0.05;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    };

    return (
        <a
            onClick={handleClick}
            onTouchStart={(e) => e.currentTarget.classList.add('active')}
            onTouchEnd={(e) => e.currentTarget.classList.remove('active')}
            className={`${className ?? ''} cta-wrapper`}
        >
            <div className="cta-button group">
                <div className="bg-circle" />
                <p className="text">{text}</p>
                <div className="arrow-wrapper">
                    <img src="/images/arrow-down.svg" alt="arrow" />
                </div>
            </div>
        </a>
    )
}
