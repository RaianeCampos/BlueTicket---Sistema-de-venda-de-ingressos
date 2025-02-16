document.getElementById('purchaseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const ticketId = document.getElementById('ticketId').value;
  const clientCode = document.getElementById('clientCode').value;
  const clientName = document.getElementById('clientName').value;
  const clientPhone = document.getElementById('clientPhone').value;
  const clientEmail = document.getElementById('clientEmail').value;
  const quantity = document.getElementById('quantity').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  try {
    const response = await fetch('/purchases/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token JWT
      },
      body: JSON.stringify({ ticketId, quantity, clientCode, clientName, clientPhone, clientEmail, paymentMethod }),
    });

    if (response.ok) {
      alert('Compra realizada com sucesso!');
      window.location.href = '/tickets'; // Redireciona para a página de eventos
    } else {
      const data = await response.json();
      document.getElementById('error').textContent = data.error || 'Erro ao processar a compra.';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('error').textContent = 'Erro ao conectar ao servidor.';
  }
});