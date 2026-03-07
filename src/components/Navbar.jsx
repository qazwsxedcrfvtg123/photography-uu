import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const handleAboutClick = (e) => {
        e.preventDefault();
        // 1. 開啟新分頁前往 IG
        window.open('https://www.instagram.com/u.u_121/', '_blank', 'noopener,noreferrer');
        // 2. 原本的頁面導向到 /about 介紹品牌歷史
        navigate('/about');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">Photography</Link>
                <div className="nav-links">
                    <Link to="/family">溫馨家庭寫真</Link>
                    <Link to="/professional">專業形象攝影</Link>
                    <a href="/about" onClick={handleAboutClick}>關於我</a>
                    <Link to="/booking" className="btn nav-btn">預約諮詢</Link>
                </div>
            </div>
        </nav>
    );
}
