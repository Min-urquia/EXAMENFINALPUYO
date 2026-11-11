
import { useState } from "react";
import "./App.css";

const menu = [
  { id: 1, nombre: "Hamburguesa clásica", categoria: "Hamburguesas", precio: 15, emoji: "🍔", descripcion: "Carne, queso, lechuga y tomate" },
  { id: 2, nombre: "Hamburguesa especial", categoria: "Hamburguesas", precio: 22, emoji: "🍔", descripcion: "Doble carne, queso y salsa especial" },
  { id: 3, nombre: "Pizza familiar", categoria: "Pizzas", precio: 35, emoji: "🍕", descripcion: "Queso, jamón y pepperoni" },
  { id: 4, nombre: "Pizza personal", categoria: "Pizzas", precio: 18, emoji: "🍕", descripcion: "Pizza individual con mozzarella" },
  { id: 5, nombre: "Pollo a la brasa", categoria: "Platos", precio: 28, emoji: "🍗", descripcion: "Pollo con papas y ensalada" },
  { id: 6, nombre: "Salchipapa", categoria: "Platos", precio: 14, emoji: "🍟", descripcion: "Salchicha, papas y cremas" },
  { id: 7, nombre: "Gaseosa", categoria: "Bebidas", precio: 4, emoji: "🥤", descripcion: "Bebida helada personal" },
  { id: 8, nombre: "Limonada", categoria: "Bebidas", precio: 2, emoji: "🍋", descripcion: "Limonada natural" },
];

const categorias = ["Todos", "Hamburguesas", "Pizzas", "Platos", "Bebidas"];

