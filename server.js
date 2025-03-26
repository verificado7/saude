const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const porta = process.env.PORT || 3000;

// ✅ Caminhos seguros para escrita no Render
const arquivo = path.join('/tmp', 'db.json');
const arquivoAcessos = path.join('/tmp', 'acessos.json');

// Middlewares
app.use(cors());
app.use(express.json());

// 📁 Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// 📦 API: salvar registros
app.post('/api/reg', (req, res) => {
  const entrada = req.body;
  let lista = [];

  try {
    if (fs.existsSync(arquivo)) {
      lista = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
    }

    lista.push({ ...entrada, ts: new Date().toISOString() });
    fs.writeFileSync(arquivo, JSON.stringify(lista, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar registro:', err);
    res.status(500).json({ erro: 'Falha ao salvar os dados' });
  }
});

// 📦 API: retornar registros
app.get('/api/reg', (req, res) => {
  try {
    if (fs.existsSync(arquivo)) {
      const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
      res.json(dados);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Erro ao ler registros:', err);
    res.status(500).json({ erro: 'Falha ao ler os dados' });
  }
});

// 👣 API: registrar acessos
app.post('/api/acessos', (req, res) => {
  let acessos = 0;

  try {
    if (fs.existsSync(arquivoAcessos)) {
      acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
    }

    acessos++;
    fs.writeFileSync(arquivoAcessos, acessos.toString());
    res.json({ acessos });
  } catch (err) {
    console.error('Erro ao contar acessos:', err);
    res.status(500).json({ erro: 'Falha ao contar acessos' });
  }
});

// 👁️ API: consultar total de acessos
app.get('/api/acessos', (req, res) => {
  let acessos = 0;

  try {
    if (fs.existsSync(arquivoAcessos)) {
      acessos = parseInt(fs.readFileSync(arquivoAcessos, 'utf8'), 10);
    }

    res.json({ acessos });
  } catch (err) {
    console.error('Erro ao consultar acessos:', err);
    res.status(500).json({ erro: 'Falha ao consultar acessos' });
  }
});

// 🌐 Rota fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(porta, () => {
  console.log(`✅ Servidor rodando em http://localhost:${porta}`);
});
