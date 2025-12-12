import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AccessibilityPanel from './components/common/AccessibilityPanel';
import { accessibilityManager } from './utils/accessibility';
import HomePage from './pages/HomePage';
import MissionPage from './pages/MissionPage';
import DesignerPage from './pages/DesignerPage';
import BlueprintPage from './pages/BlueprintPage';
import EthicsPage from './pages/EthicsPage';
import PortfolioPage from './pages/PortfolioPage';
import TeacherPage from './pages/TeacherPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';

function App() {
  useEffect(() => {
    // 접근성 설정 초기화
    accessibilityManager.init();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/blueprint" element={<BlueprintPage />} />
            <Route path="/ethics" element={<EthicsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <AccessibilityPanel />
      </div>
    </Router>
  );
}

export default App;
