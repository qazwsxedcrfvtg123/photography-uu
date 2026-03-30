import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Booking.css';

export default function Professional() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                // 打後端 API 請求專業形象照片 (type = 3)
                const data = await api.get('api/users/findPhotos', {
                    params: { types: 3 }
                });

                if (data && Array.isArray(data) && data.length > 0) {
                    setPhotos(data);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.warn('API 取得照片失敗或無資料，使用備用照片', error);
            }

            // 如果後端沒查到或出錯：使用本地 photos/professional 備用照片
            const fallbackCount = 6;
            const fallbackPhotos = Array.from({ length: fallbackCount }, (_, i) => ({
                fileUrl: `${import.meta.env.BASE_URL}photos/professional/${i + 1}.jpg`
            }));

            setPhotos(fallbackPhotos);
            setLoading(false);
        };

        fetchPhotos();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p className="subtitle">PROFESSIONAL COLLECTIONS</p>
                <h1>刻劃淬鍊的專業</h1>
                <p className="description" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    打造極具氣場的高階形象，展現您專職領域的自信與魅力。
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#F7F5F0', borderRadius: '24px' }}>
                    <p>照片載入中...</p>
                </div>
            ) : (
                <div className="photo-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {photos.map((photo, index) => (
                        <div key={index} style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            backgroundColor: '#EAE6DF',
                        }}>
                            <img
                                src={photo.fileUrl}
                                alt={`Professional ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
