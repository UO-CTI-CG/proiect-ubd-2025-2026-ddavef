import LanguageSelect from './LanguageSelect';

export default function NavBar({ lang, setLang, user, onLogout, onShowAuth, t }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent mb-4">
      <div className="container-fluid px-0">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#home">
          <div className="brand-mark" aria-hidden />
          <span className="fw-bold">{t('brand')}</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="#home">{t('home')}</a></li>
            <li className="nav-item"><a className="nav-link" href="#vehicles">{t('vehiclesTitle')}</a></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-white-50 small">{t('loggedInAs')} {user.username}</span>
                <button className="btn btn-light" onClick={onLogout}>{t('logout')}</button>
              </>
            ) : (
              <button className="btn btn-light" onClick={onShowAuth}>{t('loginCta')}</button>
            )}
            <LanguageSelect lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>
    </nav>
  );
}
