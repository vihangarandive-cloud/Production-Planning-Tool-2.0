import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sql from "mssql";
import mysql from "mysql2/promise";
import db, { seedDatabase } from "./database.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Connections (Lazy) ---
let mssqlPool: sql.ConnectionPool | null = null;
let mysqlPool: mysql.Pool | null = null;

async function getMSSQL() {
  if (!mssqlPool && process.env.MSSQL_SERVER) {
    try {
      const config: any = {
        server: process.env.MSSQL_SERVER!,
        database: process.env.MSSQL_DATABASE,
        port: parseInt(process.env.MSSQL_PORT || "1433"),
        options: { 
          encrypt: true, 
          trustServerCertificate: true,
          enableArithAbort: true
        },
      };

      if (process.env.MSSQL_DOMAIN) {
        config.authentication = {
          type: 'ntlm',
          options: {
            domain: process.env.MSSQL_DOMAIN,
            userName: process.env.MSSQL_USER,
            password: process.env.MSSQL_PASSWORD
          }
        };
      } else {
        config.user = process.env.MSSQL_USER;
        config.password = process.env.MSSQL_PASSWORD;
      }

      mssqlPool = await sql.connect(config);
      console.log("MSSQL Connected (Windows Auth: " + (!!process.env.MSSQL_DOMAIN) + ")");
    } catch (err) {
      console.error("MSSQL Connection Failed", err);
    }
  }
  return mssqlPool;
}

