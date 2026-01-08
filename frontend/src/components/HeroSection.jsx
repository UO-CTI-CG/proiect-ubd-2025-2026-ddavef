export default function HeroSection({ t }) {
  return (
    <div className="row align-items-center gy-4" id="home">
      <div className="col-lg-6 hero">
        <h1 className="display-5 fw-bold mb-3">{t('heroTitle')}</h1>
        <p className="fs-5 text-white-75 mb-4">{t('heroCopy')}</p>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <a className="btn btn-light btn-lg" href="#vehicles">{t('ctaBrowse')}</a>
        </div>
      </div>
    </div>
  );
}
