import { useState } from 'react';
import './Booking.css';

export default function Booking() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        service: '',
        dateRange: '',
        name: '',
        contact: '',
        notes: '',
        deposit: ''
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        // 替換為你在 Formspree 上建立的專屬表單 URL
        const formspreeEndpoint = 'https://formspree.io/f/xbdzjqav';

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(true);
            } else {
                setSubmitError('發生錯誤，請稍後再試，或直接透過 IG 聯繫我們。');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError('網路連線發生問題，請稍後再試。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="booking-page container">
            <div className="booking-card">
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                <div className="booking-content">
                    {step === 1 && (
                        <div className="step step-1 fade-in">
                            <h2>1. 您希望預約什麼服務？</h2>
                            <p className="step-desc">為確保拍攝品質，請先告訴我們您的需求。</p>

                            <div className="service-options">
                                <button
                                    className={`option-card ${formData.service === 'family' ? 'selected' : ''}`}
                                    onClick={() => { setFormData({ ...formData, service: 'family' }); handleNext(); }}
                                >
                                    <h3>溫馨家庭寫真</h3>
                                    <p>適合寶寶週歲、全家福紀錄</p>
                                </button>
                                <button
                                    className={`option-card ${formData.service === 'professional' ? 'selected' : ''}`}
                                    onClick={() => { setFormData({ ...formData, service: 'professional' }); handleNext(); }}
                                >
                                    <h3>專業形象攝影</h3>
                                    <p>高階主管、創業家個人品牌</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step step-2 fade-in">
                            <h2>2. 期待的拍攝時間？</h2>
                            <p className="step-desc">請選擇您希望的大致檔期，我們將再與您核對確切時間。</p>

                            <div className="date-options">
                                {['1 個月內', '1~3 個月', '3 個月以上 (提早卡位)'].map((date) => (
                                    <button
                                        key={date}
                                        className={`date-btn ${formData.dateRange === date ? 'selected' : ''}`}
                                        onClick={() => setFormData({ ...formData, dateRange: date })}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>

                            <div className="step-actions">
                                <button className="btn outline" onClick={handlePrev}>上一步</button>
                                <button
                                    className="btn"
                                    disabled={!formData.dateRange}
                                    onClick={handleNext}
                                >
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <form className="step step-3 fade-in" onSubmit={handleSubmit}>
                            <h2>3. 聯絡資訊</h2>
                            <p className="step-desc">快完成了！請留下您的聯絡方式。</p>

                            <div className="input-group">
                                <input
                                    type="text"
                                    required
                                    placeholder="您的姓名"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    required
                                    placeholder="Line ID 或 手機號碼"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <textarea
                                    placeholder="其他備註 (例如：希望在某個特定棚拍、或有任何想法可填寫)"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="step-actions">
                                <button type="button" className="btn outline" onClick={handlePrev} disabled={isSubmitting}>上一步</button>
                                <button
                                    type="submit"
                                    className="btn submit-btn"
                                    disabled={!formData.name || !formData.contact || isSubmitting}
                                >
                                    {isSubmitting ? '傳送中...' : '送出預約'}
                                </button>
                            </div>
                            {submitError && <p className="error-message" style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{submitError}</p>}
                        </form>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content fade-in">
                        <h2>🎉 預約已送出！</h2>
                        <p>我們將盡快與您聯繫確認。</p>
                        <div className="modal-details">
                            <p><strong>服務：</strong>{formData.service === 'family' ? '溫馨家庭寫真' : '專業形象攝影'}</p>
                            <p><strong>姓名：</strong>{formData.name}</p>
                            <p><strong>聯絡方式：</strong>{formData.contact}</p>
                            {formData.notes && <p><strong>備註：</strong>{formData.notes}</p>}
                        </div>
                        <button
                            className="btn"
                            onClick={() => {
                                setShowModal(false);
                                setStep(1);
                                setFormData({ service: '', dateRange: '', name: '', contact: '', notes: '', deposit: '' });
                            }}
                        >
                            確定並返回
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
