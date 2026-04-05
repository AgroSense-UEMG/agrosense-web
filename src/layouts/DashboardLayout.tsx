import Sidebar from "../components/Sidebar"

export default function DashboardLayout({
  children
}: any){
  return(
    <div className="flex">
      <Sidebar/>
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  )
}