document.addEventListener('DOMContentLoaded', function () {
  let clipboard = new ClipboardJS('.copy-btn');

  clipboard.on('success', function (e) {
    $('#copyModal').modal('show');
    e.clearSelection();
  });

  clipboard.on('error', function (e) {
    console.error('Falha ao copiar o texto: ', e);
  });

  // Adicionando novo snippet
  document.getElementById('snippetForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const code = document.getElementById('code').value;
    const language = document.getElementById('language').value;

    fetch('http://localhost:3000/snippets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, code, language })
    })
      .then(response => response.json())
      .then(data => {
        const snippetList = document.querySelector('.snippet-list');
        const snippetItem = document.createElement('div');
        snippetItem.className = 'card snippet-item';

        snippetItem.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p><strong>Linguagem:</strong> ${data.language}</p>
            <pre><code>${data.code}</code></pre>
            <button class="btn btn-secondary copy-btn" data-clipboard-text="${encodeURIComponent(data.code)}">Copiar</button>
          </div>
        `;

        snippetList.appendChild(snippetItem);

        $('#addModal').modal('show');
        document.getElementById('snippetForm').reset();

        // Atualiza a funcionalidade do botão de copiar
        clipboard.destroy();
        clipboard = new ClipboardJS('.copy-btn');
      });
  });

  // Carregando snippets existentes e exibindo-os
  fetch('http://localhost:3000/snippets')
    .then(response => response.json())
    .then(snippets => {
      const snippetList = document.querySelector('.snippet-list');
      snippets.forEach(snippet => {
        const snippetItem = document.createElement('div');
        snippetItem.className = 'card snippet-item';

        snippetItem.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${snippet.title}</h5>
            <p><strong>Linguagem:</strong> ${snippet.language}</p>
            <pre><code>${snippet.code}</code></pre>
            <button class="btn btn-secondary copy-btn" data-clipboard-text="${encodeURIComponent(snippet.code)}">Copiar</button>
          </div>
        `;

        snippetList.appendChild(snippetItem);
      });

      // Atualiza a funcionalidade do botão de copiar
      clipboard.destroy();
      clipboard = new ClipboardJS('.copy-btn');
    });

  // Filtro de busca e linguagem
  const searchInput = document.getElementById('search');
  const searchLanguage = document.getElementById('searchLanguage');

  function filterSnippets() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLanguage = searchLanguage.value;

    // Limpa a lista de snippets antes de aplicar o filtro
    const snippetList = document.querySelector('.snippet-list');
    snippetList.innerHTML = '';

    fetch('http://localhost:3000/snippets')
      .then(response => response.json())
      .then(snippets => {
        const filteredSnippets = snippets.filter(snippet => {
          const matchesTitle = snippet.title.toLowerCase().includes(searchTerm);
          const matchesLanguage = selectedLanguage === '' || snippet.language === selectedLanguage;

          return matchesTitle && matchesLanguage;
        });

        // Exibe os snippets filtrados
        filteredSnippets.forEach(snippet => {
          const snippetItem = document.createElement('div');
          snippetItem.className = 'card snippet-item';

          snippetItem.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${snippet.title}</h5>
              <p><strong>Linguagem:</strong> ${snippet.language}</p>
              <pre><code>${snippet.code}</code></pre>
              <button class="btn btn-secondary copy-btn" data-clipboard-text="${encodeURIComponent(snippet.code)}">Copiar</button>
            </div>
          `;

          snippetList.appendChild(snippetItem);
        });

        // Atualiza a funcionalidade do botão de copiar
        clipboard.destroy();
        clipboard = new ClipboardJS('.copy-btn');
      });
  }

  // Eventos de input para busca e mudança de seleção da linguagem
  searchInput.addEventListener('input', filterSnippets);
  searchLanguage.addEventListener('change', filterSnippets);
});
