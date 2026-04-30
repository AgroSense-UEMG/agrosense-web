import { Link } from "react-router-dom"

export default function Sidebar(){
  return(
    <div className="w-64 bg-green-500 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">AgroSense</h1>
      <div className="flex flex-col gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Landing</Link>
      </div>
    </div>
  )
}