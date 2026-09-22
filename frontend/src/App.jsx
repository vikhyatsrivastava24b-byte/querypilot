import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Components & Layouts
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ResearchWorkspace from './pages/ResearchWorkspace';

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
            {/* Stubs for future phases */}
            <Route path="/explore" element={<div style={{padding: 40}}>Explore coming soon...</div>} />
            <Route path="/projects" element={<div style={{padding: 40}}>Projects coming soon...</div>} />
            <Route path="/saved" element={<div style={{padding: 40}}>Saved queries coming soon...</div>} />
            <Route path="/history" element={<div style={{padding: 40}}>History coming soon...</div>} />
            <Route path="/insights" element={<div style={{padding: 40}}>Insights coming soon...</div>} />
            <Route path="/settings" element={<div style={{padding: 40}}>Settings coming soon...</div>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
