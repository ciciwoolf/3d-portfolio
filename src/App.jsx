import Hero from './sections/Hero.jsx'
import NavBar from './components/NavBar.jsx'
import ShowcaseSection from './sections/ShowcaseSection.jsx'
import FeaturedCards from './sections/FeaturedCards.jsx'
const App = () => {
    return (
        <main className="min-h-screen bg-blue-100">
            <NavBar />
            <Hero />
            <ShowcaseSection />
            <FeaturedCards />
        </main>
    )
}
export default App
