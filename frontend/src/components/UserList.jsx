function UserList({ users }) {
  return (
    <div className="user-list">
      <h2>Usuários Cadastrados</h2>
      <table id="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Nascimento</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome_completo}</td>
              <td>{user.email}</td>
              <td>{user.telefone || 'N/A'}</td>
              <td>{user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</td>
              <td>{user.endereco || 'N/A'}</td>
              <td className="actions">
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;