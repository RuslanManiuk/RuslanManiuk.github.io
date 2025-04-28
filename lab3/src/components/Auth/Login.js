import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Не вдалося увійти: ' + err.message);
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await googleLogin();
            navigate('/');
        } catch (err) {
            setError('Помилка входу через Google: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="auth-container">
            <h2>Вхід</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                />
                <button disabled={loading} type="submit">
                    Увійти
                </button>
            </form>
            <button disabled={loading} onClick={handleGoogleLogin} className="google-btn">
                Увійти через Google
            </button>
            <div className="auth-link">
                Немає акаунта? <Link to="/signup">Зареєструватися</Link>
            </div>
        </div>
    );
}