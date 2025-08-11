export const Button = ({ text, className, id }) => {
  const handleClick = (e) => {
    e.preventDefault();

    // Store reference to avoid null issues in setTimeout
    const element = e.currentTarget;

    // Add visual feedback
    element.classList.add('active');
    setTimeout(() => {
      element.classList.remove('active');
    }, 200);

    // Handle scroll functionality
    const target = document.getElementById('counter');
    if (target && id) {
      const offset = window.innerHeight * 0.05;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <a onClick={handleClick} className={`${className ?? ''} cta-wrapper`}>
      <div className="cta-button group">
        <div className="bg-circle" />
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="/images/arrow-down.svg" alt="arrow" />
        </div>
      </div>
    </a>
  );
};