async function getMySQL() {
  if (!mysqlPool && process.env.MYSQL_HOST) {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: parseInt(process.env.MYSQL_PORT || "3306"),
      });
      console.log("MySQL Connected");
    } catch (err) {
      console.error("MySQL Connection Failed", err);
    }
  }
  return mysqlPool;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Local SQLite (for session/meta if needed or fallback)
  seedDatabase();

  // Unified Order API (Getting from MySQL - Production Tracking)
  app.get("/api/orders", async (req, res) => {
    const mysql = await getMySQL();
    const deptId = req.query.department_id;
    
    if (mysql) {
      try {
        let query = 'SELECT * FROM work_orders';
        const params = [];
        if (deptId) {
          query += ' WHERE department_id = ?';
          params.push(deptId);
        }
        const [rows] = await mysql.execute(query, params);
        return res.json(rows);
      } catch (err) {
        console.error("MySQL Query Error", err);
      }
    }
    
    // Fallback to local SQLite if MySQL not configured
    const sqliteDeptId = req.query.department_id;
    let query = `
      SELECT w.*, d.name as department_name, m.name as machine_name 
      FROM work_orders w
      LEFT JOIN departments d ON w.department_id = d.id
      LEFT JOIN machines m ON w.machine_id = m.id
    `;
    const params = [];
    if (sqliteDeptId) {
      query += ' WHERE w.department_id = ?';
      params.push(sqliteDeptId);
    }
    const orders = db.prepare(query).all(...params);
    res.json(orders);
  });

  // KPI route including MTD/YTD
  app.get("/api/dashboard/kpis", async (req, res) => {
    // In a real scenario, these would aggregate from the databases
    // For now, calculating from Local SQLite with dummy offsets for demo
    const totalOrders = db.prepare('SELECT SUM(order_qty) as total FROM work_orders').get() as any;
    const activeOrders = db.prepare('SELECT count(*) as count FROM work_orders WHERE balance > 0').get() as any;
    
    // MTD/YTD Logic (Mocked aggregation for now)
    const mtdCount = db.prepare("SELECT count(*) as count FROM work_orders WHERE delivery_date_cs >= date('now','start of month')").get() as any;
    const ytdCount = db.prepare("SELECT count(*) as count FROM work_orders WHERE delivery_date_cs >= date('now','start of year')").get() as any;

    res.json({
      totalActiveOrders: totalOrders.total || 0,
      activeOrderCount: activeOrders.count || 0,
      departmentCount: (db.prepare('SELECT count(*) as count FROM departments').get() as any).count,
      machineCount: (db.prepare('SELECT count(*) as count FROM machines').get() as any).count,
      mtdTarget: mtdCount.count || 124,
      ytdTarget: ytdCount.count || 1450,
      onTimeDeliveryRate: 98.4
    });
  });

  // Delay Log API
  app.post("/api/orders/delay", express.json(), async (req, res) => {
    const { order_id, original_date, new_date, reason } = req.body;
    
    // Insert into MSSQL if available, else local SQLite
    const mssql = await getMSSQL();
    if (mssql) {
      try {
        await mssql.request()
          .input('order_id', sql.Int, order_id)
          .input('original_date', sql.VarChar, original_date)
          .input('new_date', sql.VarChar, new_date)
          .input('reason', sql.Text, reason)
          .query('INSERT INTO delay_logs (order_id, original_date, new_date, reason) VALUES (@order_id, @original_date, @new_date, @reason)');
      } catch (err) {
        console.error("MSSQL Delay Log Error", err);
      }
    }

    // Local fallback for delay logs (ensure table exists)
    db.exec(`CREATE TABLE IF NOT EXISTS delay_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, original_date TEXT, new_date TEXT, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.prepare('INSERT INTO delay_logs (order_id, original_date, new_date, reason) VALUES (?, ?, ?, ?)').run(order_id, original_date, new_date, reason);
    
    // Update the work order date
    db.prepare('UPDATE work_orders SET delivery_date_cs = ? WHERE id = ?').run(new_date, order_id);

    res.json({ success: true });
  });

  // auth route
  app.post("/api/login", express.json(), async (req, res) => {
    const { username, password } = req.body;
    
    // Try MSSQL first
    const mssql = await getMSSQL();
    if (mssql) {
      try {
        const result = await mssql.request()
          .input('user', sql.VarChar, username)
          .input('pass', sql.VarChar, password)
          .query('SELECT * FROM users WHERE username = @user AND password = @pass');
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return res.json({ success: true, user: { role: user.role, name: user.full_name } });
        }
      } catch (err) {
        console.error("MSSQL Auth Error", err);
      }
    }

    // Fallback to SQLite
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any;
    if (user) {
      res.json({ success: true, user: { role: user.role, name: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Department and Machines
  app.get("/api/departments", async (req, res) => {
    // Try MSSQL first
    const mssql = await getMSSQL();
    if (mssql) {
      try {
        const result = await mssql.query('SELECT * FROM departments');
        if (result.recordset.length > 0) return res.json(result.recordset);
      } catch (err) {
        console.error("MSSQL Dept Error", err);
      }
    }

    const data = db.prepare('SELECT * FROM departments').all();
    res.json(data);
  });

  app.get("/api/machines", async (req, res) => {
    const deptId = req.query.department_id;
    
    // Try MSSQL first
    const mssql = await getMSSQL();
    if (mssql) {
      try {
        let query = 'SELECT * FROM machines';
        const request = mssql.request();
        if (deptId) {
          query += ' WHERE department_id = @deptId';
          request.input('deptId', sql.Int, deptId);
        }
        const result = await request.query(query);
        if (result.recordset.length > 0) return res.json(result.recordset);
      } catch (err) {
        console.error("MSSQL Machines Error", err);
      }
    }

    let query = 'SELECT * FROM machines';
    const params = [];
    if (deptId) {
      query += ' WHERE department_id = ?';
      params.push(deptId);
    }
    const data = db.prepare(query).all(...params);
    res.json(data);
  });

  app.put("/api/orders/:id", express.json(), (req, res) => {
    const { id } = req.params;
    const { 
      current_stage, docket_update, priority, 
      delivery_date_cs, time, machine_id 
    } = req.body;
    
    const info = db.prepare(`
      UPDATE work_orders 
      SET 
        current_stage = COALESCE(?, current_stage), 
        docket_update = COALESCE(?, docket_update), 
        priority = COALESCE(?, priority), 
        delivery_date_cs = COALESCE(?, delivery_date_cs), 
        time = COALESCE(?, time),
        machine_id = COALESCE(?, machine_id)
      WHERE id = ?
    `).run(current_stage, docket_update, priority, delivery_date_cs, time, machine_id, id);

    if (info.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // BOM
  app.get("/api/bom/:itemCode", async (req, res) => {
    const { itemCode } = req.params;
    
    // Try MSSQL first
    const mssql = await getMSSQL();
    if (mssql) {
      try {
        const result = await mssql.request()
          .input('code', sql.VarChar, itemCode)
          .query('SELECT * FROM bom WHERE fg_item_code = @code OR parent_item = @code');
        if (result.recordset.length > 0) return res.json(result.recordset);
      } catch (err) {
        console.error("MSSQL BOM Error", err);
      }
    }

    const data = db.prepare('SELECT * FROM bom WHERE fg_item_code = ? OR parent_item = ?').all(itemCode, itemCode);
    res.json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
