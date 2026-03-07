import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">Photography</Link>
                <div className="nav-links">
                    <Link to="/family">溫馨家庭寫真</Link>
                    <Link to="/professional">專業形象攝影</Link>
                    <Link to="/about">關於我</Link>
                    <Link to="/booking" className="btn nav-btn">預約諮詢</Link>
                </div>
            </div>
        </nav>
    );
}
