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

  const toggle = document.createElement('button');
  toggle.className = 'lang-toggle';
  toggle.type = 'button';

  const [first] = items.keys();
  toggle.textContent = first;

  const list = document.createElement('ul');

  items.forEach((path, label) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${path}">${label}</a>`;
    list.appendChild(li);
  });

  block.replaceChildren(toggle, list);

  toggle.addEventListener('click', () => {
    block.classList.toggle('open');
  });
}
