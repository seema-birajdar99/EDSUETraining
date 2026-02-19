import { getMetadata } from '../../scripts/aem.js';

/**
 * Builds a new URL path from locale (e.g., en-US → /us/en)
 * and preserves the rest of the current path.
 */
function buildPathFromLocale(locale) {
  if (!locale) return null;

  const [language, country] = locale.split('-');
  if (!language || !country) return null;

  const newRoot = `/${country.toLowerCase()}/${language.toLowerCase()}`;

  const currentPath = window.location.pathname;

  // remove existing /country/lang
  const remainder = currentPath.replace(/^\/[a-z]{2}\/[a-z]{2}/i, '');

  return `${newRoot}${remainder}`;
}

export default async function decorate(block) {
  const response = await fetch('/site-config.json');
  if (!response.ok) return;

  const { data } = await response.json();
  if (!data?.length) return;

  const items = new Map(
    data
      .filter((row) => row.Language && row['Language Path'])
      .map((row) => [row.Language, row['Language Path']]),
  );

  if (!items.size) return;

  const currentLocale = getMetadata('locale');

  const currentPath = window.location.pathname;

  let activeLabel;

  items.forEach((path, label) => {
    if (currentPath.startsWith(path)) {
      activeLabel = label;
    }
  });

  const [first] = items.keys();

  const toggle = document.createElement('button');
  toggle.className = 'lang-toggle';
  toggle.type = 'button';
  toggle.textContent = activeLabel || first;

  const list = document.createElement('ul');

  items.forEach((locale, label) => {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = '#';
    a.textContent = label;

    if (locale === currentLocale) {
      a.classList.add('active');
    }

    a.addEventListener('click', (e) => {
      e.preventDefault();

      const newPath = buildPathFromLocale(locale);
      if (newPath) {
        window.location.href = newPath;
      }
    });

    li.appendChild(a);
    list.appendChild(li);
  });

  block.replaceChildren(toggle, list);

  toggle.addEventListener('click', () => {
    block.classList.toggle('open');
  });
}
