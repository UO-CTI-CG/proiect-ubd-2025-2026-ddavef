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
  return (
    <nav className="navbar navbar-expand-lg bg-transparent mb-4 topbar-shell navbar-themed">
      <div className="container-fluid px-0">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#home" onClick={onShowHome}>
          <div className="brand-mark" aria-hidden />
          <span className="fw-bold">{t('brand')}</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className={`btn btn-link nav-link ${!isRentalsView && !isAdminView && !isProfileView ? 'active' : ''}`} type="button" onClick={onShowHome}>
                {t('home')}
              </button>
            </li>
            <li className="nav-item">
              <button className={`btn btn-link nav-link ${isRentalsView ? 'active' : ''}`} type="button" onClick={onShowRentals}>
                {t('rentalsNav')}
              </button>
            </li>
            {showAdmin && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" type="button" onClick={onShowAdmin}>
                  {t('adminTools')}
                </button>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2 navbar-actions">
            {user ? (
              <>
                <span className="small navbar-text-muted">{t('loggedInAs')} {user.username}</span>
                <button className={`btn btn-outline-light btn-sm ${isProfileView ? 'active' : ''}`} onClick={onShowProfile}>
                  {t('profile')}
                </button>
                {isAdminView && (
                  <button className="btn btn-outline-light btn-sm" onClick={onShowHome}>{t('ctaBackHome')}</button>
                )}
                <button className="btn btn-light" onClick={onLogout}>{t('logout')}</button>
              </>
            ) : (
              <button className="btn btn-light" onClick={onShowAuth}>{t('loginCta')}</button>
            )}
            <div className="d-flex align-items-center gap-2 theme-select">
              <label className="small mb-0 navbar-text-muted">{t('theme')}</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 120 }}
                value={themeMode}
                onChange={e => onThemeChange?.(e.target.value)}
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
