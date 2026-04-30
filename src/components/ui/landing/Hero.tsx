import { useEffect, useState } from "react"

export default function Hero() {

  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {

    const handleScroll = () => {
      setOffsetY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])

  return (

    <section
      className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.22)), url('/fundo.png')",
        backgroundSize: "cover",
        backgroundPosition: `center ${offsetY * 0.3}px`,
        backgroundRepeat: "no-repeat"
      }}
    >

      <div className="text-center px-6">

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          AgroSense
        </h1>

        <p className="text-lg md:text-xl">
          Plataforma de monitoramento para pesquisas agrícolas
        </p>

      </div>

    </section>

  )

}