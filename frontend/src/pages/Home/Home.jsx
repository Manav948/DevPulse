import Header from '../../components/Header'
import Hero from './Hero'

const Home = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <div>
        <Hero />
      </div>
    </div>
  )
}

export default Home