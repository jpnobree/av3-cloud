const express = require('express');
const cors = require('cors');
const supabaseClient = require('@supabase/supabase-js');

const supabase = 
    supabaseClient.createClient('https://kdjcmoqqccmrcxmqoipc.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkamNtb3FxY2NtcmN4bXFvaXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTk1MTgsImV4cCI6MjA3OTU3NTUxOH0.9bshOayJBvrxmpHibi5i_HkNhI_jCFpTvrMHpX0gQLU')

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(process.env.PORT ?? 3000), function (erro) {
    if (erro) {
        console.log("Erro ao iniciar.")
    } else {
        console.log("Servidor iniciado.")
    }
}

