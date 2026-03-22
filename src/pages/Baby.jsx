import './Booking.css';

export default function Baby() {
    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p className="subtitle">NEWBORN COLLECTIONS</p>
                <h1>萌動初生的喜悅</h1>
                <p className="description" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    專注捕捉新生兒最柔軟、細膩的時光，為您的寶貝留下生命最初的珍貴紀錄。
                </p>
            </div>

            <div style={{ textAlign: 'center', padding: '4rem', background: '#F7F5F0', borderRadius: '24px' }}>
                <p>新生兒攝影作品集正在準備中...</p>
            </div>
        </div>
    );
}
