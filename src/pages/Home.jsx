import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className="home-container">
            <section className="hero-split">
                <div className="hero-half hero-family">
                    <div className="hero-content">
                        <h1>凝結純粹的溫度</h1>
                        <p>紀錄家人相處的溫馨瞬間</p>
                        <Link to="/family" className="btn">探索家庭寫真</Link>
                    </div>
                </div>
                <div className="hero-half hero-baby">
                    <div className="hero-content">
                        <h1>萌動初生的喜悅</h1>
                        <p>捕捉新生兒最柔軟的時光</p>
                        <Link to="/baby" className="btn" style={{ backgroundColor: '#EADBC8', color: '#5C5247' }}>探索新生兒攝影</Link>
                    </div>
                </div>
                <div className="hero-half hero-professional">
                    <div className="hero-content">
                        <h1>刻劃淬鍊的專業</h1>
                        <p>打造極具氣場的高階形象</p>
                        <Link to="/professional" className="btn" style={{ backgroundColor: '#2A2A2A' }}>打造專業形象</Link>
                    </div>
                </div>
            </section>

            <section className="about-preview">
                <div className="container about-grid">
                    <div className="about-text-content">
                        <p className="subtitle">EXPERIENCE & PASSION</p>
                        <h2>
                            不論活潑的寶貝或高效的主管，<br />
                            我都能精準定格你的完美瞬間。
                        </h2>
                        <p className="about-description">
                            攝影不只是按下快門，更是細膩捕捉每一份情感與氣場的過程。擁有超過 10 年的專業拍攝經驗，我致力於打造最舒適、自然且高效率的拍攝體驗，讓你在鏡頭前展現最真實、最自信的模樣。
                        </p>
                    </div>

                    <div className="contact-cards">
                        <a href="mailto:your.email@gmail.com" className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="contact-info">
                                <h3>Email-聯繫</h3>
                                <p>baa3399@gmail.com</p>
                            </div>
                        </a>

                        <a href="tel:+886912345678" className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div className="contact-info">
                                <h3>電話專線</h3>
                                <p>0955-385-829</p>
                            </div>
                        </a>

                        <a href="https://line.me/ti/p/~yourlineid" target="_blank" rel="noreferrer" className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <div className="contact-info">
                                <h3>官方 LINE</h3>
                                <p>@yourlineid</p>
                            </div>
                        </a>

                        <a href="https://maps.app.goo.gl/youraddress" target="_blank" rel="noreferrer" className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="contact-info">
                                <h3>攝影棚位置</h3>
                                <p>新北市樹林區</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
