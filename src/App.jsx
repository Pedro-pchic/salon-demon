import React, { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, CreditCard, Download, Heart, LayoutDashboard, Menu, MoreHorizontal, Package, Plus, Search, Scissors, Settings2, ShoppingBag, Sparkles, TrendingUp, Trash2, Users, Wallet, X } from 'lucide-react'

const seed = {
  staff: [
    { id: 1, name: 'Valentina Ruiz', role: 'Colorista senior', rate: 35, tone: '#a87378' },
    { id: 2, name: 'Camila Morales', role: 'Nail artist', rate: 30, tone: '#be9d8c' },
    { id: 3, name: 'Sofía Herrera', role: 'Estilista', rate: 30, tone: '#8a9383' },
    { id: 4, name: 'Isabella Cruz', role: 'Lash artist', rate: 32, tone: '#8c7d9d' },
  ],
  services: [
    { id: 1, name: 'Corte & styling', category: 'Cabello', price: 180, duration: 60, icon: '✂️' },
    { id: 2, name: 'Coloración premium', category: 'Color', price: 450, duration: 150, icon: '🎨' },
    { id: 3, name: 'Manicure gel', category: 'Uñas', price: 160, duration: 75, icon: '💅' },
    { id: 4, name: 'Lifting de pestañas', category: 'Mirada', price: 220, duration: 60, icon: '✨' },
    { id: 5, name: 'Tratamiento capilar', category: 'Spa', price: 280, duration: 90, icon: '🌿' },
    { id: 6, name: 'Peinado de ocasión', category: 'Cabello', price: 250, duration: 75, icon: '🎀' },
  ],
  products: [
    { id: 1, name: 'Shampoo reparador', category: 'Cuidado capilar', price: 145, stock: 24, min: 6, icon: '🧴' },
    { id: 2, name: 'Mascarilla nutritiva', category: 'Tratamientos', price: 195, stock: 12, min: 5, icon: '🫙' },
    { id: 3, name: 'Aceite de argán', category: 'Cuidado capilar', price: 175, stock: 4, min: 6, icon: '💧' },
    { id: 4, name: 'Esmalte nude', category: 'Uñas', price: 65, stock: 18, min: 5, icon: '💅' },
    { id: 5, name: 'Protector térmico', category: 'Styling', price: 125, stock: 3, min: 5, icon: '✨' },
  ],
  clients: [
    { id: 1, name: 'Mariana López', phone: '5551-2345', visits: 12, initials: 'ML' },
    { id: 2, name: 'Daniela Pérez', phone: '5552-3456', visits: 8, initials: 'DP' },
    { id: 3, name: 'Andrea Castillo', phone: '5553-4567', visits: 6, initials: 'AC' },
    { id: 4, name: 'Gabriela Méndez', phone: '5554-5678', visits: 4, initials: 'GM' },
  ],
  appointments: [
    { id: 101, time: '09:00', client: 'Mariana López', serviceId: 2, staffId: 1, status: 'Confirmada' },
    { id: 102, time: '10:30', client: 'Daniela Pérez', serviceId: 3, staffId: 2, status: 'En proceso' },
    { id: 103, time: '11:45', client: 'Andrea Castillo', serviceId: 1, staffId: 3, status: 'Pendiente' },
    { id: 104, time: '14:00', client: 'Gabriela Méndez', serviceId: 4, staffId: 4, status: 'Confirmada' },
    { id: 105, time: '16:00', client: 'Mariana López', serviceId: 5, staffId: 1, status: 'Pendiente' },
  ],
  sales: [
    { id: 4001, date: '2026-10-26', client: 'Mariana López', item: 'Coloración premium', amount: 450, method: 'Tarjeta', staffId: 1, commission: 157.5 },
    { id: 4002, date: '2026-10-26', client: 'Daniela Pérez', item: 'Manicure gel', amount: 160, method: 'Efectivo', staffId: 2, commission: 48 },
    { id: 4003, date: '2026-10-26', client: 'Andrea Castillo', item: 'Corte & styling', amount: 180, method: 'Transferencia', staffId: 3, commission: 54 },
  ],
}

