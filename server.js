const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const porta = process.env.PORT || 3000;

const arquivo = 'db.json';
const arquivoAcessos = 'acessos.json';

// Middlewares
app.use(cors());
app.use(express.json());

// 📁 Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// 📦 API: salvar registros
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

// 📦 API: retornar registros
app.get('/api/reg', (req, res) => {
  if (fs.existsSync(arquivo)) {
    const dados = JSON.parse(fs.readFileSync(arquivo));
    res.json(dados);
  } else {
    res.json([]);
  }
});

// 👣 API: registrar acessos
app.post('/api/acessos', (req, res) => {
  let acessos = 0;

  if (fs.existsSync(arquivoAcessos)) {
    acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
  }

  acessos++;
  fs.writeFileSync(arquivoAcessos, acessos.toString());
  res.json({ acessos });
});

// 👁️ API: consultar total de acessos
app.get('/api/acessos', (req, res) => {
  let acessos = 0;

  if (fs.existsSync(arquivoAcessos)) {
    acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
  }

  res.json({ acessos });
});

// Fallback: sempre retorna index.html para qualquer rota não reconhecida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(porta, () => {
  console.log(`✅ Servidor rodando em http://localhost:${porta}`);
});
