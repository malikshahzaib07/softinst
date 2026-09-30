import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BlobBg from './components/BlobBg'
import Footer from './components/Footer'
import Header from './components/Header'
import InstallerDock from './components/InstallerDock'
import InstallerModal from './components/InstallerModal'
import { SoftInstProvider } from './context/SoftInstContext'
import AboutPage from './pages/AboutPage'
import AppsPage from './pages/AppsPage'
import HomePage from './pages/HomePage'
import TweaksPage from './pages/TweaksPage'
import HowPage from './pages/HowPage'

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
                <Route path="/apps" element={<AppsPage />} />
                <Route path="/tweaks" element={<TweaksPage />} />
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