const menu = [
  ['dashboard', LayoutDashboard, 'Resumen'], ['agenda', CalendarDays, 'Agenda de citas'], ['pos', ShoppingBag, 'Punto de venta'],
  ['services', Scissors, 'Servicios'], ['clients', Users, 'Clientes'], ['inventory', Package, 'Inventario'],
  ['commissions', CircleDollarSign, 'Comisiones'], ['staff', Heart, 'Equipo'], ['reports', Activity, 'Reportes'],
]
const labels = { dashboard: 'Resumen general', agenda: 'Agenda de citas', pos: 'Punto de venta', services: 'Catálogo de servicios', clients: 'Directorio de clientes', inventory: 'Inventario de productos', commissions: 'Comisiones del equipo', staff: 'Nuestro equipo', reports: 'Reportes y estadísticas' }
const money = n => `Q ${Number(n || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const today = () => new Date().toISOString().slice(0, 10)
const initial = () => {
  try {
    const s = JSON.parse(localStorage.getItem('atelier-beauty-v1'))
    return s && Object.keys(seed).every(k => Array.isArray(s[k])) ? s : seed
  } catch { return seed }
}

function App() {
  const [db, setDb] = useState(initial)
  const [page, setPage] = useState('dashboard')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [payment, setPayment] = useState('Efectivo')
  const [selectedStaff, setSelectedStaff] = useState(1)
  const [selectedClient, setSelectedClient] = useState('Cliente general')
  const [form, setForm] = useState({})

  const mutate = updater => setDb(prev => {
    const next = updater(prev)
    localStorage.setItem('atelier-beauty-v1', JSON.stringify(next))
    return next
  })
  const notify = msg => { setToast(msg); window.setTimeout(() => setToast(''), 3300) }
  const showModal = (type, values = {}) => { setForm(values); setModal(type) }
  const go = target => { setPage(target); setSearch(''); setMobileOpen(false) }
  const service = id => db.services.find(s => s.id === Number(id))
  const person = id => db.staff.find(s => s.id === Number(id))
  const totalRevenue = db.sales.reduce((a, s) => a + s.amount, 0)
  const lowStock = db.products.filter(p => p.stock <= p.min)
  const todayAppointments = db.appointments.filter(a => a.status !== 'Cancelada')
  const totalCommissions = db.sales.reduce((a, s) => a + (s.commission || 0), 0)
  const chart = [42, 64, 51, 75, 59, 90, 72]
  const lastDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const filtered = items => items.filter(item => Object.values(item).join(' ').toLowerCase().includes(search.toLowerCase()))
  const cartTotal = cart.reduce((n, x) => n + x.price * x.qty, 0)

  const saveForm = e => {
    e.preventDefault()
    const id = Date.now()
    const val = key => String(form[key] ?? '').trim()
    if (modal === 'appointment') {
      mutate(d => ({ ...d, appointments: [...d.appointments, { id, time: val('time'), client: val('client'), serviceId: Number(form.serviceId), staffId: Number(form.staffId), status: 'Pendiente' }].sort((a,b) => a.time.localeCompare(b.time)) }))
    } else if (modal === 'client') {
      mutate(d => ({ ...d, clients: [...d.clients, { id, name: val('name'), phone: val('phone'), visits: 0, initials: val('name').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }] }))
    } else if (modal === 'service') {
      mutate(d => ({ ...d, services: [...d.services, { id, name: val('name'), category: val('category'), price: Number(form.price), duration: Number(form.duration), icon: '✨' }] }))
    } else if (modal === 'product') {
      mutate(d => ({ ...d, products: [...d.products, { id, name: val('name'), category: val('category'), price: Number(form.price), stock: Number(form.stock), min: Number(form.min), icon: '🧴' }] }))
    } else if (modal === 'staff') {
      mutate(d => ({ ...d, staff: [...d.staff, { id, name: val('name'), role: val('role'), rate: Number(form.rate), tone: '#987d86' }] }))
    } else if (modal === 'stock') {
      mutate(d => ({ ...d, products: d.products.map(p => p.id === Number(form.id) ? { ...p, stock: p.stock + Number(form.quantity) } : p) }))
    }
    setModal(null)
    notify('Cambios guardados correctamente')
  }
  const addToCart = item => {
    setCart(old => {
      const found = old.find(x => x.key === item.key)
      return found ? old.map(x => x.key === item.key ? { ...x, qty: x.qty + 1 } : x) : [...old, { ...item, qty: 1 }]
    })
    notify(`${item.name} agregado a la venta`)
  }
  const checkout = () => {
    if (!cart.length) return
    const invalid = cart.find(c => c.type === 'product' && (db.products.find(p => p.id === c.id)?.stock || 0) < c.qty)
    if (invalid) return notify(`No hay existencias suficientes de ${invalid.name}`)
    const staff = person(selectedStaff)
    const commission = cart.filter(x => x.type === 'service').reduce((sum, x) => sum + x.price * x.qty * (staff?.rate || 0) / 100, 0)
    const sale = { id: Date.now(), date: today(), client: selectedClient, item: cart.map(x => `${x.name}${x.qty > 1 ? ` ×${x.qty}` : ''}`).join(', '), amount: cartTotal, method: payment, staffId: selectedStaff, commission }
    mutate(d => ({ ...d, sales: [sale, ...d.sales], products: d.products.map(p => ({ ...p, stock: p.stock - (cart.find(x => x.type === 'product' && x.id === p.id)?.qty || 0) })), clients: d.clients.map(c => c.name === selectedClient ? { ...c, visits: c.visits + 1 } : c) }))
    setCart([]); setModal('receipt'); setForm(sale); notify('Venta registrada exitosamente')
  }
  const completeAppointment = a => {
    mutate(d => ({ ...d, appointments: d.appointments.map(x => x.id === a.id ? { ...x, status: 'Completada' } : x) }))
    const s = service(a.serviceId)
    if (s) { setCart([{ key: `s-${s.id}`, type: 'service', ...s, qty: 1 }]); setSelectedStaff(a.staffId); setSelectedClient(a.client); go('pos'); notify('Cita completada · lista para cobrar') }
  }
  const exportCSV = () => {
    const header = ['ID', 'Fecha', 'Cliente', 'Detalle', 'Total', 'Método', 'Comisión']
    const rows = db.sales.map(s => [s.id, s.date, s.client, s.item, s.amount, s.method, s.commission])
    const content = [header, ...rows].map(row => row.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\r\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8;' })); a.download = 'atelier-beauty-ventas.csv'; a.click(); URL.revokeObjectURL(a.href)
    notify('Reporte CSV descargado')
  }
  const field = (name, label, type = 'text', props = {}) => <label className="field" key={name}><span>{label}</span><input required name={name} type={type} min={type === 'number' ? 0 : undefined} value={form[name] ?? ''} onChange={e => setForm({ ...form, [name]: e.target.value })} {...props} /></label>
  const selectField = (name, label, options) => <label className="field" key={name}><span>{label}</span><select required value={form[name] ?? ''} onChange={e => setForm({ ...form, [name]: e.target.value })}><option value="" disabled>Seleccionar...</option>{options.map(o => <option key={o.id || o} value={o.id || o}>{o.name || o}</option>)}</select></label>
  const modalTitles = { appointment: 'Nueva cita', client: 'Nuevo cliente', service: 'Nuevo servicio', product: 'Nuevo producto', staff: 'Nuevo profesional', stock: 'Registrar entrada', receipt: 'Venta realizada' }
  const action = (label, fn, Icon = Plus) => <button className="primary-btn" onClick={fn}><Icon size={17}/>{label}</button>

  return <div className="shell">
    {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand" onClick={() => go('dashboard')}><div className="brand-symbol"><Sparkles size={23} strokeWidth={1.5}/></div><div><strong>atelier<span>beauty</span></strong><small>SALON MANAGEMENT</small></div></div>
      <div className="workspace"><div className="workspace-avatar">A</div><div className="workspace-name"><strong>Atelier Beauty Studio</strong><small>Plan demostración</small></div><ChevronDown size={15}/></div>
      <span className="side-label">ESPACIO DE TRABAJO</span>
      <nav>{menu.map(([key, Icon, title]) => <button className={`nav-item ${page === key ? 'active' : ''}`} key={key} onClick={() => go(key)}><Icon size={19} strokeWidth={1.8}/><span>{title}</span>{key === 'agenda' && <em>{todayAppointments.length}</em>}{key === 'inventory' && lowStock.length > 0 && <i/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={19}/></div><strong>Tu belleza, organizada.</strong><p>Una experiencia más simple para hacer crecer tu salón.</p><span>DEMO INTERACTIVA</span></div><div className="profile"><div className="profile-avatar">AD</div><div><strong>Administrador</strong><small>Cuenta demo</small></div><MoreHorizontal size={18}/></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb"><button className="hamburger" onClick={() => setMobileOpen(true)}><Menu size={22}/></button><span>Atelier Beauty</span><ChevronRight size={15}/><strong>{labels[page]}</strong></div><div className="top-actions"><div className="today-pill"><CalendarDays size={15}/>{new Date().toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</div><button className="icon-button" onClick={() => go('inventory')} aria-label="Ver alertas"><Bell size={19}/>{lowStock.length > 0 && <i/>}</button><div className="header-avatar">AD</div></div></header>
      <div className="content">
        {page === 'dashboard' && <>
          <div className="welcome"><div><div className="eyebrow"><Sparkles size={14}/> TU ESPACIO DE BELLEZA</div><h1>Buenos días, <i>Atelier.</i> <span>✳</span></h1><p>Todo lo que necesitas para que hoy sea un gran día en tu salón.</p></div>{action('Agendar cita', () => showModal('appointment'), Plus)}</div>
          <div className="hero"><div className="hero-copy"><div className="hero-kicker"><span/> TU NEGOCIO, EN ARMONÍA</div><h2>Donde la belleza<br/>encuentra <em>organización.</em></h2><p>Una forma más elegante de gestionar tus citas, ventas y el talento que hace único a tu salón.</p><button onClick={() => go('agenda')}>Ver agenda de hoy <ArrowRight size={17}/></button></div><div className="hero-art"><div className="art-ring ring-1"/><div className="art-ring ring-2"/><div className="art-flower flower-a">✳</div><div className="art-flower flower-b">✿</div><div className="art-word">a<span>.</span></div></div></div>
          <div className="stat-grid"><Stat label="Ingresos registrados" value={money(totalRevenue)} trend="Ventas de la demo" icon={Wallet} tone="rose"/><Stat label="Citas agendadas" value={todayAppointments.length.toString().padStart(2,'0')} trend="Agenda activa" icon={CalendarDays} tone="purple"/><Stat label="Clientes registrados" value={db.clients.length.toString().padStart(2,'0')} trend="En tu directorio" icon={Users} tone="sage"/><Stat label="Productos con alerta" value={lowStock.length.toString().padStart(2,'0')} trend="Requieren atención" icon={Package} tone="gold" alert={lowStock.length > 0}/></div>
          <div className="dashboard-grid"><section className="panel appointments-panel"><div className="panel-head"><div><div className="section-kicker">TU DÍA EN UN VISTAZO</div><h3>Próximas citas</h3></div><button className="text-link" onClick={() => go('agenda')}>Ver agenda <ArrowRight size={16}/></button></div><div className="appointment-list">{db.appointments.slice(0,4).map(a => <div className="appointment-row" key={a.id}><div className="appt-time">{a.time}<span>HOY</span></div><div className="appt-dot"/><div className="appt-person"><strong>{a.client}</strong><small>{service(a.serviceId)?.name} · {person(a.staffId)?.name}</small></div><Status value={a.status}/></div>)}</div><button className="panel-bottom" onClick={() => go('agenda')}>Gestionar todas las citas <ArrowRight size={16}/></button></section>
          <section className="panel performance-panel"><div className="panel-head"><div><div className="section-kicker">EL PULSO DE TU NEGOCIO</div><h3>Actividad semanal</h3></div><span className="mini-tag"><span/> Esta semana</span></div><div className="chart-area"><div className="chart-lines"><span>Q 1,500</span><span>Q 1,000</span><span>Q 500</span><span>Q 0</span></div><div className="bars">{chart.map((n,i) => <div className="bar-slot" key={i}><div className={`bar ${i === 5 ? 'highlight' : ''}`} style={{ height: `${n}%` }}/><span>{lastDays[i]}</span></div>)}</div></div><div className="performance-footer"><div><span>Ingresos de muestra</span><strong>{money(totalRevenue)}</strong></div><div className="perf-icon"><TrendingUp size={22}/></div></div></section></div>
          <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><div className="section-kicker">ATENCIÓN A LOS DETALLES</div><h3>Inventario por revisar</h3></div><button className="text-link" onClick={() => go('inventory')}>Ver inventario <ArrowRight size={16}/></button></div>{lowStock.length ? lowStock.slice(0,3).map(p => <div className="small-list-item" key={p.id}><span className="item-emoji">{p.icon}</span><div><strong>{p.name}</strong><small>Existencias: {p.stock} · Mínimo: {p.min}</small></div><span className="warning-tag">Stock bajo</span></div>) : <Empty text="Todos los productos tienen existencias suficientes."/>}</section><section className="panel"><div className="panel-head"><div><div className="section-kicker">RECIENTEMENTE</div><h3>Últimas ventas</h3></div><button className="text-link" onClick={() => go('reports')}>Ver reportes <ArrowRight size={16}/></button></div>{db.sales.slice(0,3).map(s => <div className="small-list-item" key={s.id}><span className="item-emoji sale-emoji"><ShoppingBag size={19}/></span><div><strong>{s.client}</strong><small>{s.item}</small></div><b>{money(s.amount)}</b></div>)}</section></div>
        </>}
        {page === 'agenda' && <><PageHeader kicker="PLANIFICA CON CALMA" title="Agenda de citas" subtitle="Organiza tus reservas y acompaña a cada clienta en su experiencia." right={action('Nueva cita', () => showModal('appointment'))}/><div className="date-banner"><div><CalendarDays size={21}/><div><strong>Agenda del salón</strong><span>Vista de demostración · Hoy</span></div></div><div className="agenda-count">{db.appointments.length} citas registradas</div></div><section className="panel table-panel"><div className="panel-head"><h3>Reservaciones</h3><SearchBox value={search} onChange={setSearch}/></div><div className="table-wrap"><table><thead><tr><th>Hora</th><th>Cliente</th><th>Servicio</th><th>Profesional</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{filtered(db.appointments).map(a => <tr key={a.id}><td><strong>{a.time}</strong></td><td>{a.client}</td><td>{service(a.serviceId)?.name}</td><td>{person(a.staffId)?.name}</td><td><Status value={a.status}/></td><td>{a.status !== 'Completada' && a.status !== 'Cancelada' ? <button className="table-action" onClick={() => completeAppointment(a)}>Completar y cobrar <ArrowRight size={14}/></button> : <span className="muted">—</span>}</td></tr>)}</tbody></table></div></section></>}
        {page === 'pos' && <><PageHeader kicker="CADA DETALLE CUENTA" title="Punto de venta" subtitle="Cobra servicios y productos en un solo lugar."/><div className="pos-layout"><section className="panel pos-catalog"><div className="panel-head"><h3>Selecciona servicios y productos</h3></div><div className="catalog-section"><div className="catalog-caption">SERVICIOS</div><div className="catalog-grid">{db.services.map(s => <button key={s.id} className="catalog-item" onClick={() => addToCart({ ...s, key: `s-${s.id}`, type: 'service' })}><span className="catalog-emoji">{s.icon}</span><strong>{s.name}</strong><small>{s.duration} min</small><b>{money(s.price)}</b><span className="catalog-plus"><Plus size={15}/></span></button>)}</div></div><div className="catalog-section"><div className="catalog-caption">PRODUCTOS</div><div className="catalog-grid">{db.products.map(p => <button disabled={p.stock < 1} key={p.id} className="catalog-item" onClick={() => addToCart({ ...p, key: `p-${p.id}`, type: 'product' })}><span className="catalog-emoji">{p.icon}</span><strong>{p.name}</strong><small>{p.stock} disponibles</small><b>{money(p.price)}</b><span className="catalog-plus"><Plus size={15}/></span></button>)}</div></div></section><section className="panel checkout"><div className="panel-head"><h3>Venta actual</h3><span className="mini-tag">{cart.reduce((n,x)=>n+x.qty,0)} artículos</span></div><label className="field"><span>Cliente</span><select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}><option>Cliente general</option>{db.clients.map(c => <option key={c.id}>{c.name}</option>)}</select></label><label className="field"><span>Profesional responsable</span><select value={selectedStaff} onChange={e => setSelectedStaff(Number(e.target.value))}>{db.staff.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><div className="cart-list">{cart.length ? cart.map(item => <div className="cart-row" key={item.key}><span className="cart-icon">{item.icon}</span><div><strong>{item.name}</strong><small>{item.qty} × {money(item.price)}</small></div><b>{money(item.qty*item.price)}</b><button aria-label="Quitar" onClick={() => setCart(old => old.filter(x=>x.key!==item.key))}><X size={15}/></button></div>) : <div className="empty-cart"><ShoppingBag size={31}/><strong>Tu carrito está vacío</strong><p>Selecciona servicios o productos para comenzar.</p></div>}</div><div className="checkout-bottom"><div className="total-line"><span>Total a cobrar</span><strong>{money(cartTotal)}</strong></div><div className="payment-label">MÉTODO DE PAGO</div><div className="payment-options">{['Efectivo','Tarjeta','Transferencia'].map(p => <button key={p} onClick={() => setPayment(p)} className={payment===p?'chosen':''}>{p}</button>)}</div><button className="checkout-btn" disabled={!cart.length} onClick={checkout}><CreditCard size={18}/> Registrar venta <ArrowRight size={17}/></button><small className="demo-notice">Simulación · No se procesa ningún pago real</small></div></section></div></>}
        {page === 'services' && <><PageHeader kicker="TU ARTE, TU ESPECIALIDAD" title="Nuestros servicios" subtitle="Un catálogo para presentar lo mejor de tu salón." right={action('Añadir servicio', () => showModal('service'))}/><div className="service-grid">{filtered(db.services).map(s => <div className="service-card" key={s.id}><div className="service-art">{s.icon}<span>ATELIER BEAUTY</span></div><div className="service-info"><span className="category">{s.category}</span><h3>{s.name}</h3><div><span><Clock3 size={15}/>{s.duration} minutos</span><strong>{money(s.price)}</strong></div></div></div>)}</div></>}
        {page === 'clients' && <><PageHeader kicker="RELACIONES QUE FLORECEN" title="Tus clientes" subtitle="Cada visita es una oportunidad para crear una experiencia memorable." right={action('Nuevo cliente', () => showModal('client'))}/><section className="panel table-panel"><div className="panel-head"><h3>Directorio de clientes <span className="count">{db.clients.length}</span></h3><SearchBox value={search} onChange={setSearch}/></div><div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Teléfono</th><th>Visitas</th><th>Estado</th></tr></thead><tbody>{filtered(db.clients).map(c => <tr key={c.id}><td><div className="table-person"><span className="initials">{c.initials}</span><strong>{c.name}</strong></div></td><td>{c.phone}</td><td>{c.visits}</td><td><span className="positive-tag">Activo</span></td></tr>)}</tbody></table></div></section></>}
        {page === 'inventory' && <><PageHeader kicker="TODO EN SU LUGAR" title="Inventario" subtitle="Controla tus existencias y mantén tus productos siempre disponibles." right={action('Añadir producto', () => showModal('product'))}/><div className="mini-stats"><div><Package size={22}/><span>Productos registrados</span><strong>{db.products.length}</strong></div><div><Activity size={22}/><span>Unidades disponibles</span><strong>{db.products.reduce((a,p)=>a+p.stock,0)}</strong></div><div className="warn"><Bell size={22}/><span>Alertas de stock</span><strong>{lowStock.length}</strong></div></div><section className="panel table-panel"><div className="panel-head"><h3>Catálogo de productos</h3><SearchBox value={search} onChange={setSearch}/></div><div className="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Existencias</th><th>Estado</th><th>Movimiento</th></tr></thead><tbody>{filtered(db.products).map(p => <tr key={p.id}><td><div className="table-person"><span className="product-symbol">{p.icon}</span><strong>{p.name}</strong></div></td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td><td>{p.stock <= p.min ? <span className="warning-tag">Stock bajo</span> : <span className="positive-tag">Disponible</span>}</td><td><button className="table-action" onClick={() => showModal('stock',{ id:p.id, quantity: 1 })}><Plus size={14}/> Entrada</button></td></tr>)}</tbody></table></div></section></>}
        {page === 'commissions' && <><PageHeader kicker="RECONOCE EL TALENTO" title="Comisiones" subtitle="Transparencia en cada venta y reconocimiento al trabajo de tu equipo."/><div className="mini-stats"><div><CircleDollarSign size={22}/><span>Comisiones acumuladas</span><strong>{money(totalCommissions)}</strong></div><div><Users size={22}/><span>Profesionales</span><strong>{db.staff.length}</strong></div><div><BadgeCheck size={22}/><span>Ventas registradas</span><strong>{db.sales.length}</strong></div></div><div className="commission-grid">{db.staff.map(s => {const sales = db.sales.filter(x=>x.staffId===s.id);return <div className="commission-card" key={s.id}><div className="team-avatar" style={{background:s.tone}}>{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div><strong>{s.name}</strong><small>{s.role}</small></div><span className="commission-rate">{s.rate}%</span><div className="commission-total"><span>Comisión generada</span><strong>{money(sales.reduce((n,x)=>n+x.commission,0))}</strong><small>{sales.length} ventas asociadas</small></div></div>})}</div></>}
        {page === 'staff' && <><PageHeader kicker="LAS MANOS DETRÁS DE LA MAGIA" title="Nuestro equipo" subtitle="Personas talentosas que hacen especial cada visita." right={action('Añadir profesional', () => showModal('staff'))}/><div className="team-grid">{db.staff.map((s,i) => <div className="team-card" key={s.id}><div className="team-cover" style={{background:`linear-gradient(125deg,${s.tone},#d7c7bc)`}}><span>✳</span></div><div className="team-avatar large" style={{background:s.tone}}>{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><h3>{s.name}</h3><p>{s.role}</p><div><span>Comisión por servicio</span><strong>{s.rate}%</strong></div></div>)}</div></>}
        {page === 'reports' && <><PageHeader kicker="CONOCE TU CRECIMIENTO" title="Reportes" subtitle="Resultados claros para tomar mejores decisiones cada día." right={action('Exportar CSV', exportCSV, Download)}/><div className="mini-stats"><div><Wallet size={22}/><span>Ventas totales</span><strong>{money(totalRevenue)}</strong></div><div><ShoppingBag size={22}/><span>Transacciones</span><strong>{db.sales.length}</strong></div><div><CircleDollarSign size={22}/><span>Comisiones</span><strong>{money(totalCommissions)}</strong></div></div><section className="panel table-panel"><div className="panel-head"><h3>Historial de ventas</h3><span className="mini-tag">Registros de demostración</span></div><div className="table-wrap"><table><thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Detalle</th><th>Método</th><th>Total</th></tr></thead><tbody>{db.sales.map(s => <tr key={s.id}><td>#{String(s.id).slice(-5)}</td><td>{s.date}</td><td>{s.client}</td><td className="truncate-cell">{s.item}</td><td>{s.method}</td><td><strong>{money(s.amount)}</strong></td></tr>)}</tbody></table></div></section></>}
        <footer>Atelier Beauty · Prototipo comercial de <strong>DEVSYSGT</strong><span>Datos ficticios · Sin pagos reales</span></footer>
      </div>
    </main>
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setModal(null)}}><div className="modal"><div className="modal-header"><div><div className="section-kicker">ATELIER BEAUTY</div><h2>{modalTitles[modal]}</h2></div><button className="icon-button" onClick={()=>setModal(null)}><X size={21}/></button></div>{modal === 'receipt' ? <div className="receipt"><div className="receipt-brand">atelier<span>beauty</span></div><p>Comprobante de demostración</p><div className="receipt-row"><span>Folio</span><b>#{String(form.id).slice(-6)}</b></div><div className="receipt-row"><span>Cliente</span><b>{form.client}</b></div><div className="receipt-row"><span>Detalle</span><b>{form.item}</b></div><div className="receipt-row"><span>Pago</span><b>{form.method}</b></div><div className="receipt-row receipt-total"><span>TOTAL</span><b>{money(form.amount)}</b></div><small>Gracias por tu visita. Este ticket es una simulación.</small><button className="primary-btn full" onClick={()=>setModal(null)}>Cerrar</button></div> : <form onSubmit={saveForm} className="modal-form">
      {modal==='appointment' && <>{field('client','Nombre de clienta')}{field('time','Hora de cita','time')}{selectField('serviceId','Servicio',db.services)}{selectField('staffId','Profesional',db.staff)}</>}
      {modal==='client' && <>{field('name','Nombre completo')}{field('phone','Teléfono','tel')}</>}
      {modal==='service' && <>{field('name','Nombre del servicio')}{field('category','Categoría')}{field('price','Precio (Q)','number',{step:'0.01'})}{field('duration','Duración (minutos)','number')}</>}
      {modal==='product' && <>{field('name','Nombre del producto')}{field('category','Categoría')}{field('price','Precio (Q)','number',{step:'0.01'})}{field('stock','Existencias iniciales','number')}{field('min','Stock mínimo','number')}</>}
      {modal==='staff' && <>{field('name','Nombre completo')}{field('role','Especialidad')}{field('rate','Comisión (%)','number',{max:100})}</>}
      {modal==='stock' && <><p className="form-note">Producto: <b>{db.products.find(p=>p.id===Number(form.id))?.name}</b></p>{field('quantity','Unidades que ingresan','number',{min:1})}</>}
      <div className="modal-buttons"><button type="button" className="secondary-btn" onClick={()=>setModal(null)}>Cancelar</button><button type="submit" className="primary-btn"><Check size={16}/>Guardar cambios</button></div>
    </form>}</div></div>}
  </div>
}

function Stat({ label, value, trend, icon: Icon, tone, alert }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={20}/></div></div><strong>{value}</strong><small className={alert?'alert-text':''}>{alert ? <ArrowUpRight size={13}/> : <ArrowUpRight size={13}/>} {trend}</small></div> }
function Status({value}) { const cls = value==='Completada'?'done':value==='En proceso'?'progress':value==='Confirmada'?'confirmed':value==='Cancelada'?'cancelled':'pending';return <span className={`status ${cls}`}><i/>{value}</span> }
function PageHeader({kicker,title,subtitle,right}) {return <div className="page-header"><div><div className="eyebrow"><Sparkles size={14}/>{kicker}</div><h1>{title}<span className="title-dot">.</span></h1><p>{subtitle}</p></div>{right}</div>}
function SearchBox({value,onChange}) {return <label className="search-box"><Search size={17}/><input placeholder="Buscar..." value={value} onChange={e=>onChange(e.target.value)}/></label>}
function Empty({text}) {return <div className="empty-state"><BadgeCheck size={25}/>{text}</div>}

export default App
