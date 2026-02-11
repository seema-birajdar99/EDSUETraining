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
 * Builds dropdown list from multifield items
 */
function createList(items) {
  const ul = document.createElement('ul');

  items.forEach((item) => {
    const cols = item.children;

    if (cols.length < 2) return;

    const language = cols[0].textContent.trim();
    const link = cols[1].textContent.trim();

    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = link;
    a.textContent = language;

    li.appendChild(a);
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
  console.log('Language Navigation Block:', block);

  // Find container (multifield wrapper)
  const container = block.querySelector(':scope > div');
  console.log('Language Navigation container:', container);

  if (!container) {
    return;
  }

  const items = [...container.children];
 console.log('Language Navigation Container children:', items);
  if (!items.length) {
    return;
  }

  // Default language = first item first column
  const defaultLanguage = items[0]?.children[0]?.textContent.trim() || '';

  const toggle = createToggle(defaultLanguage);
  const list = createList(items);

  block.innerHTML = '';
  block.append(toggle, list);

  setupToggle(block, toggle);
}
