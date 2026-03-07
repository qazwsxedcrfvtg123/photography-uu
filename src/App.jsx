import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Family from './pages/Family';
import Professional from './pages/Professional';
import About from './pages/About';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/family" element={<Family />} />
        <Route path="/professional" element={<Professional />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;
