const API_URL = 'http://127.0.0.1:5000';

const form = document.getElementById('user-form');
const formTitle = document.getElementById('form-title');
const userIdInput = document.getElementById('user-id');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const telefoneInput = document.getElementById('telefone');
const dataNascimentoInput = document.getElementById('data-nascimento');
const enderecoInput = document.getElementById('endereco');
const tableBody = document.getElementById('user-table-body');

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const users = await response.json();

        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const dataNascFormatada = user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome_completo}</td>
                <td>${user.email}</td>
                <td>${user.telefone || 'N/A'}</td>
                <td>${dataNascFormatada}</td>
                <td>${user.endereco || 'N/A'}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="handleEdit(${user.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Falha na comunicação com o backend:", error);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = userIdInput.value;

    const userData = {
        nome_completo: nomeInput.value,
        email: emailInput.value,
        telefone: telefoneInput.value,
        data_nascimento: dataNascimentoInput.value,
        endereco: enderecoInput.value,
    };

    let response;
    if (userId) {
        response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
    } else {
        userData.senha = senhaInput.value;
        response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
    }

    if (response.ok) {
        resetForm();
        fetchUsers();
    } else {
        alert("Ocorreu um erro ao salvar!");
    }
});

async function handleEdit(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    const user = await response.json();

    formTitle.textContent = 'Editar Usuário';
    userIdInput.value = user.id;
    nomeInput.value = user.nome_completo;
    emailInput.value = user.email;
    telefoneInput.value = user.telefone || '';
    dataNascimentoInput.value = user.data_nascimento || '';
    enderecoInput.value = user.endereco || '';
    
    senhaInput.disabled = true;
    senhaInput.required = false;
    senhaInput.placeholder = 'Senha não pode ser alterada aqui';
}

function resetForm() {
    formTitle.textContent = 'Cadastrar Usuário';
    form.reset();
    userIdInput.value = '';
    senhaInput.disabled = false;
    senhaInput.required = true;
    senhaInput.placeholder = 'Senha (obrigatória no cadastro)';
}

async function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
        fetchUsers();
    }
}

document.addEventListener('DOMContentLoaded', fetchUsers);