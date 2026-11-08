const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Serve somente o HTML sob teste, sem expor outros arquivos do projeto.
const htmlPath = path.join(__dirname, '..', 'portal-pedidos-qa.html');

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  if (request.url !== '/portal-pedidos-qa.html' && request.url !== '/') {
    response.writeHead(404);
    response.end();
    return;
  }
  fs.readFile(htmlPath, (error, html) => {
    if (error) {
      response.writeHead(500);
      response.end('Erro ao ler o HTML.');
      return;
    }
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : html);
  });
}).listen(4173, '127.0.0.1');
