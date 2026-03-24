import { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Filter, Loader2 } from 'lucide-react';

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
            const response = await fetch(import.meta.env.BASE_URL + 'api/photos/all');
            if (!response.ok) throw new Error('無法獲取圖片列表');
            const data = await response.json();
            setPhotos(data);
        } catch (err) {
            console.error(err);
            setError('載入圖片失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('確定要刪除這張圖片嗎？')) return;
        try {
            const response = await fetch(import.meta.env.BASE_URL + `api/photos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (response.ok) {
                setPhotos(photos.filter(p => p.id !== id));
            } else {
                alert('刪除失敗');
            }
        } catch (err) {
            console.error(err);
            alert('系統錯誤');
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {categoryPhotos.map((photo) => (
                                        <div key={photo.id} className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="aspect-square w-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={photo.fileUrl || photo.url}
                                                    alt={photo.fileName}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => window.open(photo.fileUrl || photo.url, '_blank')}
                                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="查看大圖"
                                                >
                                                    <ImageIcon size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(photo.id)}
                                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="刪除"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="p-2">
                                                <p className="text-[10px] text-gray-400 truncate text-center" title={photo.fileName}>
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
