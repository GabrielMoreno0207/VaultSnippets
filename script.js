document.addEventListener('DOMContentLoaded', function () {
    const clipboard = new ClipboardJS('.copy-btn');
  
    clipboard.on('success', function (e) {
      $('#copyModal').modal('show');
      e.clearSelection();
    });
  
    clipboard.on('error', function (e) {
      console.error('Falha ao copiar o texto: ', e);
    });
  
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
              <pre><code>${data.code}</code></pre>
              <button class="btn btn-secondary copy-btn" data-clipboard-text="${data.code}">Copiar</button>
            </div>
          `;
  
          snippetList.appendChild(snippetItem);
  
          $('#addModal').modal('show');
          document.getElementById('snippetForm').reset();
        });
    });
  
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
              <pre><code>${snippet.code}</code></pre>
              <button class="btn btn-secondary copy-btn" data-clipboard-text="${snippet.code}">Copiar</button>
            </div>
          `;
  
          snippetList.appendChild(snippetItem);
        });
      });
  });
  