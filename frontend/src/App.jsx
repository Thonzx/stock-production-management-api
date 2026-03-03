import { useEffect, useState } from 'react'

function App() {
  // Estado para guardar a nossa lista de produtos
  const [products, setProducts] = useState([])

  // Quando a tela carregar, ele vai buscar os produtos no Backend
  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Erro ao buscar produtos:", error))
  }, [])

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📦 Gestão de Produtos - Autoflex</h1>
      
      <table border="1" cellPadding="12" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nome</th>
            <th>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum produto cadastrado no momento.</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.value.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App