const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const porta = 3000;
const arquivo = 'db.json';
const arquivoAcessos = 'acessos.json';

app.use(cors());
app.use(express.json());

// Rota para salvar dados principais
app.post('/api/reg', (req, res) => {
  const entrada = req.body;
  let lista = [];

  if (fs.existsSync(arquivo)) {
    lista = JSON.parse(fs.readFileSync(arquivo));
  }

  lista.push({ ...entrada, ts: new Date().toISOString() });
  fs.writeFileSync(arquivo, JSON.stringify(lista, null, 2));

  res.json({ ok: true });
});

// Rota para retornar dados principais
app.get('/api/reg', (req, res) => {
  if (fs.existsSync(arquivo)) {
    const dados = JSON.parse(fs.readFileSync(arquivo));
    res.json(dados);
  } else {
    res.json([]);
  }
});

// Nova rota para registrar acessos
app.post('/api/acessos', (req, res) => {
  let acessos = 0;

  if (fs.existsSync(arquivoAcessos)) {
    acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
  }

  acessos++;
  fs.writeFileSync(arquivoAcessos, acessos.toString());

  res.json({ acessos });
});

// Nova rota para consultar total de acessos
app.get('/api/acessos', (req, res) => {
  let acessos = 0;

  if (fs.existsSync(arquivoAcessos)) {
    acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
  }

  res.json({ acessos });
});

app.listen(porta, () => {
  console.log(`Ativo em http://localhost:${porta}`);
});
