import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  // --- ESTADOS DO LOGIN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // --- ESTADOS DO SISTEMA ---
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [rawMaterials, setRawMaterials] = useState([])
  const [prodCode, setProdCode] = useState(''); const [prodName, setProdName] = useState(''); const [prodValue, setProdValue] = useState('')
  const [rmCode, setRmCode] = useState(''); const [rmName, setRmName] = useState(''); const [rmStock, setRmStock] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [recipe, setRecipe] = useState([])
  const [selectedRmId, setSelectedRmId] = useState('')
  const [requiredQuantity, setRequiredQuantity] = useState('')
  const [maxProduction, setMaxProduction] = useState(null)

  // --- FUNÇÃO DE LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault()
    // Mock de autenticação (Apenas para demonstração visual no teste)
    if (username === 'admin' && password === 'autoflex') {
      setIsAuthenticated(true)
    } else {
      alert('Credenciais inválidas! Dica: usuário "admin" e senha "autoflex"')
    }
  }

  // --- FUNÇÕES DE BUSCA ---
  const fetchProducts = () => fetch('/api/products').then(res => res.json()).then(data => setProducts(data)).catch(err => console.error(err))
  const fetchRawMaterials = () => fetch('/api/raw-materials').then(res => res.json()).then(data => setRawMaterials(data)).catch(err => console.error(err))

  // Só busca os dados SE estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchRawMaterials()
    }
  }, [isAuthenticated])

  // --- FUNÇÕES DO ERP ---
  const handleProductSubmit = (e) => {
    e.preventDefault()
    fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: prodCode, name: prodName, value: parseFloat(prodValue) }) })
      .then(res => { if (res.ok) { setProdCode(''); setProdName(''); setProdValue(''); fetchProducts(); } else alert('Erro!') })
  }

  const handleRmSubmit = (e) => {
    e.preventDefault()
    fetch('/api/raw-materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: rmCode, name: rmName, stockQuantity: parseInt(rmStock) }) })
      .then(res => { if (res.ok) { setRmCode(''); setRmName(''); setRmStock(''); fetchRawMaterials(); } else alert('Erro!') })
  }

  const openRecipe = (product) => { setSelectedProduct(product); setMaxProduction(null); fetchRecipe(product.id) }
  const fetchRecipe = (productId) => fetch(`/api/products/${productId}/raw-materials`).then(res => res.json()).then(data => setRecipe(data)).catch(err => console.error(err))

  const handleAddMaterialToRecipe = (e) => {
    e.preventDefault()
    if (!selectedRmId) return alert('Selecione uma matéria-prima!')
    fetch(`/api/products/${selectedProduct.id}/raw-materials`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rawMaterial: { id: parseInt(selectedRmId) }, requiredQuantity: parseInt(requiredQuantity) })
    }).then(res => { if (res.ok) { setSelectedRmId(''); setRequiredQuantity(''); fetchRecipe(selectedProduct.id); setMaxProduction(null); } else { alert('Erro ao adicionar à receita.') } })
  }

  const calculateMaxProduction = () => fetch(`/api/products/${selectedProduct.id}/max-production`).then(res => res.json()).then(data => setMaxProduction(data.maxProduction)).catch(err => console.error(err))

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL (A MÁGICA ACONTECE AQUI)
  // ==========================================
  
  // SE NÃO ESTIVER LOGADO, MOSTRA A TELA DE LOGIN
  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">🏭</div>
          <h2>Autoflex ERP</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input type="text" placeholder="Usuário" className="login-input" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Senha" className="login-input" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="login-btn">Entrar no Sistema</button>
          </form>
          <p className="login-hint">Acesso restrito para funcionários Autoflex.</p>
        </div>
      </div>
    )
  }

  // SE ESTIVER LOGADO, MOSTRA O SISTEMA INTEIRO
  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="header-title">🏭 Autoflex ERP</h1>
        <button onClick={() => setIsAuthenticated(false)} className="btn-back">Sair (Logout)</button>
      </div>
      
      {!selectedProduct && (
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>📦 Produtos</button>
          <button className={`tab-btn ${activeTab === 'rawMaterials' ? 'active' : ''}`} onClick={() => setActiveTab('rawMaterials')}>🛢️ Matérias-Primas</button>
        </div>
      )}

      {/* TELA PRODUTOS */}
      {activeTab === 'products' && !selectedProduct && (
        <div>
          <div className="card">
            <h3>Cadastrar Novo Produto</h3>
            <form onSubmit={handleProductSubmit} className="form-group">
              <div className="input-wrapper"><label>Código</label><input type="text" className="input-field" value={prodCode} onChange={e => setProdCode(e.target.value)} required /></div>
              <div className="input-wrapper"><label>Nome</label><input type="text" className="input-field" value={prodName} onChange={e => setProdName(e.target.value)} required /></div>
              <div className="input-wrapper"><label>Valor (R$)</label><input type="number" step="0.01" className="input-field" value={prodValue} onChange={e => setProdValue(e.target.value)} required /></div>
              <button type="submit" className="btn-primary">Salvar Produto</button>
            </form>
          </div>

          <table className="data-table">
            <thead><tr><th>ID</th><th>Código</th><th>Nome</th><th>Valor (R$)</th><th>Ações</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.code}</td><td>{p.name}</td><td>R$ {p.value.toFixed(2)}</td>
                  <td><button onClick={() => openRecipe(p)} className="btn-secondary">⚙️ Ver Receita</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TELA DA RECEITA */}
      {activeTab === 'products' && selectedProduct && (
        <div>
          <button onClick={() => setSelectedProduct(null)} className="btn-back">⬅ Voltar para Produtos</button>
          
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Composição: {selectedProduct.name}</h2>
          
          <div className="card">
            <h3>Adicionar Ingrediente</h3>
            <form onSubmit={handleAddMaterialToRecipe} className="form-group">
              <div className="input-wrapper">
                <label>Matéria-Prima</label>
                <select className="input-field" value={selectedRmId} onChange={e => setSelectedRmId(e.target.value)} required>
                  <option value="">Selecione na lista...</option>
                  {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name} (Estoque: {rm.stockQuantity})</option>)}
                </select>
              </div>
              <div className="input-wrapper">
                <label>Qtd. p/ Fabricar 1 unidade</label>
                <input type="number" className="input-field" value={requiredQuantity} onChange={e => setRequiredQuantity(e.target.value)} required min="1" />
              </div>
              <button type="submit" className="btn-secondary">+ Adicionar Ingrediente</button>
            </form>
          </div>

          <table className="data-table">
            <thead><tr><th>Matéria-Prima</th><th>Qtd. Necessária</th></tr></thead>
            <tbody>
              {recipe.length === 0 ? <tr><td colSpan="2" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>A receita está vazia. Adicione insumos acima.</td></tr> :
                recipe.map(item => (
                  <tr key={item.id}><td>{item.rawMaterial.name} ({item.rawMaterial.code})</td><td>{item.requiredQuantity} un</td></tr>
                ))}
            </tbody>
          </table>

          {recipe.length > 0 && (
            <div className="result-panel">
              <button onClick={calculateMaxProduction} className="btn-calculate">⚡ Calcular Máximo de Produção</button>
              {maxProduction !== null && (
                <div className="result-text">
                  Com o estoque atual, você pode fabricar:
                  <span className="result-number">{maxProduction} un</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TELA MATÉRIAS-PRIMAS */}
      {activeTab === 'rawMaterials' && !selectedProduct && (
        <div>
          <div className="card">
            <h3>Cadastrar Insumo</h3>
            <form onSubmit={handleRmSubmit} className="form-group">
              <div className="input-wrapper"><label>Código</label><input type="text" className="input-field" value={rmCode} onChange={e => setRmCode(e.target.value)} required /></div>
              <div className="input-wrapper"><label>Nome</label><input type="text" className="input-field" value={rmName} onChange={e => setRmName(e.target.value)} required /></div>
              <div className="input-wrapper"><label>Estoque Atual</label><input type="number" className="input-field" value={rmStock} onChange={e => setRmStock(e.target.value)} required min="0" /></div>
              <button type="submit" className="btn-primary">Salvar Insumo</button>
            </form>
          </div>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Código</th><th>Nome</th><th>Qtd. Estoque</th></tr></thead>
            <tbody>
              {rawMaterials.map(rm => <tr key={rm.id}><td>{rm.id}</td><td>{rm.code}</td><td>{rm.name}</td><td>{rm.stockQuantity} un</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App