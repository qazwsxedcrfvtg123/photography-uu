import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Family from './pages/Family';
import Professional from './pages/Professional';
import Baby from './pages/Baby';
import About from './pages/About';
import Booking from './pages/Booking';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router basename="/photography-uu">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/family" element={<Family />} />
          <Route path="/baby" element={<Baby />} />
          <Route path="/professional" element={<Professional />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {/* Add more admin pages here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
