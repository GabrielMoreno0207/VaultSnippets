// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://moreno:0207@snippet.irxh5.mongodb.net/snippet?retryWrites=true&w=majority&appName=snippet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir o esquema e o modelo do Snippet
const snippetSchema = new mongoose.Schema({
  title: String,
  code: String,
  language: String
});

const Snippet = mongoose.model('Snippet', snippetSchema);

// Rota para adicionar um snippet
app.post('/snippets', async (req, res) => {
  const { title, code, language } = req.body;
  const newSnippet = new Snippet({ title, code, language });
  await newSnippet.save();
  res.status(201).send(newSnippet);
});

// Rota para obter todos os snippets
app.get('/snippets', async (req, res) => {
  const snippets = await Snippet.find();
  res.status(200).send(snippets);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
