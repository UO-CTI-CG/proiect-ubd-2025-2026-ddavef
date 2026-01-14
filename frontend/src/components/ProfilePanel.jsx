import { useEffect, useState } from 'react';

export default function ProfilePanel({ t, user, apiRoot, token, onUpdated, onBack, isAdmin }) {
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
    setUsername(user?.username || '');
    setFullName(user?.full_name || '');
  }, [user]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const submitProfile = async e => {
    e.preventDefault();
    if (isAdmin) {
      setMessage(t('adminProfileLocked'));
      return;
    }
    setMessage('');
    setLoadingProfile(true);
    try {
      const res = await fetch(`${apiRoot}/users/me`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          email,
          username,
          full_name: fullName,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || t('profileError'));
      }
      setMessage(t('profileSaved'));
      onUpdated?.();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const submitPassword = async e => {
    e.preventDefault();
    if (isAdmin) {
      setPasswordMessage(t('adminProfileLocked'));
      return;
    }
    setPasswordMessage('');
    setLoadingPassword(true);
    try {
      const res = await fetch(`${apiRoot}/users/me/password`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || t('profileError'));
      }
      setPasswordMessage(t('passwordSaved'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMessage(err.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="section-label">{t('profileTitle')}</div>
          <h5 className="mb-1 text-white">{t('profileTitle')}</h5>
          <p className="text-muted mb-0 small">{t('profileDescription')}</p>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={onBack}>{t('ctaBackHome')}</button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <h6 className="text-white mb-2">{t('profileDetails')}</h6>
          <form className="row g-3" onSubmit={submitProfile}>
            <div className="col-12">
              <label className="form-label">{t('email')}</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required disabled={isAdmin} />
            </div>
            <div className="col-12">
              <label className="form-label">{t('username')}</label>
              <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required disabled={isAdmin} />
            </div>
            <div className="col-12">
              <label className="form-label">{t('fullName')}</label>
              <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} disabled={isAdmin} />
            </div>
            {message && (
              <div className="col-12">
                <div className="alert alert-info mb-0">{message}</div>
              </div>
            )}
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-primary" type="submit" disabled={loadingProfile || isAdmin}>
                {loadingProfile ? t('renting') : t('updateProfile')}
              </button>
            </div>
          </form>
        </div>

        <div className="col-12 col-lg-6">
          <h6 className="text-white mb-2">{t('updatePassword')}</h6>
          <form className="row g-3" onSubmit={submitPassword}>
            <div className="col-12">
              <label className="form-label">{t('currentPassword')}</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                disabled={isAdmin}
              />
            </div>
            <div className="col-12">
              <label className="form-label">{t('newPassword')}</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={isAdmin}
              />
            </div>
            {passwordMessage && (
              <div className="col-12">
                <div className="alert alert-info mb-0">{passwordMessage}</div>
              </div>
            )}
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-outline-light" type="submit" disabled={loadingPassword || isAdmin}>
                {loadingPassword ? t('renting') : t('updatePassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isAdmin && (
        <div className="alert alert-warning mt-3 mb-0">{t('adminProfileLocked')}</div>
      )}
    </div>
  );
}
