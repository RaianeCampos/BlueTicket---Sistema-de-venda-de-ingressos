document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;
  
    try {
      const response = await fetch('/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, isAdmin }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Usuário criado com sucesso!');
        window.location.reload();
      } else {
        alert(data.error || 'Erro ao criar usuário.');
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });
  
  document.getElementById('createTicketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const type = document.getElementById('type').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;
  
    try {
      const response = await fetch('/admin/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, quantity, type, image, description }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Ingresso criado com sucesso!');
        window.location.reload();
      } else {
        alert(data.error || 'Erro ao criar ingresso.');
      }
    } catch (error) {
      console.error('Erro ao criar ingresso:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });

  // Excluir Usuário
document.querySelectorAll('.delete-user-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const userId = button.getAttribute('data-id');

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await fetch(`/admin/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Usuário excluído com sucesso!');
          window.location.reload();
        } else {
          alert('Erro ao excluir usuário.');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  });
});

// Excluir Ingresso
document.querySelectorAll('.delete-ticket-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const ticketId = button.getAttribute('data-id');

    if (confirm('Tem certeza que deseja excluir este ingresso?')) {
      try {
        const response = await fetch(`/admin/tickets/${ticketId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Ingresso excluído com sucesso!');
          window.location.reload();
        } else {
          alert('Erro ao excluir ingresso.');
        }
      } catch (error) {
        console.error('Erro ao excluir ingresso:', error);
      }
    }
  });
});

// Função para abrir o modal de edição
document.querySelectorAll('.edit-ticket-btn').forEach(button => {
  button.addEventListener('click', () => {
    const ticketId = button.getAttribute('data-id');
    document.getElementById('edit-ticket-id').value = ticketId;

    const nameElement = document.getElementById(`ticket-name-${ticketId}`);
    const priceElement = document.getElementById(`ticket-price-${ticketId}`);
    const quantityElement = document.getElementById(`ticket-quantity-${ticketId}`);
    const typeElement = document.getElementById(`ticket-type-${ticketId}`);

    if (nameElement && priceElement && quantityElement && typeElement) {
      document.getElementById('edit-ticket-name').value = nameElement.innerText;
      document.getElementById('edit-ticket-price').value = priceElement.innerText;
      document.getElementById('edit-ticket-quantity').value = quantityElement.innerText;
      document.getElementById('edit-ticket-type').value = typeElement.innerText;
    } else {
      console.error(`Erro: Elementos do ingresso ${ticketId} não encontrados.`);
      return;
    }

    
    document.getElementById('editTicketModal').style.display = 'block';
  });
});

// Fechar modal
function closeEditModal() {
  document.getElementById('editTicketModal').style.display = 'none';
}

// Enviar formulário de edição
document.getElementById('editTicketForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const ticketId = document.getElementById('edit-ticket-id').value;
  const updatedTicket = {
    name: document.getElementById('edit-ticket-name').value,
    price: document.getElementById('edit-ticket-price').value,
    quantity: document.getElementById('edit-ticket-quantity').value,
    type: document.getElementById('edit-ticket-type').value,
    image: document.getElementById('edit-ticket-image').value,
    description: document.getElementById('edit-ticket-description').value
  };

  try {
    const response = await fetch(`/admin/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTicket)
    });

    if (response.ok) {
      alert('Ingresso atualizado com sucesso!');
      window.location.reload();
    } else {
      alert('Erro ao atualizar ingresso.');
    }
  } catch (error) {
    console.error('Erro ao editar ingresso:', error);
  }
});