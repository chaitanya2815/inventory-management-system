import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // States for Data
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])

  // States for Forms
  const [pName, setPName] = useState(''); const [pSku, setPSku] = useState(''); const [pPrice, setPPrice] = useState(''); const [pStock, setPStock] = useState('')
  const [cName, setCName] = useState(''); const [cEmail, setCEmail] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(''); const [selectedProduct, setSelectedProduct] = useState(''); const [orderQty, setOrderQty] = useState('')

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/products').then(res => setProducts(res.data)).catch(err => console.log(err))
    axios.get('http://127.0.0.1:8000/customers').then(res => setCustomers(res.data)).catch(err => console.log(err))
    axios.get('http://127.0.0.1:8000/orders').then(res => setOrders(res.data)).catch(err => console.log(err))
  }

  useEffect(() => { refreshData() }, [])

  // Handlers
  const handleAddProduct = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/products', { name: pName, sku: pSku, price: parseFloat(pPrice), stock_quantity: parseInt(pStock) })
    .then(() => { alert('✅ Product Added!'); refreshData(); setPName(''); setPSku(''); setPPrice(''); setPStock(''); })
    .catch(err => alert('❌ ' + (err.response?.data?.detail || 'Error')))
  }

  const handleAddCustomer = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/customers', { name: cName, email: cEmail })
    .then(() => { alert('✅ Customer Added!'); refreshData(); setCName(''); setCEmail(''); })
    .catch(err => alert('❌ ' + (err.response?.data?.detail || 'Error')))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/orders', { customer_id: parseInt(selectedCustomer), product_id: parseInt(selectedProduct), quantity: parseInt(orderQty) })
    .then(() => { alert('✅ Order Placed & Stock Updated!'); refreshData(); setSelectedCustomer(''); setSelectedProduct(''); setOrderQty(''); })
    .catch(err => alert('❌ ' + (err.response?.data?.detail || 'Error')))
  }

  // --- Professional Styles ---
  const styles = {
    page: { backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#333' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { textAlign: 'center', color: '#1e293b', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '50px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    cardTitle: { marginTop: '0', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '14px' },
    btnPrimary: { width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: '0.3s' },
    btnSuccess: { width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
    tableContainer: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#1e293b', color: '#f8fafc', padding: '15px', fontWeight: '600' },
    td: { padding: '15px', borderBottom: '1px solid #f1f5f9', color: '#475569' }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.header}>⚡ Admin Dashboard</h1>

        {/* FORMS GRID */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📦 Add Product</h3>
            <form onSubmit={handleAddProduct}>
              <input style={styles.input} type="text" placeholder="Product Name" value={pName} onChange={e => setPName(e.target.value)} required />
              <input style={styles.input} type="text" placeholder="SKU (Unique)" value={pSku} onChange={e => setPSku(e.target.value)} required />
              <div style={{display: 'flex', gap: '10px'}}>
                <input style={styles.input} type="number" placeholder="Price ($)" value={pPrice} onChange={e => setPPrice(e.target.value)} required />
                <input style={styles.input} type="number" placeholder="Stock Qty" value={pStock} onChange={e => setPStock(e.target.value)} required />
              </div>
              <button type="submit" style={styles.btnPrimary}>Save Product</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👥 Add Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <input style={styles.input} type="text" placeholder="Full Name" value={cName} onChange={e => setCName(e.target.value)} required />
              <input style={styles.input} type="email" placeholder="Email Address (Unique)" value={cEmail} onChange={e => setCEmail(e.target.value)} required />
              <button type="submit" style={styles.btnPrimary}>Save Customer</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🛒 Place Order</h3>
            <form onSubmit={handlePlaceOrder}>
              <select style={styles.input} value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} required>
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select style={styles.input} value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>)}
              </select>
              <input style={styles.input} type="number" placeholder="Order Quantity" value={orderQty} onChange={e => setOrderQty(e.target.value)} required />
              <button type="submit" style={styles.btnSuccess}>Confirm Order</button>
            </form>
          </div>
        </div>

        {/* DATA TABLES */}
        <h2 style={{color: '#1e293b', marginBottom: '15px'}}>Inventory Status</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>ID</th><th style={styles.th}>Product</th><th style={styles.th}>SKU</th><th style={styles.th}>Price</th><th style={styles.th}>Stock Left</th></tr></thead>
            <tbody>
              {products.map(p => <tr key={p.id}><td style={styles.td}>#{p.id}</td><td style={styles.td}><strong>{p.name}</strong></td><td style={styles.td}>{p.sku}</td><td style={styles.td}>${p.price}</td><td style={styles.td}><span style={{backgroundColor: p.stock_quantity < 5 ? '#fee2e2' : '#dcfce7', color: p.stock_quantity < 5 ? '#ef4444' : '#16a34a', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'}}>{p.stock_quantity}</span></td></tr>)}
            </tbody>
          </table>
        </div>

        <div style={styles.grid}>
          <div>
            <h2 style={{color: '#1e293b', marginBottom: '15px'}}>Recent Orders</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Order ID</th><th style={styles.th}>Total Bill</th><th style={styles.th}>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => <tr key={o.id}><td style={styles.td}>ORD-00{o.id}</td><td style={styles.td}><strong>${o.total_price}</strong></td><td style={styles.td}><span style={{color: '#10b981', fontWeight: 'bold'}}>✓ {o.status}</span></td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h2 style={{color: '#1e293b', marginBottom: '15px'}}>Customers</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th></tr></thead>
                <tbody>
                  {customers.map(c => <tr key={c.id}><td style={styles.td}><strong>{c.name}</strong></td><td style={styles.td}>{c.email}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App