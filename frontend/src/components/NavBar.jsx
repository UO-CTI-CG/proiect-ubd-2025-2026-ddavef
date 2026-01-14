import { useState } from 'react';
import LanguageSelect from './LanguageSelect';

export default function NavBar({
  lang,
  setLang,
  user,
  onLogout,
  onShowAuth,
  t,
  onShowAdmin,
  onShowHome,
  onShowRentals,
  onShowProfile,
  isAdminView,
  isProfileView,
  isRentalsView,
  showAdmin,
  themeMode,
  onThemeChange,
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen(prev => !prev);

  return (
    <nav className="navbar navbar-expand-lg bg-transparent mb-4 topbar-shell navbar-themed">
      <div className="container-fluid px-0">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#home" onClick={() => { onShowHome(); closeMenu(); }}>
          <div className="brand-mark" aria-hidden />
          <span className="fw-bold">{t('brand')}</span>
        </a>
        <button className="navbar-toggler" type="button" aria-controls="mainNav" aria-expanded={open} aria-label="Toggle navigation" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse collapse ${open ? 'show' : ''}`} id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className={`btn btn-link nav-link ${!isRentalsView && !isAdminView && !isProfileView ? 'active' : ''}`} type="button" onClick={() => { onShowHome(); closeMenu(); }}>
                {t('home')}
              </button>
            </li>
            <li className="nav-item">
              <button className={`btn btn-link nav-link ${isRentalsView ? 'active' : ''}`} type="button" onClick={() => { onShowRentals(); closeMenu(); }}>
                {t('rentalsNav')}
              </button>
            </li>
            {showAdmin && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" type="button" onClick={() => { onShowAdmin(); closeMenu(); }}>
                  {t('adminTools')}
                </button>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2 navbar-actions">
            {user ? (
              <>
                <span className="small navbar-text-muted">{t('loggedInAs')} {user.username}</span>
                <button className={`btn btn-outline-light btn-sm ${isProfileView ? 'active' : ''}`} onClick={() => { onShowProfile(); closeMenu(); }}>
                  {t('profile')}
                </button>
                {isAdminView && (
                  <button className="btn btn-outline-light btn-sm" onClick={() => { onShowHome(); closeMenu(); }}>{t('ctaBackHome')}</button>
                )}
                <button className="btn btn-light" onClick={() => { onLogout(); closeMenu(); }}>{t('logout')}</button>
              </>
            ) : (
              <button className="btn btn-light" onClick={() => { onShowAuth(); closeMenu(); }}>{t('loginCta')}</button>
            )}
            <div className="d-flex align-items-center gap-2 theme-select">
              <label className="small mb-0 navbar-text-muted">{t('theme')}</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 120 }}
                value={themeMode}
                onChange={e => { onThemeChange?.(e.target.value); }}
              >
                <option value="light">{t('themeLight')}</option>
                <option value="dark">{t('themeDark')}</option>
                <option value="auto">{t('themeAuto')}</option>
              </select>
            </div>
            <LanguageSelect lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>
    </nav>
  );
}
