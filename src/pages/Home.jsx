import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className="home-container">
            <section className="hero-split">
                <div className="hero-half hero-family">
                    <div className="hero-content">
                        <h1>凝結純粹的溫度</h1>
                        <p>紀錄寶寶與家人的每個溫馨瞬間</p>
                        <Link to="/family" className="btn">探索家庭寫真</Link>
                    </div>
                </div>
                <div className="hero-half hero-professional">
                    <div className="hero-content">
                        <h1>刻劃淬鍊的專業</h1>
                        <p>打造極具氣場的高階主管與團隊形象</p>
                        <Link to="/professional" className="btn" style={{ backgroundColor: '#2A2A2A' }}>打造專業形象</Link>
                    </div>
                </div>
            </section>

            <section className="about-preview container">
                <div className="about-text">
                    <p className="subtitle">10+ 年專業經驗</p>
                    <h2>不論是難以控制的嬰兒，<br />還是時間寶貴的高階主管，<br />我都能精準捕捉最佳狀態。</h2>
                </div>
            </section>
        </div>
    );
}
