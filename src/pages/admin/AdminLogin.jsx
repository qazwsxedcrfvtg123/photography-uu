import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Camera } from 'lucide-react';

import './AdminLogin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');
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
            // 加上 base path 讓代理能正確捕捉並轉發
            const response = await fetch(import.meta.env.BASE_URL + 'api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();

                // 儲存真正的 JWT Token
                localStorage.setItem('adminToken', data.token || 'authenticated');

                // 順便把用戶名稱與權限也存起來，方便後台取用顯示
                if (data.username) localStorage.setItem('adminUsername', data.username);
                if (data.role) localStorage.setItem('adminRole', data.role);

                navigate('/admin');
            } else {
                setError('帳號或密碼錯誤');
                generateCaptcha();
                setCaptchaInput('');
                setPassword('');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('系統發生錯誤，請稍後再試');
            generateCaptcha();
            setCaptchaInput('');
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
                                    type="password"
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
                            <label className="admin-input-label">登入密碼</label>
                            <div className="admin-input-wrapper">
                                <div className="admin-input-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
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
        </div>
    );
}
