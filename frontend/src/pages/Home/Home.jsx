import Header from '../../components/Header'
import CardSection from './CardSection'
import Footer from './Footer'
import Hero from './Hero'
import HowItWorks from './HowItWork'
import InfiniteSlider from './InfiniteSlider'

const Home = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <div className=''>
        <Hero />
        <InfiniteSlider />
        <CardSection />
        <HowItWorks />
      </div>
      <Footer/>
    </div>
  )
}

export default Home