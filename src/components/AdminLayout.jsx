import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Camera, Image as ImageIcon } from 'lucide-react';
import { api } from '../utils/api';

import './AdminLayout.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    // Check if token exists in localStorage (using the new name)
    const accessToken = localStorage.getItem('accessToken');
    const isAuthenticated = accessToken !== null && accessToken !== '';

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = async () => {
        try {
            // 呼叫後端登出接口 (api 工具會自動帶上 accessToken)
            await api.get('api/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // 無論後端成功與否，前端都清除狀態並導回登入頁
            localStorage.clear();
            navigate('/admin/login');
        }
    };

    return (
        <div className="admin-layout-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1 className="admin-sidebar-title">
                        <strong>攝影</strong>後台系統
                    </h1>
                </div>

                <nav className="admin-sidebar-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={18} />
                        <span>首頁總覽</span>
                    </NavLink>
                    <NavLink to="/admin/photos" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <ImageIcon size={18} />
                        <span>圖片處理</span>
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} />
                        <span>登出系統</span>
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < main className="admin-main-content" >
                <header className="admin-header">
                    <h2 className="admin-header-title">管理首頁 / Dashboard</h2>
                    <div className="admin-header-actions">
                        <span className="admin-user-greeting">
                            Welcome, {localStorage.getItem('adminUsername') || 'Administrator'}
                        </span>
                        <button className="admin-settings-btn" title="系統設定">
                            <Settings size={18} />
                        </button>
                    </div>
                </header>

                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main >
        </div >
    );
}
