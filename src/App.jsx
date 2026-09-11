import { Component, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import { LanguageProvider } from './context/LanguageProvider'
import { getDeploymentBasePath } from './utils/assetUrl'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Vinil = lazy(() => import('./pages/Vinil'))
const Cozinhas = lazy(() => import('./pages/Cozinhas'))
const Carpintaria = lazy(() => import('./pages/Carpintaria'))
const Lacagem = lazy(() => import('./pages/Lacagem'))
const Decoracao = lazy(() => import('./pages/Decoracao'))
const Privacidade = lazy(() => import('./pages/Privacidade'))

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Failed to load a website route.', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="route-error" role="alert">
        <p>Não foi possível carregar esta página. / This page could not be loaded.</p>
        <button type="button" onClick={this.handleReload}>Recarregar / Reload</button>
      </div>
    )
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <LoadingScreen />
      <BrowserRouter basename={getDeploymentBasePath()}>
        <ScrollToTop />
        <Navbar />
        <main>
          <RouteErrorBoundary>
            <Suspense fallback={<div className="route-loading" role="status" aria-label="A carregar / Loading" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vinil" element={<Vinil />} />
                <Route path="/cozinhas" element={<Cozinhas />} />
                <Route path="/carpintaria" element={<Carpintaria />} />
                <Route path="/lacagem" element={<Lacagem />} />
                <Route path="/decoracao" element={<Decoracao />} />
                <Route path="/galeria" element={<Navigate to="/decoracao" replace />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/contacto" element={<Navigate to="/#contacto" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </main>
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  )
}
