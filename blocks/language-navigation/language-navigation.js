async function getItemsFromContainer(basePath) {
  const itemsMap = new Map();
  const cleanedPath = basePath.replace('urn:aemconnection:', '');

  console.log('Language Nav: Base path:', cleanedPath);

  async function fetchItem(index) {
    const itemPath = `${cleanedPath}/item${index}.json`;
    console.log('Language Nav: Trying path:', itemPath);

    try {
      const response = await fetch(itemPath);

      if (!response.ok) {
        console.log(`Language Nav: item${index} not found. Stopping.`);
        return; // explicit stop, no value returned
      }

      const data = await response.json();
      console.log(`Language Nav: item${index} data:`, data);

      if (data?.language && data?.languagePath) {
        itemsMap.set(data.language, data.languagePath);
        console.log(
          `Language Nav: Stored -> ${data.language} : ${data.languagePath}`
        );
      }

      // Await next call instead of returning it
      await fetchItem(index + 1);
    } catch (error) {
      console.log(`Language Nav: Error at item${index}`, error);
    }
  }

  await fetchItem(0);

  console.log('Language Nav: Final Map:', itemsMap);
  return itemsMap;
}

export default async function decorate(block) {
  const container = block.firstElementChild;

  if (!container) return;

  const basePath = container.dataset?.aueResource;
  if (!basePath) return;

  const itemsMap = await getItemsFromContainer(basePath);

  if (!itemsMap.size) {
    console.log('Language Nav: No items found');
    return;
  }

  // Build dropdown
  const toggle = document.createElement('button');
  toggle.className = 'lang-toggle';
  toggle.type = 'button';
  const [firstLanguage] = itemsMap.keys();
  toggle.textContent = firstLanguage;

  const ul = document.createElement('ul');

  itemsMap.forEach((path, label) => {
    console.log('Language Nav: Creating link:', label, path);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = path;
    a.textContent = label;

    li.appendChild(a);
    ul.appendChild(li);
  });

  block.innerHTML = '';
  block.append(toggle, ul);

  toggle.addEventListener('click', () => {
    block.classList.toggle('open');
  });
}
