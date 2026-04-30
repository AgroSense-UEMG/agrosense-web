import Hero from "@/components/ui/landing/Hero"
import ComoFunciona from "@/components/ui/landing/ComoFunciona"
import Estatisticas from "@/components/ui/landing/Estatisticas"
import CTA from "@/components/ui/landing/CTA"
import SectionAnimation from "@/components/ui/landing/SectionAnimation"

export default function LandingPage() {
  return (
    <>
      <Hero />

      <div className="bg-gradient-to-b from-green-100 to-white">
        <SectionAnimation>
          <section id="sobre">
            <ComoFunciona />
          </section>
        </SectionAnimation>

        <SectionAnimation>
          <Estatisticas />
        </SectionAnimation>
      </div>

      <SectionAnimation>
        <CTA />
      </SectionAnimation>
    </>
  )
}