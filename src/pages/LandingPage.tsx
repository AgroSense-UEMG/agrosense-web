import Hero from "../components/Hero"
import ComoFunciona from "../components/ComoFunciona"
import Footer from "../components/Footer"
import Estatisticas from "../components/Estatisticas"
import CTA from "../components/CTA"
import SectionAnimation from "../components/SectionAnimation"

export default function LandingPage() {
  return (
    <>
      <Hero />

      <div className="bg-gradient-to-b from-green-100 to-white">
        <SectionAnimation>
          <ComoFunciona />
        </SectionAnimation>

        <SectionAnimation>
          <Estatisticas />
        </SectionAnimation>
      </div>

      <SectionAnimation>
        <CTA />
      </SectionAnimation>

      <Footer />
    </>
  )
}