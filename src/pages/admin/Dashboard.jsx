import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Users, Calendar, UploadCloud } from 'lucide-react';

export default function Dashboard() {
    const [uploadFile, setUploadFile] = useState(null);
    const [category, setCategory] = useState('family');
    const [uploadMessage, setUploadMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);


    const [recentUploads, setRecentUploads] = useState([]);

    const handleUpload = async () => {
        if (!uploadFile) {
            setUploadMessage('請先選擇檔案');
            return;
        }

        const typeMap = {
            'family': 1,
            'baby': 2,
            'professional': 3,
            'wedding': 4,
            'common': 5
        };

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('category', category);
        formData.append('type', typeMap[category] || 5);

        try {
            setIsUploading(true);
            setUploadMessage('上傳中...');

            const response = await fetch('/photography-uu/api/uploadFiles', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`上傳失敗 ${response.status}`);
            const result = await response.json();
            setUploadMessage(`上傳成功：${result.fileUrl}`);

            setRecentUploads((prev) => [
                { id: Date.now(), fileName: uploadFile.name, category, status: '完成', url: result.url || '-', time: new Date().toLocaleString() },
                ...prev,
            ].slice(0, 6));
        } catch (error) {
            console.error(error);
            setUploadMessage(`上傳錯誤：${error.message}`);
            setRecentUploads((prev) => [
                { id: Date.now(), fileName: uploadFile.name, category, status: '失敗', url: '-', time: new Date().toLocaleString() },
                ...prev,
            ].slice(0, 6));
        } finally {
            setIsUploading(false);
            setUploadFile(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stats-box bg-info">
                    <p className="stats-label">未處理訂單</p>
                    <p className="stats-value">12</p>
                </div>
                <div className="stats-box bg-success">
                    <p className="stats-label">本週上傳數</p>
                    <p className="stats-value">27</p>
                </div>
                <div className="stats-box bg-warning">
                    <p className="stats-label">待確認客戶</p>
                    <p className="stats-value">4</p>
                </div>
            </div>

            <section className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">營收趨勢 (最近 7 天)</h3>
                </div>
                <div className="admin-card-body">
                    <div className="grid grid-cols-7 gap-2 h-36 items-end">
                        {[65, 48, 72, 55, 88, 93, 74].map((value, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-end gap-1">
                                <div className="w-full rounded-t-sm" style={{ height: `${value}%`, backgroundColor: '#007bff', opacity: 0.8 }} />
                                <span className="text-[10px] text-gray-500">{['一', '二', '三', '四', '五', '六', '日'][idx]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">快速圖片上傳</h3>
                </div>
                <div className="admin-card-body">
                    <div className="flex flex-col gap-4">
                        <div className="h-32 rounded border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-center p-4">
                            <div>
                                <UploadCloud className="mx-auto mb-2 text-gray-400" size={32} />
                                <p className="text-gray-600 font-semibold">拖放圖片到此或點擊選取</p>
                                <p className="text-xs text-gray-400 mt-1">支援 JPEG、PNG、WEBP (Max 10MB)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="admin-form-group">
                                <label className="text-xs font-bold text-gray-600 mb-1 block">照片分類</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="admin-select"
                                >
                                    <option value="family">Family（全家福）</option>
                                    <option value="baby">Baby（嬰兒）</option>
                                    <option value="professional">Professional（專業）</option>
                                    <option value="wedding">Wedding（婚紗）</option>
                                    <option value="common">Common（通用）</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="text-xs font-bold text-gray-600 mb-1 block">選擇檔案</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="admin-input"
                                />
                            </div>

                            <div className="admin-form-group flex items-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="admin-btn-primary w-full h-[38px]"
                                >
                                    {isUploading ? '上傳中...' : '開始上傳'}
                                </button>
                            </div>
                        </div>
                        {uploadMessage && (
                            <p className="text-sm text-danger mt-1">{uploadMessage}</p>
                        )}
                    </div>
                </div>
            </section>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <section className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">近期預約</h3>
                        <span className="badge bg-primary text-xs px-2 py-1 rounded">即時</span>
                    </div>
                    <div className="admin-card-body overflow-x-auto p-0">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-bottom">
                                <tr className="text-gray-500 text-xs uppercase">
                                    <th className="px-4 py-3">客戶</th>
                                    <th className="px-4 py-3">服務</th>
                                    <th className="px-4 py-3">日期</th>
                                    <th className="px-4 py-3">進度</th>
                                    <th className="px-4 py-3">操作</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {[
                                    { name: '王小明', service: '個人寫真', date: '2026-03-20', progress: 90 },
                                    { name: '李阿華', service: '全家福', date: '2026-03-25', progress: 65 },
                                    { name: '陳小姐', service: '婚紗攝影', date: '2026-04-02', progress: 45 },
                                    { name: '張先生', service: '寶寶攝影', date: '2026-04-12', progress: 25 },
                                    { name: '林小姐', service: '商業形象', date: '2026-04-17', progress: 10 },
                                ].map((booking, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold">{booking.name}</td>
                                        <td className="px-4 py-3">{booking.service}</td>
                                        <td className="px-4 py-3">{booking.date}</td>
                                        <td className="px-4 py-3">
                                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${booking.progress}%` }} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 text-xs font-bold">查看</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">近期上傳</h3>
                        <span className="text-xs text-muted">共 {recentUploads.length} 筆</span>
                    </div>
                    <div className="admin-card-body recent-upload-list max-h-[350px] overflow-y-auto">
                        {recentUploads.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">目前沒有上傳記錄</p>
                        ) : (
                            recentUploads.map((item) => (
                                <div key={item.id} className="border-bottom pb-3 mb-3 last:border-0 last:mb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-bold m-0">{item.fileName}</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === '完成' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{item.category} ・ {item.time}</span>
                                        <button onClick={() => setRecentUploads(p => p.filter(x => x.id !== item.id))} className="text-danger border-0 bg-transparent p-0">移除</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
