import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 selection:bg-indigo-500 selection:text-white antialiased">
      <Outlet />
    </div>
  )
}

export default Layout
