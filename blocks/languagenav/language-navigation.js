function createToggle(labelText) {
  const button = document.createElement('button');
  button.className = 'lang-toggle';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = labelText;

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = '▾';

  button.append(label, arrow);

  return button;
}

/**
 * Builds dropdown list from links
 */
function createList(linksWrapper) {
  const ul = document.createElement('ul');

  const links = linksWrapper.querySelectorAll('a');
  links.forEach((link) => {
    const li = document.createElement('li');
    li.appendChild(link);
    ul.appendChild(li);
  });

  return ul;
}

/**
 * Handles toggle behavior
 */
function setupToggle(block, toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isOpen = block.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!block.contains(event.target)) {
      block.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * EDS block entry
 */
export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 2) {
    return;
  }

  const defaultLanguage = rows[0].textContent.trim();
  const linksWrapper = rows[1];

  const toggle = createToggle(defaultLanguage);
  const list = createList(linksWrapper);

  block.innerHTML = '';
  block.append(toggle, list);

  setupToggle(block, toggle);
}
