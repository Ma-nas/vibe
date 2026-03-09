import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Redirect from './Redirect';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/r/:shortId" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
