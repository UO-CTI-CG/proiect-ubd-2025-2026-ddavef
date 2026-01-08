export default function LanguageSelect({ lang, setLang }) {
  return (
    <select
      className="form-select form-select-sm w-auto bg-transparent text-white border-light"
      value={lang}
      onChange={e => setLang(e.target.value)}
      aria-label="Language selector"
    >
      <option value="en">English</option>
      <option value="ro">Romana</option>
    </select>
  );
}
