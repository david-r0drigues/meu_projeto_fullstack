function UserForm() {
  return (
    <form id="user-form">
      <h2 id="form-title">Cadastrar Usuário</h2>
      <input type="hidden" id="user-id" />

      <input type="text" id="nome" placeholder="Nome Completo" required />
      <input type="email" id="email" placeholder="E-mail" required />
      <input type="password" id="senha" placeholder="Senha (obrigatória no cadastro)" />
      <input type="tel" id="telefone" placeholder="Telefone" />

      <label htmlFor="data-nascimento">Data de Nascimento:</label>
      <input type="date" id="data-nascimento" />

      <label htmlFor="endereco">Endereço:</label>
      <textarea id="endereco" placeholder="Endereço Completo" rows="3"></textarea>

      <button type="submit">Salvar</button>
    </form>
  );
}

export default UserForm;