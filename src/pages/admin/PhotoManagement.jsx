import { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Filter, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export default function PhotoManagement() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const typeLabels = {
        1: 'Family（全家福）',
        2: 'Baby（嬰兒）',
        3: 'Professional（專業形象）',
        4: 'Wedding（婚紗攝影）',
        5: 'Others（其他）'
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const data = await api.get('api/photos/all');
            setPhotos(data);
        } catch (err) {
            console.error(err);
            setError('載入圖片失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (photo) => {
        if (!window.confirm(`確定要刪除圖片「${photo.fileName}」嗎？`)) return;
        try {
            // 根據後端提供的 @PostMapping("/deleteFiles") 與 @RequestParam("fileName")
            await api.post('api/photos/deleteFiles', null, {
                params: { fileName: photo.fileName }
            });
            // 刪除成功後重新抓取清單，確保佈局與資料完全同步
            await fetchPhotos();
        } catch (err) {
            console.error(err);
            alert('刪除失敗');
        }
    };

    // Group photos by type
    const groupedPhotos = photos.reduce((acc, photo) => {
        const type = photo.type || 5;
        if (!acc[type]) acc[type] = [];
        acc[type].push(photo);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                <p className="text-gray-500 font-medium">圖片載入中...</p>
            </div>
        );
    }

    return (
        <div className="photo-management-container space-y-10">
            <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">圖片管理系統</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        共計 {photos.length} 張圖片，依分類進行管理
                    </p>
                </div>
                <button
                    onClick={fetchPhotos}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                    <Filter size={16} /> 重新整理
                </button>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <span className="font-bold">！</span> {error}
                </div>
            )}

            {Object.keys(typeLabels).map(typeKey => {
                const categoryPhotos = groupedPhotos[typeKey] || [];
                return (
                    <section key={typeKey} className="admin-card overflow-hidden">
                        <div className="admin-card-header bg-gray-50/80 flex justify-between items-center py-4 px-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <div className="w-2 h-6 bg-blue-500 rounded-full" />
                                {typeLabels[typeKey]}
                                <span className="ml-2 text-xs font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">
                                    {categoryPhotos.length}
                                </span>
                            </h3>
                        </div>

                        <div className="admin-card-body p-6">
                            {categoryPhotos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <ImageIcon className="text-gray-300 mb-2" size={32} />
                                    <p className="text-sm text-gray-400">目前尚無此分類的圖片</p>
                                </div>
                            ) : (
                                <div className="photo-grid">
                                    {categoryPhotos.map((photo) => (
                                        <div key={photo.id} className="photo-grid-item">
                                            <div className="image-wrapper">
                                                <img
                                                    src={photo.fileUrl || photo.url}
                                                    alt={photo.fileName}
                                                />
                                                {/* Overlay Actions */}
                                                <div className="overlay">
                                                    <button
                                                        onClick={() => window.open(photo.fileUrl || photo.url, '_blank')}
                                                        className="view-btn"
                                                        title="查看大圖"
                                                    >
                                                        <ImageIcon size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(photo)}
                                                        className="delete-btn"
                                                        title="刪除"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="photo-info">
                                                <p className="photo-name" title={photo.fileName}>
                                                    {photo.fileName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
