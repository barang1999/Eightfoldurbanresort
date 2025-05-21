import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SpaPage from './pages/SpaPage';
import SankyaPage from './pages/SankyaPage';
import OldMaison from './pages/OldMaison';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import TourExperiencePage from './pages/TourExperiencePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantPage from './pages/RestaurantPage';
import Layout from './components/Layout';
import AboutUsPage from './pages/AboutUs';
import GalleryPage from './pages/GalleryPage';
import ContactUsPage from './pages/ContactUs';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/spa" element={<Layout><SpaPage /></Layout>} />
        <Route path="/sankya" element={<Layout><SankyaPage /></Layout>} />
        <Route path="/oldmaison" element={<Layout><OldMaison /></Layout>} />
        <Route
          path="/sankyacafe"
          element={
            <Layout>
              <RestaurantPage name="Sankya Cafe" propertyId="6803cba3dadf9a0d829427fe" />
            </Layout>
          }
        />
        <Route path="/tours" element={<Layout><TourExperiencePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactUsPage /></Layout>} />
      </Routes>
    </Router>
  );
}