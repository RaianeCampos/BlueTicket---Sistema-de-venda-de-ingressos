// Função para exibir mensagens de erro
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
  }
  
  // Registrar um novo usuário
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        window.location.href = '/login'; // Redireciona para a página de login
      } else {
        const data = await response.json();
        showError(data.error || 'Erro ao registrar usuário.');
      }
    } catch (error) {
      showError('Erro ao conectar ao servidor.');
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    if (!document.querySelector('#eventsList').hasChildNodes()) {
      await loadTickets(); // Só carrega via API se a lista estiver vazia
    }
  });
  
  // Carregar ingressos disponíveis
  async function loadTickets() {
    try {
      const response = await fetch('/tickets/api'); // O cookie será enviado automaticamente
      if (response.ok) {
        const events = await response.json();
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = events.map(event => `
          <div class="event-card">
            <img src="/images/${event.image}" alt="${event.name}">
            <h2>${event.name}</h2>
            <p>Data: ${event.date}</p>
            <p>Local: ${event.location}</p>
            <p>Preço: R$ ${event.price}</p>
            <p>Quantidade disponível: ${event.quantity}</p>
            <button onclick="buyTicket(${event.id})">Comprar</button>
            <a href="/tickets/${event.id}">Ver Detalhes</a>
          </div>
        `).join('');
      } else {
        showError('Erro ao carregar eventos.');
      }
    } catch (error) {
      console.log(error);
      showError('Erro ao conectar ao servidor.');
    }
  }
  
  function buyTicket(ticketId) {
    // Redireciona para a página de formulário de compra
    window.location.href = `/purchases/purchase-form?ticketId=${ticketId}`;
  }

  // Carregar histórico de compras
  async function loadPurchases() {
    try {
      const response = await fetch('/user/purchases', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token JWT
        },
      });

      console.log('Resposta da API:', response); // Log para depuração

      if (response.ok) {
        const purchases = await response.json();
        console.log('Compras recebidas:', purchases); // Log para depuração
        const purchasesList = document.getElementById('purchasesList');
        purchasesList.innerHTML = purchases.map(purchase => `
          <li>
          <h2>${purchase.ticket.name}</h2>
          <p>Quantidade: ${purchase.quantity}</p>
          <p>Preço: R$ ${purchase.ticket.price}</p>
          <a href="/tickets/${purchase.ticket.id}">Ver Detalhes</a>
        </li>
        `).join('');
      } else {
        const errorData = await response.json(); // Captura o erro retornado pela API
        console.error('Erro na resposta da API:', errorData); // Log para depuração
        showError('Erro ao carregar histórico de compras.'+ errorData.error);
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error); // Log para depuração
      showError('Erro ao conectar ao servidor.');
    }
  }
  
  // Carregar detalhes de um ingresso
  async function loadTicketDetails() {
    const ticketId = window.location.pathname.split('/').pop();
    try {
      const response = await fetch(`/tickets/${ticketId}`);
      if (response.ok) {
        const ticket = await response.json();
        document.getElementById('ticketName').textContent = ticket.name;
        document.getElementById('ticketPrice').textContent = ticket.price;
        document.getElementById('ticketQuantity').textContent = ticket.quantity;
      } else {
        showError('Erro ao carregar detalhes do ingresso.');
      }
    } catch (error) {
      showError('Erro ao conectar ao servidor.');
    }
  }
  
  // Inicialização
  if (window.location.pathname === '/purchases') {
    loadPurchases();
  } else if (window.location.pathname.startsWith('/tickets/')) {
    loadTicketDetails();
  }

  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Armazena o token no localStorage
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token)
        // Redireciona para a página principal de eventos
        
        window.location.href = '/tickets';
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao fazer login.');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor.');
    }
  });

  // Verifica se o usuário está autenticado
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = '/login'; // Redireciona para a página de login
  }
}

// Executa a verificação quando a página é carregada
checkAuth();

//retira o token do cookie
function logout() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.location.href = "/login"; // Redireciona para a página de login
}
