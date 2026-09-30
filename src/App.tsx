import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BlobBg from './components/BlobBg'
import Footer from './components/Footer'
import Header from './components/Header'
import InstallerDock from './components/InstallerDock'
import InstallerModal from './components/InstallerModal'
import { SoftInstProvider } from './context/SoftInstContext'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import HowPage from './pages/HowPage'
import SpecsPage from './pages/SpecsPage'

export default function App() {
  return (
    <BrowserRouter>
      <SoftInstProvider>
        <div className="relative min-h-screen checker-bg">
          <BlobBg />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/specs" element={<SpecsPage />} />
                <Route path="/how-it-works" element={<HowPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <InstallerDock />
          <InstallerModal />
        </div>
      </SoftInstProvider>
    </BrowserRouter>
  )
}
