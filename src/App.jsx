import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import Vinil from './pages/Vinil'
import { LanguageProvider } from './context/LanguageProvider'
import { getDeploymentBasePath } from './utils/assetUrl'
import './App.css'

export default function App() {
  return (
    <LanguageProvider>
      <LoadingScreen />
      <BrowserRouter basename={getDeploymentBasePath()}>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vinil" element={<Vinil />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/contacto" element={<Navigate to="/#contacto" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  )
}
