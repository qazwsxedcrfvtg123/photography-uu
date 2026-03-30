import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Booking.css';

export default function Baby() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                // 透過封裝好的 api 發送請求 (會自動處理 basePath /photography-uu/ 並被 vite proxy 攔截)
                const data = await api.get('api/users/findPhotos', {
                    params: { types: 2 }
                });

                // utils/api.js 已經把 response.data 抽出來回傳了
                if (data && Array.isArray(data) && data.length > 0) {
                    setPhotos(data);
                    setLoading(false);
                    return; // 成功取得後端資料
                }
            } catch (error) {
                console.warn('API 取得照片失敗或無資料，使用備用照片', error);
            }

            // 如果後端沒查到或出錯：使用本地 photos/baby 備用照片
            const fallbackCount = 6; // 修改這裡的數字就能增加或減少備用照片的數量
            const fallbackPhotos = Array.from({ length: fallbackCount }, (_, i) => ({
                fileUrl: `${import.meta.env.BASE_URL}photos/baby/${i + 1}.jpg`
            }));

            setPhotos(fallbackPhotos);
            setLoading(false);
        };

        fetchPhotos();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p className="subtitle">NEWBORN COLLECTIONS</p>
                <h1>萌動初生的喜悅</h1>
                <p className="description" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    專注捕捉新生兒最柔軟、細膩的時光，為您的寶貝留下生命最初的珍貴紀錄。
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
                                alt={`Baby ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                onError={(e) => { e.target.style.display = 'none'; }} // 如果連備用圖都沒有就隱藏
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
