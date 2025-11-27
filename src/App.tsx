import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-3xl font-bold text-primary">
        AgroSense 🚀
      </h1>
      <p className="text-muted-foreground">
        Ambiente Front-end Configurado (React + TS + Shadcn)
      </p>
      
      <div className="flex gap-4">
        <Button>Botão Primário (Verde)</Button>
        <Button variant="secondary">Botão Secundário (Verde Claro)</Button>
        <Button variant="destructive">Botão Perigo (Vermelho)</Button>
      </div>
    </div>
  )
}

export default App

