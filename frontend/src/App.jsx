import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Components & Layouts
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ResearchWorkspace from './pages/ResearchWorkspace';

import Explore from './pages/Explore';
import Projects from './pages/Projects';
import History from './pages/History';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />
          
          {/* App Routes with Sidebar Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<ResearchWorkspace />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/saved" element={<Projects />} /> {/* Alias to projects for now */}
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Explore />} />
            <Route path="/settings" element={<div style={{padding: 40}}>Settings coming soon...</div>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
