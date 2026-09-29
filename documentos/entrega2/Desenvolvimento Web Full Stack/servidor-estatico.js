const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const raiz = __dirname;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const servidor = http.createServer((req, res) => {
  let caminhoPedido = req.url === "/" ? "/index.html" : req.url;
  caminhoPedido = decodeURIComponent(caminhoPedido.split("?")[0]);

  const caminhoArquivo = path.join(raiz, caminhoPedido);

  fs.readFile(caminhoArquivo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - Arquivo não encontrado: " + caminhoPedido);
      return;
    }

    const extensao = path.extname(caminhoArquivo);
    const tipo = TIPOS[extensao] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": tipo });
    res.end(conteudo);
  });
});

servidor.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});

