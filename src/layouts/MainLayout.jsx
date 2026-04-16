import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-80" />
      <Header />

      <main className="relative z-10 pb-16 pt-28">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
