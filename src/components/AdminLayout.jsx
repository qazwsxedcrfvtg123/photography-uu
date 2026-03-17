import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Camera } from 'lucide-react';

import './AdminLayout.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    // Simple check for token in localStorage
    const isAuthenticated = localStorage.getItem('adminToken') === 'authenticated';

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1 className="admin-sidebar-title">
                        <Camera size={24} color="#a1a1aa" />
                        攝影後台系統
                    </h1>
                </div>

                <nav className="admin-sidebar-nav">
                    <a href="/admin" className="admin-nav-item active">
                        <LayoutDashboard size={18} className="admin-nav-icon" />
                        <span>首頁總覽</span>
                    </a>
                    {/* Add more links here later */}
                </nav>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} className="admin-nav-icon" />
                        <span>登出系統</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                <header className="admin-header">
                    <h2 className="admin-header-title">管理介面</h2>
                    <div className="admin-header-actions">
                        <span className="admin-user-greeting">管理者，您好</span>
                        <button className="admin-settings-btn" title="系統設定">
                            <Settings size={18} />
                        </button>
                    </div>
                </header>

                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
