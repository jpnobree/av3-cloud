const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient('https://kdjcmoqqccmrcxmqoipc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkamNtb3FxY2NtcmN4bXFvaXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTk1MTgsImV4cCI6MjA3OTU3NTUxOH0.9bshOayJBvrxmpHibi5i_HkNhI_jCFpTvrMHpX0gQLU');

// GET all
app.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) return res.status(400).json({ error: error.message || error });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET by id
app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message || 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
app.post('/products', async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });
    const payload = { nome, descricao: descricao || null, preco: preco === '' || preco === undefined ? null : preco };
    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (error) return res.status(400).json({ error: error.message || error });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
app.put('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao, preco } = req.body;
    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (descricao !== undefined) updates.descricao = descricao;
    if (preco !== undefined) updates.preco = preco;
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message || error });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
app.delete('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase.from('products').delete().eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message || error });
    res.json({ deleted: data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(process.env.PORT ?? 3000, function (erro) {
  if (erro) {
    console.log("Erro ao iniciar.")
  } else {
    console.log("Servidor iniciado.")
  }
})
