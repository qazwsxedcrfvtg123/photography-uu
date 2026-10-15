import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom';
import {
    LogOut,
    LayoutDashboard,
    Settings,
    Camera,
    Image as ImageIcon,
    KeyRound,
    UserPlus,
    X,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { api, authApi } from '../utils/api';

import './AdminLayout.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const isAuthenticated = accessToken !== null && accessToken !== '';

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'password' | 'admin' | null
    const dropdownRef = useRef(null);

    // 點擊選單外部自動關閉下拉選單
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = async () => {
        try {
            await api.get('api/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
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
            </aside>

            {/* Main Content */}
            <main className="admin-main-content">
                <header className="admin-header">
                    <h2 className="admin-header-title">管理首頁 / Dashboard</h2>
                    <div className="admin-header-actions">
                        <span className="admin-user-greeting">
                            Welcome, {localStorage.getItem('adminUsername') || 'Administrator'}
                        </span>

                        {/* 下拉選單區域 */}
                        <div className="admin-dropdown-container" ref={dropdownRef}>
                            <button
                                className={`admin-settings-btn ${isDropdownOpen ? 'active' : ''}`}
                                title="系統設定"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                            >
                                <Settings size={18} />
                            </button>

                            {isDropdownOpen && (
                                <div className="admin-dropdown-menu">
                                    <div className="admin-dropdown-header">系統管理</div>
                                    <button
                                        className="admin-dropdown-item"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setActiveModal('password');
                                        }}
                                    >
                                        <KeyRound size={16} />
                                        <span>修改密碼</span>
                                    </button>
                                    <button
                                        className="admin-dropdown-item"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setActiveModal('admin');
                                        }}
                                    >
                                        <UserPlus size={16} />
                                        <span>新增管理員</span>
                                    </button>
                                    <div className="admin-dropdown-divider" />
                                    <button className="admin-dropdown-item text-danger" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        <span>登出</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>

            {/* 修改密碼 Modal */}
            {activeModal === 'password' && (
                <ChangePasswordModal onClose={() => setActiveModal(null)} />
            )}

            {/* 新增管理員 Modal */}
            {activeModal === 'admin' && (
                <AddAdminModal onClose={() => setActiveModal(null)} />
            )}
        </div>
    );
}

// ----------------- 修改密碼彈窗 -----------------
function ChangePasswordModal({ onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError('新密碼長度至少需 6 個字元');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('兩次輸入的新密碼不一致');
            return;
        }

        setLoading(true);
        try {
            await authApi.changePassword({ oldPassword, newPassword });
            setSuccess('密碼修改成功！');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Change password error:', err);
            setError(err.response?.data?.message || err.message || '修改密碼失敗，請確認舊密碼是否正確');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-card">
                <div className="admin-modal-header">
                    <div className="admin-modal-title-wrap">
                        <KeyRound size={20} className="text-primary" />
                        <h3>修改密碼</h3>
                    </div>
                    <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-modal-body">
                        {error && (
                            <div className="admin-alert admin-alert-danger">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="admin-alert admin-alert-success">
                                <CheckCircle2 size={16} />
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="admin-form-group">
                            <label>目前密碼</label>
                            <input
                                type="password"
                                className="admin-input"
                                placeholder="請輸入舊密碼"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>新密碼</label>
                            <input
                                type="password"
                                className="admin-input"
                                placeholder="請輸入至少 6 碼新密碼"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>確認新密碼</label>
                            <input
                                type="password"
                                className="admin-input"
                                placeholder="再次輸入新密碼"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-modal-footer">
                        <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={loading}>
                            取消
                        </button>
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? '處理中...' : '確認修改'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ----------------- 新增管理員彈窗 -----------------
function AddAdminModal({ onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('ADMIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('密碼長度至少需 6 個字元');
            return;
        }

        setLoading(true);
        try {
            await authApi.addAdmin({ username, password, email, role });
            setSuccess(`管理員「${username}」新增成功！`);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Add admin error:', err);
            setError(err.response?.data?.message || err.message || '新增失敗，請檢查帳號是否已存在');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-card">
                <div className="admin-modal-header">
                    <div className="admin-modal-title-wrap">
                        <UserPlus size={20} className="text-primary" />
                        <h3>新增管理員</h3>
                    </div>
                    <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="admin-modal-body">
                        {error && (
                            <div className="admin-alert admin-alert-danger">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="admin-alert admin-alert-success">
                                <CheckCircle2 size={16} />
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="admin-form-group">
                            <label>管理員帳號</label>
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="請輸入帳號"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>初始密碼</label>
                            <input
                                type="password"
                                className="admin-input"
                                placeholder="請輸入預設密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>電子信箱</label>
                            <input
                                type="email"
                                className="admin-input"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>角色權限</label>
                            <select
                                className="admin-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="ADMIN">一般管理員 (ADMIN)</option>
                                <option value="SUPER_ADMIN">超級管理員 (SUPER_ADMIN)</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-modal-footer">
                        <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={loading}>
                            取消
                        </button>
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? '建立中...' : '確認建立'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
