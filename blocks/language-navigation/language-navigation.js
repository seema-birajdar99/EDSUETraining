export default async function decorate(block) {
  const response = await fetch('/site-config.json');
  if (!response.ok) return;

  const { data } = await response.json();
  if (!data?.length) return;

  const currentPath = window.location.pathname;

  const items = new Map(
    data
      .filter((row) => row.Language && row['Language Path'])
      .map((row) => [row.Language, row['Language Path']]),
  );

  if (!items.size) return;

  // Find matching language
  let selectedLabel;
  items.forEach((path, label) => {
    if (currentPath.startsWith(path)) {
      selectedLabel = label;
    }
  });

  const [first] = items.keys();
  const activeLabel = selectedLabel || first;

  // Create toggle
  const toggle = document.createElement('button');
  toggle.className = 'lang-toggle';
  toggle.type = 'button';
  toggle.textContent = activeLabel;

  const list = document.createElement('ul');

  items.forEach((path, label) => {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = path;
    a.textContent = label;

    if (label === activeLabel) {
      a.classList.add('active');
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  block.replaceChildren(toggle, list);

  toggle.addEventListener('click', () => {
    block.classList.toggle('open');
  });
}
