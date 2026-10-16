import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Camera, Mail, X, CheckCircle2, AlertCircle, HelpCircle, KeyRound, ArrowLeft } from 'lucide-react';
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

// ----------------- 忘記密碼彈窗（三部曲：送驗證碼 -> 驗證碼校驗 -> 重設密碼） -----------------
function ForgotPasswordModal({ onClose }) {
    const [step, setStep] = useState(1); // 1: 寄送驗證碼, 2: 驗證碼校驗, 3: 輸入新密碼, 4: 完成
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 倒數計時器
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const parseError = (err, fallback) => {
        const data = err.response?.data;
        if (typeof data === 'string' && data.trim()) return data;
        return data?.message || err.message || fallback;
    };

    // 1. 發送重設驗證碼
    const handleSendCode = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        const cleanEmail = email.trim();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError('請輸入有效的電子信箱');
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.forgotPassword({ email: cleanEmail });
            setSuccess(res?.message || '若該信箱已註冊，我們將寄送重設密碼的驗證碼');
            setStep(2);
            setCountdown(60);
        } catch (err) {
            console.error('Send reset code error:', err);
            setError(parseError(err, '發送失敗，請稍後再試'));
        } finally {
            setLoading(false);
        }
    };

    // 2. 驗證驗證碼
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanCode = code.trim();
        if (!cleanCode) {
            setError('請輸入信件中的驗證碼');
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.verifyCode({ email: email.trim(), code: cleanCode });
            setSuccess(res?.message || '驗證成功，請設定新密碼');
            setStep(3);
        } catch (err) {
            console.error('Verify code error:', err);
            setError(parseError(err, '驗證碼錯誤或已過期'));
        } finally {
            setLoading(false);
        }
    };

    // 3. 重設密碼
    const handleResetPassword = async (e) => {
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
            const res = await authApi.resetPassword({
                email: email.trim(),
                code: code.trim(),
                newPassword,
            });
            setSuccess(res?.message || '密碼已重設，請使用新密碼登入');
            setStep(4);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(parseError(err, '重設失敗，請確認驗證碼是否正確'));
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
                        <h3>
                            重設密碼
                            {step <= 3 && (
                                <span className="admin-modal-step-tag">
                                    步驟 {step}/3
                                </span>
                            )}
                        </h3>
                    </div>
                    <button className="admin-login-modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="admin-login-modal-body">
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

                    {/* 步驟 1：輸入 Email 寄送驗證碼 */}
                    {step === 1 && (
                        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <p className="admin-login-modal-desc">
                                請輸入您註冊的電子信箱，系統將發送一組安全驗證碼至該信箱。
                            </p>
                            <div className="admin-input-group">
                                <label className="admin-input-label">電子信箱</label>
                                <div className="admin-input-wrapper">
                                    <div className="admin-input-icon">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        className="admin-input"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="admin-login-modal-footer">
                                <button
                                    type="button"
                                    className="admin-modal-btn-cancel"
                                    onClick={onClose}
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="admin-modal-btn-submit"
                                    disabled={loading || !email.trim()}
                                >
                                    {loading ? '發送中...' : '發送驗證碼'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 步驟 2：輸入收到的驗證碼 */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <p className="admin-login-modal-desc">
                                驗證碼已寄送至 <strong style={{ color: '#60a5fa' }}>{email}</strong>，請在下方輸入驗證碼。
                            </p>
                            <div className="admin-input-group">
                                <label className="admin-input-label">驗證碼 (Verification Code)</label>
                                <div className="admin-input-wrapper">
                                    <div className="admin-input-icon">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        placeholder="請輸入 6 位驗證碼"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="admin-resend-row">
                                <span>沒收到驗證碼？</span>
                                <button
                                    type="button"
                                    className="admin-resend-btn"
                                    disabled={countdown > 0 || loading}
                                    onClick={() => handleSendCode()}
                                >
                                    {countdown > 0 ? `重新發送 (${countdown}s)` : '重新發送驗證碼'}
                                </button>
                            </div>

                            <div className="admin-login-modal-footer">
                                <button
                                    type="button"
                                    className="admin-modal-btn-cancel"
                                    onClick={() => {
                                        setError('');
                                        setSuccess('');
                                        setStep(1);
                                    }}
                                >
                                    <ArrowLeft size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    更換信箱
                                </button>
                                <button
                                    type="submit"
                                    className="admin-modal-btn-submit"
                                    disabled={loading || !code.trim()}
                                >
                                    {loading ? '驗證中...' : '下一步：重設密碼'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 步驟 3：輸入新密碼 */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <p className="admin-login-modal-desc">
                                驗證通過！請輸入您欲設定的新密碼。
                            </p>
                            <div className="admin-input-group">
                                <label className="admin-input-label">新密碼</label>
                                <div className="admin-input-wrapper">
                                    <div className="admin-input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        className="admin-input"
                                        placeholder="至少 6 位字元"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="admin-input-group">
                                <label className="admin-input-label">確認新密碼</label>
                                <div className="admin-input-wrapper">
                                    <div className="admin-input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        className="admin-input"
                                        placeholder="請再次輸入新密碼"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-login-modal-footer">
                                <button
                                    type="button"
                                    className="admin-modal-btn-cancel"
                                    onClick={() => {
                                        setError('');
                                        setSuccess('');
                                        setStep(2);
                                    }}
                                >
                                    上一步
                                </button>
                                <button
                                    type="submit"
                                    className="admin-modal-btn-submit"
                                    disabled={loading || !newPassword || !confirmPassword}
                                >
                                    {loading ? '重設中...' : '確認變更密碼'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 步驟 4：完成 */}
                    {step === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '1rem 0' }}>
                            <p className="admin-login-modal-desc">
                                密碼重設已順利完成！請使用新密碼重新登入後台系統。
                            </p>
                            <div className="admin-login-modal-footer" style={{ justifyContent: 'center' }}>
                                <button
                                    type="button"
                                    className="admin-modal-btn-submit"
                                    onClick={onClose}
                                    style={{ width: '100%' }}
                                >
                                    前往登入
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
