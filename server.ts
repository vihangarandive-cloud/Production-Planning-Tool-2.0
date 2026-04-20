import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock API for the Prototype Dashboard
  app.get("/api/dashboard/kpis", (req, res) => {
    res.json({
      totalActiveOrders: 12,
      onTimeDeliveryRate: 94.2,
      lowStockCount: 3,
      machinesActive: 5
    });
  });

  app.get("/api/orders", (req, res) => {
    res.json([
      { id: 1, code: "PO-2026-001", product: "Industrial Mats A1", qty: 500, uom: "PCS", status: "In Progress", priority: "High", start: "2026-04-18" },
      { id: 2, code: "PO-2026-002", product: "Conveyor Belt V-Shape", qty: 50, uom: "Rolls", status: "Planned", priority: "Urgent", start: "2026-04-20" },
      { id: 3, code: "PO-2026-003", product: "Gasket Seal 40mm", qty: 2000, uom: "PCS", status: "Completed", priority: "Medium", start: "2026-04-10" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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