export default function App() {
  const [categoria, setCategoria] = useState("Todos");
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista] = useState("Inicio");
  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pago, setPago] = useState("Efectivo");
  const [pedidos, setPedidos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pedidosRestaurante")) || [];
    } catch {
      return [];
    }
  });
  const [mensaje, setMensaje] = useState("");

  const productosFiltrados =
    categoria === "Todos"
      ? menu
      : menu.filter((p) => p.categoria === categoria);

  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  function agregar(producto) {
    setCarrito((actual) => {
      const existe = actual.find((p) => p.id === producto.id);

      if (existe) {
        return actual.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });

    setMensaje("");
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((p) =>
          p.id === id
            ? { ...p, cantidad: p.cantidad + cambio }
            : p
        )
        .filter((p) => p.cantidad > 0)
    );
  }

  function confirmarPedido(e) {
    e.preventDefault();

    if (carrito.length === 0) {
      setMensaje("Agrega productos antes de confirmar.");
      return;
    }

    const nuevoPedido = {
      numero: Date.now(),
      cliente,
      direccion,
      pago,
      productos: carrito,
      total,
      fecha: new Date().toLocaleString("es-PE"),
      estado: "Pendiente",
    };

    const actualizados = [nuevoPedido, ...pedidos];

    setPedidos(actualizados);
    localStorage.setItem(
      "pedidosRestaurante",
      JSON.stringify(actualizados)
    );

    setCarrito([]);
    setCliente("");
    setDireccion("");
    setPago("Efectivo");
    setMensaje(`¡Pedido #${String(nuevoPedido.numero).slice(-6)} registrado correctamente!`);
    setVista("Pedidos");
  }

  function cambiarEstado(numero, estado) {
    const actualizados = pedidos.map((p) =>
      p.numero === numero ? { ...p, estado } : p
    );

    setPedidos(actualizados);
    localStorage.setItem(
      "pedidosRestaurante",
      JSON.stringify(actualizados)
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#" onClick={() => setVista("Inicio")}>
          <span>🍽️</span> Sabor Express
        </a>

        <nav>
          {["Inicio", "Menú", "Pedidos", "Contacto"].map((item) => (
            <button
              key={item}
              className={vista === item ? "nav-link activo" : "nav-link"}
              onClick={() => {
                setVista(item);
                setMensaje("");
              }}
            >
              {item}
              {item === "Pedidos" && pedidos.length > 0
                ? ` (${pedidos.length})`
                : ""}
            </button>
          ))}
        </nav>

        <button className="cart-button" onClick={() => setVista("Carrito")}>
          🛒 Carrito ({carrito.reduce((s, p) => s + p.cantidad, 0)})
        </button>
      </header>

      <main>
        {mensaje && (
          <div className="mensaje" role="status">
            {mensaje}
            <button onClick={() => setMensaje("")}>×</button>
          </div>
        )}

        {vista === "Inicio" && (
          <>
            <section className="hero">
              <div className="hero-text">
                <span className="etiqueta">SABOR QUE ENAMORA</span>
                <h1>Tu comida favorita,<br />a un clic de distancia.</h1>
                <p>
                  Descubre nuestros platos, arma tu pedido
                  y disfruta de algo delicioso.
                </p>
                <button className="btn-principal" onClick={() => setVista("Menú")}>
                  Ver nuestro menú →
                </button>
              </div>
              <div className="hero-food">🍔🍕🍗</div>
            </section>

            <section className="seccion">
              <h2>Los favoritos de la casa</h2>
              <p className="subtitulo">Los sabores que nuestros clientes aman.</p>
              <div className="productos-grid">
                {menu.slice(0, 3).map((p) => (
                  <Producto key={p.id} producto={p} agregar={agregar} />
                ))}
              </div>
            </section>
          </>
        )}

        {vista === "Menú" && (
          <section className="seccion">
            <h1>Nuestro menú</h1>
            <p className="subtitulo">Elige tus platos favoritos.</p>

            <div className="categorias">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  className={categoria === cat ? "categoria seleccionada" : "categoria"}
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="productos-grid">
              {productosFiltrados.map((p) => (
                <Producto key={p.id} producto={p} agregar={agregar} />
              ))}
            </div>
          </section>
        )}

        {vista === "Carrito" && (
          <section className="seccion">
            <h1>Tu carrito</h1>

            {carrito.length === 0 ? (
              <div className="vacio">
                <span>🛒</span>
                <h2>Tu carrito está vacío</h2>
                <button className="btn-principal" onClick={() => setVista("Menú")}>
                  Explorar menú
                </button>
              </div>
            ) : (
              <div className="checkout">
                <div className="panel">
                  {carrito.map((p) => (
                    <div className="carrito-item" key={p.id}>
                      <span className="item-emoji">{p.emoji}</span>
                      <div className="item-info">
                        <strong>{p.nombre}</strong>
                        <span>S/ {p.precio.toFixed(2)} por unidad</span>
                      </div>
                      <div className="cantidad">
                        <button onClick={() => cambiarCantidad(p.id, -1)}>−</button>
                        <strong>{p.cantidad}</strong>
                        <button onClick={() => cambiarCantidad(p.id, 1)}>+</button>
                      </div>
                      <strong>S/ {(p.precio * p.cantidad).toFixed(2)}</strong>
                    </div>
                  ))}
                  <div className="total">
                    <span>Total del pedido</span>
                    <strong>S/ {total.toFixed(2)}</strong>
                  </div>
                </div>

                <form className="panel formulario" onSubmit={confirmarPedido}>
                  <h2>Datos del cliente</h2>

                  <label>Nombre completo</label>
                  <input
                    required
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Escribe tu nombre"
                  />

                  <label>Dirección de entrega</label>
                  <input
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Dirección y referencia"
                  />

                  <label>Método de pago</label>
                  <select value={pago} onChange={(e) => setPago(e.target.value)}>
                    <option>Efectivo</option>
                    <option>Yape / Plin</option>
                    <option>Tarjeta</option>
                  </select>

                  <button className="btn-principal ancho" type="submit">
                    Confirmar pedido · S/ {total.toFixed(2)}
                  </button>
                </form>
              </div>
            )}
          </section>
        )}

        {vista === "Pedidos" && (
          <section className="seccion">
            <h1>Administración de pedidos</h1>
            <p className="subtitulo">Consulta y actualiza el estado de cada pedido.</p>

            {pedidos.length === 0 ? (
              <div className="vacio">
                <span>📋</span>
                <h2>Aún no hay pedidos registrados</h2>
              </div>
            ) : (
              <div className="lista-pedidos">
                {pedidos.map((p) => (
                  <article className="pedido-card" key={p.numero}>
                    <div className="pedido-cabecera">
                      <strong>Pedido #{String(p.numero).slice(-6)}</strong>
                      <span className={`estado ${p.estado.toLowerCase().replaceAll(" ", "-")}`}>
                        {p.estado}
                      </span>
                    </div>
                    <p><strong>Cliente:</strong> {p.cliente}</p>
                    <p><strong>Dirección:</strong> {p.direccion}</p>
                    <p><strong>Fecha:</strong> {p.fecha}</p>
                    <p><strong>Pago:</strong> {p.pago}</p>
                    <ul>
                      {p.productos.map((item) => (
                        <li key={item.id}>
                          {item.nombre} × {item.cantidad}
                        </li>
                      ))}
                    </ul>
                    <div className="pedido-pie">
                      <strong>Total: S/ {p.total.toFixed(2)}</strong>
                      <select
                        aria-label={`Estado del pedido ${p.numero}`}
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p.numero, e.target.value)}
                      >
                        <option>Pendiente</option>
                        <option>En preparación</option>
                        <option>En camino</option>
                        <option>Entregado</option>
                        <option>Cancelado</option>
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {vista === "Contacto" && (
          <section className="seccion contacto">
            <span className="contacto-icono">📍</span>
            <h1>Estamos para atenderte</h1>
            <p>Preparamos tus platos favoritos con ingredientes frescos.</p>
            <div className="panel">
              <p>📞 Teléfono: agrega aquí tu número</p>
              <p>🕒 Horario: lunes a domingo, 12:00 p. m. – 10:00 p. m.</p>
              <p>📍 Dirección: agrega aquí la dirección de tu restaurante</p>
            </div>
          </section>
        )}
      </main>

      <footer>
        <strong>🍽️ Sabor Express</strong>
        <p>Buenos sabores, buenos momentos.</p>
        <small>© 2026 Sabor Express. Todos los derechos reservados.</small>
      </footer>
    </div>
  );
}

function Producto({ producto, agregar }) {
  return (
    <article className="producto-card">
      <div className="producto-imagen">{producto.emoji}</div>
      <div className="producto-contenido">
        <span className="producto-categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="producto-pie">
          <strong>S/ {producto.precio.toFixed(2)}</strong>
          <button onClick={() => agregar(producto)}>+ Agregar</button>
        </div>
      </div>
    </article>
  );
}
