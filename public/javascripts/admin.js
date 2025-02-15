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