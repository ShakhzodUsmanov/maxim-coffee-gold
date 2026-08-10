/* ======================================
   MAXIM COFFEE — I18N Engine
   Loads the per-language dictionaries registered on window.MAXIM_I18N
   (see ru.js / uz.js / en.js) and swaps the page copy in place.

   Markup contract:
     data-i18n="key.path"            → element.textContent
     data-i18n-html="key.path"       → element.innerHTML (dictionary may hold <br>, <strong>)
     data-i18n-alt / -aria-label /
     data-i18n-title / -placeholder  → matching attribute
     [data-lang="ru|uz|en"]          → clickable language button

   The brand name (Maxim Coffee / MAXIM / MAXKOFF) carries no data-i18n
   attribute anywhere, so it always stays untranslated.
   ====================================== */

(function () {
  'use strict';

  const SUPPORTED = ['ru', 'uz', 'en'];
  const FALLBACK = 'ru';
  const STORAGE_KEY = 'maxim-coffee-lang';

  const ATTR_KEYS = {
    'data-i18n-alt': 'alt',
    'data-i18n-aria-label': 'aria-label',
    'data-i18n-title': 'title',
    'data-i18n-placeholder': 'placeholder'
  };

  const dicts = window.MAXIM_I18N || {};

  // ─── Helpers ───────────────────────────
  function lookup(dict, path) {
    return path.split('.').reduce(function (acc, part) {
      return acc && typeof acc === 'object' ? acc[part] : undefined;
    }, dict);
  }

  function translate(path, lang) {
    let value = lookup(dicts[lang], path);
    if (value === undefined) value = lookup(dicts[FALLBACK], path);
    return typeof value === 'string' ? value : undefined;
  }

  function normalize(lang) {
    if (!lang) return null;
    const code = String(lang).toLowerCase().slice(0, 2);
    return SUPPORTED.indexOf(code) !== -1 ? code : null;
  }

  function stored() {
    try {
      return normalize(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function remember(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* private mode / storage disabled — the choice just won't persist */
    }
  }

  function detect() {
    const candidates = navigator.languages || [navigator.language];
    for (let i = 0; i < candidates.length; i++) {
      const code = normalize(candidates[i]);
      if (code) return code;
    }
    return FALLBACK;
  }

  // ─── Apply a language to the document ───
  function apply(lang) {
    if (!dicts[lang]) lang = FALLBACK;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const value = translate(el.getAttribute('data-i18n'), lang);
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const value = translate(el.getAttribute('data-i18n-html'), lang);
      if (value !== undefined) el.innerHTML = value;
    });

    Object.keys(ATTR_KEYS).forEach(function (dataAttr) {
      document.querySelectorAll('[' + dataAttr + ']').forEach(function (el) {
        const value = translate(el.getAttribute(dataAttr), lang);
        if (value !== undefined) el.setAttribute(ATTR_KEYS[dataAttr], value);
      });
    });

    const title = translate('meta.title', lang);
    if (title) document.title = title;

    const description = translate('meta.description', lang);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (description && metaDesc) metaDesc.setAttribute('content', description);

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('maxim:languagechange', { detail: { lang: lang } }));
  }

  function setLanguage(lang) {
    const code = normalize(lang) || FALLBACK;
    remember(code);
    apply(code);
  }

  // ─── Wire up the switchers ──────────────
  function init() {
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        setLanguage(btn.getAttribute('data-lang'));
      });
    });

    apply(stored() || detect());
  }

  window.MaximI18n = {
    supported: SUPPORTED.slice(),
    get current() {
      return document.documentElement.getAttribute('lang');
    },
    set: setLanguage,
    t: function (path) {
      return translate(path, document.documentElement.getAttribute('lang') || FALLBACK);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
