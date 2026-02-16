import { useContext } from 'react';
import ToastContext from '../../store/ToastContext';

export default function Toast() {
    const { toasts, removeToast } = useContext(ToastContext);

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className={`toast toast-${toast.type}`}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className="toast-content">
                        {toast.type === 'success' && <span className="toast-icon">✓</span>}
                        {toast.type === 'error' && <span className="toast-icon">✕</span>}
                        {toast.type === 'info' && <span className="toast-icon">ℹ</span>}
                        <p className="toast-message">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
