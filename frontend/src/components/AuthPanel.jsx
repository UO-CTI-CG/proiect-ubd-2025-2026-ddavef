import { useState } from 'react';

export default function AuthPanel({ t, onLogin, onRegister, loading, error }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onRegister({
        email,
        password,
        username: username || email.split('@')[0],
        full_name: fullName || username || email.split('@')[0],
      });
    }
  };

  return (
    <div className="glass-card p-4 mb-4">
      <div className="btn-group mb-3" role="group">
        <button className={`btn btn-outline-primary ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
          {t('loginTab')}
        </button>
        <button className={`btn btn-outline-primary ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
          {t('registerTab')}
        </button>
      </div>
      <form className="row g-3" onSubmit={submit}>
        {mode === 'register' && (
          <div className="col-md-6">
            <label className="form-label">{t('username')}</label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        )}
        {mode === 'register' && (
          <div className="col-md-6">
            <label className="form-label">{t('fullName')}</label>
            <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label">{t('email')}</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">{t('password')}</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="col-12"><div className="alert alert-danger mb-0">{error}</div></div>}
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading
              ? mode === 'login'
                ? t('loggingIn')
                : t('registering')
              : mode === 'login'
              ? t('login')
              : t('register')}
          </button>
        </div>
      </form>
    </div>
  );
}
