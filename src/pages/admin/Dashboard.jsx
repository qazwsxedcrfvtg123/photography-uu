import { Link } from 'react-router-dom';
import { Camera, Image, Users, Calendar } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { title: '總作品數', value: '142', icon: <Image className="w-8 h-8" />, trend: '+12% 本月', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-600', iconColor: 'text-blue-600' },
        { title: '本月預約', value: '24', icon: <Calendar className="w-8 h-8" />, trend: '+5% 相比上月', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-600', iconColor: 'text-green-600' },
        { title: '總服務客戶', value: '891', icon: <Users className="w-8 h-8" />, trend: '穩定成長', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-600', iconColor: 'text-purple-600' },
        { title: '未發布草稿', value: '5', icon: <Camera className="w-8 h-8" />, trend: '需要檢閱', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-600', iconColor: 'text-orange-600' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">儀表板總覽</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.bgColor} border-2 ${stat.borderColor} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 bg-white rounded-lg ${stat.iconColor}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">{stat.title}</h3>
                            <p className={`text-4xl font-bold mb-3 ${stat.textColor}`}>{stat.value}</p>
                            <p className={`text-sm font-medium ${stat.textColor}`}>{stat.trend}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mt-8">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">最近預約</h3>
                    <p className="text-gray-500 text-sm mt-1">顯示最新的預約申請</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-gray-700 text-sm font-bold uppercase tracking-wide">客戶名稱</th>
                                <th className="px-6 py-4 text-gray-700 text-sm font-bold uppercase tracking-wide">預約服務</th>
                                <th className="px-6 py-4 text-gray-700 text-sm font-bold uppercase tracking-wide">日期</th>
                                <th className="px-6 py-4 text-gray-700 text-sm font-bold uppercase tracking-wide">狀態</th>
                                <th className="px-6 py-4 text-gray-700 text-sm font-bold uppercase tracking-wide">操作</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { name: '王小明', service: '個人寫真', date: '2026-03-20', status: '已確認' },
                                { name: '李阿華', service: '全家福', date: '2026-03-25', status: '待確認' },
                                { name: '陳小姐', service: '婚紗攝影', date: '2026-04-02', status: '已確認' },
                            ].map((booking, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                                    <td className="px-6 py-5 text-gray-900 font-semibold">{booking.name}</td>
                                    <td className="px-6 py-5 text-gray-600">{booking.service}</td>
                                    <td className="px-6 py-5 text-gray-600">{booking.date}</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${booking.status === '已確認' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                            檢視詳情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
