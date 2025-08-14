import React from 'react';
import Hero from './sections/Hero';
import NavBar from './components/NavBar';
import ShowcaseSection from './sections/ShowcaseSection';
import FeaturedCards from './sections/FeaturedCards';
import Footer from './components/Footer';
import ChatWidget from './components/ChatBot/ChatWidget';

const App = (): React.JSX.Element => {
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
