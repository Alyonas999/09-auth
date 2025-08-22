import '../app/globals.css'; 
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}