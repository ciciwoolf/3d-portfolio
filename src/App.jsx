import Hero from './sections/Hero.jsx';
import NavBar from './components/NavBar.jsx';
import ShowcaseSection from './sections/ShowcaseSection.jsx';
import FeaturedCards from './sections/FeaturedCards.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatBot/ChatWidget.jsx';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <ShowcaseSection />
        <FeaturedCards />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;
