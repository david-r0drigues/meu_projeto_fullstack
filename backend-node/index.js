// index.js
import { PrismaClient } from './generated/prisma/index.js'; // <-- Linha alterada
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ROTA PARA CRIAR UM NOVO USUÁRIO
app.post('/usuarios', async (req, res) => {
    try {
        const { nome_completo, email, senha, telefone, data_nascimento, endereco } = req.body;
        const senha_hash = await bcrypt.hash(senha, 10);
        
        const newUser = await prisma.user.create({
            data: {
                nome_completo,
                email,
                senha: senha_hash,
                telefone,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                endereco,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

// ROTA PARA LISTAR TODOS OS USUÁRIOS
app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, nome_completo: true, email: true, telefone: true, data_nascimento: true, endereco: true, data_cadastro: true },
            orderBy: { id: 'asc' },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

// ROTA PARA BUSCAR UM USUÁRIO POR ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, nome_completo: true, email: true, telefone: true, data_nascimento: true, endereco: true },
        });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// ROTA PARA ATUALIZAR UM USUÁRIO
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_completo, email, telefone, data_nascimento, endereco } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                nome_completo,
                email,
                telefone,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                endereco,
            },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// ROTA PARA DELETAR UM USUÁRIO
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Node.js rodando na porta ${PORT}`));