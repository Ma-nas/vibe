import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Redirect from './Redirect';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/r/:shortId" element={<Redirect />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
