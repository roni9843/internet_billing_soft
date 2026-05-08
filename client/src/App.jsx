import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import EditClient from './pages/EditClient';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Dashboard />} />
          <Route path="bills" element={<Bills />} />
          <Route path="clients" element={<Clients />} />
          <Route path="add-client" element={<AddClient />} />
          <Route path="edit-client/:id" element={<EditClient />} />
          <Route path="settings" element={<Settings />} />

          <Route path="payments" element={<div className="p-8 text-center text-gray-500">Payments Page Coming Soon...</div>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
