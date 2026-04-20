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
      totalActiveOrders: 24,
      onTimeDeliveryRate: 92.5,
      lowStockCount: 7,
      machinesActive: 8
    });
  });

  app.get("/api/orders", (req, res) => {
    res.json([
      { id: 1, code: "PO-2024-001", salesOrder: "SO-SAP-9901", product: "Care Labels (Flexo)", qty: 50000, department: "Flexo", status: "In Progress", prePress: "Completed", priority: "High", start: "2024-05-25" },
      { id: 2, code: "PO-2024-002", salesOrder: "SO-SAP-9902", product: "Branded Hangtags", qty: 10000, department: "Levi's", status: "Planned", prePress: "Layout", priority: "Urgent", start: "2024-05-26" },
      { id: 3, code: "PO-2024-003", salesOrder: "SO-SAP-9903", product: "RFID Security Tags", qty: 25000, department: "RFID", status: "Planned", prePress: "Pending", priority: "Medium", start: "2024-05-27" },
      { id: 4, code: "PO-2024-004", salesOrder: "SO-SAP-4401", product: "Heat Transfer Stickers", qty: 5000, department: "Heat Transfer", status: "Planned", prePress: "Pending", priority: "Low", start: "2024-06-01" }
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
