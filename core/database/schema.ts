export const setupDatabase = `
CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT,
  telefono TEXT,
  foto_perfil TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingresos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  monto REAL NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  icono TEXT,
  color TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bloques (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  parent_id INTEGER,
  nombre TEXT NOT NULL,
  tipo TEXT,
  imagen TEXT,
  color TEXT,
  fecha TEXT,
  total REAL,
  meta_monto REAL DEFAULT 0,
  es_ahorro INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES bloques (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presupuestos_mensuales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  categoria_id INTEGER,
  monto_maximo REAL NOT NULL,
  mes TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  categoria_id INTEGER,
  bloque_id INTEGER,
  monto REAL NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL,
  FOREIGN KEY (bloque_id) REFERENCES bloques (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items_bloque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bloque_id INTEGER,
  nombre TEXT NOT NULL,
  precio REAL NOT NULL,
  FOREIGN KEY (bloque_id) REFERENCES bloques (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS configuracion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER UNIQUE,
  modo_oscuro INTEGER DEFAULT 1,
  notificaciones INTEGER DEFAULT 1,
  tipo_seguridad TEXT DEFAULT 'ninguno',
  pin_seguridad TEXT,
  contrasena_seguridad TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificacion_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mensaje_id TEXT NOT NULL,
  enviado_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;
