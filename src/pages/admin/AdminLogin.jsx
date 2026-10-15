import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Camera, Mail, X, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { api, authApi } from '../../utils/api';

import './AdminLogin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');
    const [showForgotModal, setShowForgotModal] = useState(false);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    // Generate random captcha
    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        drawCaptcha(code);
    };

    const drawCaptcha = (code) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 140, 56);
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, 140, 56);

        // Draw text with variations
        ctx.font = 'bold 28px "Inter"';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < code.length; i++) {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
            ctx.save();
            ctx.translate(25 + i * 25, 28);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(code[i], -10, 0);
            ctx.restore();
        }

        // Add noise lines
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * 140, Math.random() * 56);
            ctx.lineTo(Math.random() * 140, Math.random() * 56);
            ctx.stroke();
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
            setError('驗證碼錯誤，請重新輸入');
            generateCaptcha();
            setCaptchaInput('');
            return;
        }

        try {
            const data = await api.post('api/auth/login', { username, password });

            // 儲存 JWT Tokens
            localStorage.setItem('accessToken', data.accessToken || data.token);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            console.log('Login Success, data:', data);

            // 順便把用戶名稱與權限也存起來，方便後台取用顯示
            if (data.username) localStorage.setItem('adminUsername', data.username);
            if (data.role) localStorage.setItem('adminRole', data.role);

            console.log('Navigating to /admin...');
            navigate('/admin');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message === '請求失敗 (401)' ? '帳號或密碼錯誤' : '帳號或密碼錯誤');
            generateCaptcha();
            setCaptchaInput('');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            {/* Left side - Image / Branding (Hidden on mobile) */}
            <div className="admin-login-visual">
                <div className="admin-login-overlay" />
                <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop"
                    alt="Photography Background"
                    className="admin-login-bg"
                />
                <div className="admin-login-overlay-side" />

                <div className="admin-visual-content">
                    <div className="admin-icon-container">
                        <Camera size={32} color="white" strokeWidth={1.5} />
                    </div>
                    <h1 className="admin-visual-title">
                        捕捉美好瞬間 <br />
                        <span className="admin-visual-title-sub">定格永恆回憶</span>
                    </h1>
                    <p className="admin-visual-text">
                        專業攝影團隊專屬後台系統。提供您最安全、高效的作品集與預約管理體驗。
                    </p>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="admin-login-form-container">
                {/* Ambient background glows for the right side */}
                <div className="glow-blue" />
                <div className="glow-purple" />

                <div className="admin-form-wrapper">
                    {/* Header */}
                    <div className="admin-form-header">
                        <div className="admin-mobile-icon">
                            <Camera size={28} color="#f4f4f5" strokeWidth={1.5} />
                        </div>
                        <h2 className="admin-form-title">歡迎回來</h2>
                        <p className="admin-form-subtitle">請登入您的管理員帳號以繼續</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="admin-error-box">
                            <div className="admin-error-icon-bg">
                                <Shield size={16} />
                            </div>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="admin-input-group">
                            <label className="admin-input-label">使用者帳號</label>
                            <div className="admin-input-wrapper">
                                <div className="admin-input-icon">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="admin-input"
                                    placeholder="請輸入管理員帳號"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="admin-input-group">
                            <div className="admin-label-row">
                                <label className="admin-input-label">登入密碼</label>
                                <button
                                    type="button"
                                    className="admin-forgot-btn"
                                    onClick={() => setShowForgotModal(true)}
                                >
                                    忘記密碼？
                                </button>
                            </div>
                            <div className="admin-input-wrapper">
                                <div className="admin-input-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="admin-input"
                                    placeholder="輸入密碼"
                                    required
                                />
                            </div>
                        </div>

                        {/* Captcha Input */}
                        <div className="admin-input-group">
                            <label className="admin-input-label">圖形驗證碼</label>
                            <div className="admin-captcha-wrapper">
                                <input
                                    type="text"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    className="admin-captcha-input"
                                    placeholder="驗證碼"
                                    maxLength={4}
                                    required
                                />
                                <div
                                    className="admin-captcha-box"
                                    onClick={generateCaptcha}
                                    title="點擊更換驗證碼"
                                >
                                    <div className="admin-captcha-hover-text">點擊更換</div>
                                    <canvas ref={canvasRef} width="140" height="56" className="admin-captcha-canvas" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="admin-submit-btn">
                            登入系統
                        </button>
                    </form>

                    {/* Footer Text */}
                    <div className="admin-footer">
                        <p>&copy; 2026 攝影團隊後台系統. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* 忘記密碼 Modal */}
            {showForgotModal && (
                <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
            )}
        </div>
    );
}

// ----------------- 忘記密碼彈窗 -----------------
function ForgotPasswordModal({ onClose }) {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!identifier.trim()) {
            setError('請輸入註冊的帳號或電子信箱');
            return;
        }

        setLoading(true);
        try {
            // 打後端忘記密碼 API
            const isEmail = identifier.includes('@');
            await authApi.forgotPassword({
                email: isEmail ? identifier.trim() : undefined,
                username: !isEmail ? identifier.trim() : undefined,
            });

            setSuccess('密碼重設指引已寄送！請前往您的信箱查看確認信。');
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.response?.data?.message || err.message || '發送失敗，請確認該帳號或信箱是否存在');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-modal-overlay">
            <div className="admin-login-modal-card">
                <div className="admin-login-modal-header">
                    <div className="admin-login-modal-title">
                        <HelpCircle size={20} color="#60a5fa" />
                        <h3>重設密碼</h3>
                    </div>
                    <button className="admin-login-modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleForgotSubmit} className="admin-login-modal-body">
                    <p className="admin-login-modal-desc">
                        請輸入您的管理員帳號或註冊 Email，系統將向您的信箱發送重設密碼的驗證連結。
                    </p>

                    {error && (
                        <div className="admin-login-modal-alert danger">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="admin-login-modal-alert success">
                            <CheckCircle2 size={16} />
                            <span>{success}</span>
                        </div>
                    )}

                    {!success && (
                        <div className="admin-input-group">
                            <label className="admin-input-label">帳號或電子信箱</label>
                            <div className="admin-input-wrapper">
                                <div className="admin-input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="admin-input"
                                    placeholder="admin 或 admin@example.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="admin-login-modal-footer">
                        <button
                            type="button"
                            className="admin-modal-btn-cancel"
                            onClick={onClose}
                        >
                            關閉
                        </button>
                        {!success && (
                            <button
                                type="submit"
                                className="admin-modal-btn-submit"
                                disabled={loading}
                            >
                                {loading ? '傳送中...' : '寄送重設信'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
