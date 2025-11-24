const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// GET: Consultar todos os produtos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET: Consultar produto por ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST: Cadastrar produto
app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;  // Incluindo description
    const { data, error } = await supabase.from('products').insert([{ name, description, price }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT: Alterar produto
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const { data, error } = await supabase.from('products').update({ name, description, price }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE: Deletar produto
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Back End rodando na porta ${PORT}`));