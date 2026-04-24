import Database from 'better-sqlite3';

const db = new Database('production.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    full_name TEXT
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE IF NOT EXISTS work_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    current_stage TEXT,
    docket_update TEXT,
    priority INTEGER,
    so_number TEXT UNIQUE,
    planning_received_date TEXT,
    order_type TEXT,
    order_qty INTEGER,
    delivered INTEGER,
    balance INTEGER,
    fg_description TEXT,
    customer_name TEXT,
    delivery_date_cs TEXT,
    time TEXT,
    value TEXT,
    department_id INTEGER,
    machine_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id),
    FOREIGN KEY(machine_id) REFERENCES machines(id)
  );

  CREATE TABLE IF NOT EXISTS bom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fg_item_code TEXT,
    material_code TEXT,
    description TEXT,
    quantity_per_unit REAL,
    uom TEXT
  );
`);

const departments = [
  "Thermal", "Flexo", "PFL", "Heat Transfer", "RFID", "Offset", "Levi's"
];

const rfidSeedData = [
  {
    current_stage: "RELEASED TO DISPATCH",
    docket_update: "Encoding CL 524H - NEW",
    priority: 2,
    so_number: "26009967_0",
    planning_received_date: "6-Apr",
    order_type: "CUSTOMER URGENCY",
    order_qty: 318688,
    delivered: 311957,
    balance: 6731,
    fg_description: "FG_WMUS_GENA30155_HTG_RFID_RT",
    customer_name: "R-PAC (MIDDLE EAST) LTD - T",
    delivery_date_cs: "2026-04-27",
    time: "21:00:00",
    value: "$9,847",
    dept: "RFID"
  },
  {
    current_stage: "RELEASED TO PRODUCTION",
    docket_update: "N/A",
    priority: 3,
    so_number: "26010768_0",
    planning_received_date: "10-Apr",
    order_type: "REPLACEMENT",
    order_qty: 27,
    delivered: 0,
    balance: 27,
    fg_description: "FG_MMN_54-1023_RT",
    customer_name: "UNILAK FASHIONS (PVT) LTD",
    delivery_date_cs: "2026-04-18",
    time: "06:00:00",
    value: "$0",
    dept: "RFID"
  },
  {
    current_stage: "RECEIVED BY DISPATCH",
    docket_update: "Encoding CL 524H - NEW",
    priority: 5,
    so_number: "26008000_0",
    planning_received_date: "18-Mar",
    order_type: "CUSTOMER URGENCY",
    order_qty: 27897,
    delivered: 25269,
    balance: 2628,
    fg_description: "FG_BH26_RFID_RP_SMUPF_NOMSRP_HTI",
    customer_name: "DTRT APPAREL LTD",
    delivery_date_cs: "2026-04-16",
    time: "21:00:00",
    value: "$0",
    dept: "RFID"
  },
  {
    current_stage: "RECEIVED BY DISPATCH",
    docket_update: "Encoding CL 524H - NEW",
    priority: 4,
    so_number: "26008012_7",
    planning_received_date: "18-Mar",
    order_type: "CUSTOMER URGENCY",
    order_qty: 24153,
    delivered: 23805,
    balance: 348,
    fg_description: "FG_WNN_WNB38005RFID_RT",
    customer_name: "JAY JAY MILLS LANKA (PVT) LTD",
    delivery_date_cs: "2026-04-16",
    time: "17:00:00",
    value: "$1,618",
    dept: "RFID"
  },
  {
    current_stage: "RECEIVED BY DISPATCH",
    docket_update: "INKJET-526",
    priority: 1,
    so_number: "26008012_5",
    planning_received_date: "18-Mar",
    order_type: "CUSTOMER URGENCY",
    order_qty: 48330,
    delivered: 47754,
    balance: 576,
    fg_description: "FG_WNN_WNB38005RFID_RT",
    customer_name: "JAY JAY MILLS LANKA (PVT) LTD",
    delivery_date_cs: "2026-04-16",
    time: "17:00:00",
    value: "$3,238",
    dept: "RFID"
  }
];

// Helper to seed the database
export function seedDatabase() {
  const userCheck = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCheck.count === 0) {
    db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)').run('admin', 'admin123', 'admin', 'System Administrator');
    db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)').run('planner', 'plan123', 'planner', 'Production Planner');
    db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)').run('manager', 'manage123', 'management', 'Plant Manager');
    db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)').run('supervisor', 'super123', 'supervisor', 'Shift Supervisor');
  }

  const deptCheck = db.prepare('SELECT count(*) as count FROM departments').get() as { count: number };
  if (deptCheck.count === 0) {
    const insert = db.prepare('INSERT INTO departments (name) VALUES (?)');
    departments.forEach(d => insert.run(d));
  }

  const orderCheck = db.prepare('SELECT count(*) as count FROM work_orders').get() as { count: number };
  if (orderCheck.count === 0) {
    const rfidId = (db.prepare('SELECT id FROM departments WHERE name = ?').get('RFID') as any).id;
    const flexoId = (db.prepare('SELECT id FROM departments WHERE name = ?').get('Flexo') as any).id;
    const thermalId = (db.prepare('SELECT id FROM departments WHERE name = ?').get('Thermal') as any).id;

    const insert = db.prepare(`
      INSERT INTO work_orders (
        current_stage, docket_update, priority, so_number, 
        planning_received_date, order_type, order_qty, delivered, 
        balance, fg_description, customer_name, delivery_date_cs, 
        time, value, department_id
      ) VALUES (
        @current_stage, @docket_update, @priority, @so_number, 
        @planning_received_date, @order_type, @order_qty, @delivered, 
        @balance, @fg_description, @customer_name, @delivery_date_cs, 
        @time, @value, @department_id
      )
    `);

    const insertMany = db.transaction((data) => {
      for (const row of data) insert.run(row);
    });

    const extendedSeedData = [
      ...rfidSeedData.map(r => ({ ...r, department_id: rfidId })),
      {
        current_stage: "IN PRODUCTION",
        docket_update: "Flexo Printing",
        priority: 4,
        so_number: "FLX-99001",
        planning_received_date: "12-Apr",
        order_type: "REGULAR",
        order_qty: 50000,
        delivered: 12000,
        balance: 38000,
        fg_description: "FG_FLEXO_LABEL_4X6",
        customer_name: "GLOBAL LOGISTICS INC",
        delivery_date_cs: "2026-05-02",
        time: "08:00:00",
        value: "$2,500",
        department_id: flexoId
      },
      {
        current_stage: "RECEIVED BY PRODUCTION",
        docket_update: "Thermal Plotting",
        priority: 5,
        so_number: "THM-44221",
        planning_received_date: "14-Apr",
        order_type: "URGENT",
        order_qty: 100000,
        delivered: 0,
        balance: 100000,
        fg_description: "FG_THERMAL_TICKET_V3",
        customer_name: "EXPRESS RETAIL LTD",
        delivery_date_cs: "2026-04-25",
        time: "12:00:00",
        value: "$5,200",
        department_id: thermalId
      }
    ];

    insertMany(extendedSeedData);
  }

  const bomCheck = db.prepare('SELECT count(*) as count FROM bom').get() as { count: number };
  if (bomCheck.count === 0) {
    const insert = db.prepare('INSERT INTO bom (fg_item_code, material_code, description, quantity_per_unit, uom) VALUES (?, ?, ?, ?, ?)');
    insert.run('FG_WMUS_GENA30155_HTG_RFID_RT', 'MAT001', 'RFID Inlay', 1, 'PCS');
    insert.run('FG_WMUS_GENA30155_HTG_RFID_RT', 'MAT002', 'Adhesive substrate', 0.05, 'SQM');
    insert.run('FG_JYS_JSIN34926RFID_RT', 'MAT001', 'RFID Inlay', 1, 'PCS');
    insert.run('FG_JYS_JSIN34926RFID_RT', 'MAT003', 'Glossy Paper', 0.02, 'SQM');
  }

  const machineCheck = db.prepare('SELECT count(*) as count FROM machines').get() as { count: number };
  if (machineCheck.count === 0) {
      const rfidId = (db.prepare('SELECT id FROM departments WHERE name = ?').get('RFID') as any).id;
      const flexoId = (db.prepare('SELECT id FROM departments WHERE name = ?').get('Flexo') as any).id;
      const insert = db.prepare('INSERT INTO machines (name, department_id) VALUES (?, ?)');
      insert.run('RFID Inserter 1', rfidId);
      insert.run('RFID Inserter 2', rfidId);
      insert.run('Flexo Press 1', flexoId);
      insert.run('Flexo Press 2', flexoId);
  }
}

export default db;
