-- /SQL/03_SeedData.sql
-- RPAC Lanka Production Planning System - Seed Data

USE RPACProductionDB;
GO

-- 1. Insert Roles
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Planner'), ('Supervisor'), ('InventoryOfficer'), ('Management');

-- 2. Insert Users (Password: 'RPAC@123' hash - generic placeholder for security_spec)
-- Note: In real app, these would be SHA256 hashes.
INSERT INTO Users (FullName, Username, PasswordHash, RoleId) VALUES 
('System Admin', 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1),
('Saman Kumara', 'planner', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 2),
('Bandara Perera', 'supervisor', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 3),
('Chamara Silva', 'inventory', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 4),
('Rajith Nayakkara', 'management', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 5);

-- 3. Insert Shifts
INSERT INTO ShiftSchedules (ShiftName, StartTime, EndTime) VALUES 
('Morning Shift', '06:00:00', '14:00:00'),
('Evening Shift', '14:00:00', '22:00:00'),
('Night Shift', '22:00:00', '06:00:00');

-- 4. Insert Machines
INSERT INTO MachineResources (MachineName, MachineCode, Department, Status, CapacityPerShift) VALUES 
('Cutting Machine 01', 'CUT-001', 'Prep', 'Available', 5000),
('Vulcanizer A', 'VULC-A', 'Production', 'Available', 200),
('Mixing Mill 2', 'MIX-002', 'Raw Material', 'Maintenance', 1000),
('Extruder Max', 'EXT-01', 'Production', 'Available', 1500),
('Hydraulic Press X', 'HYD-X', 'Production', 'Available', 800),
('Packaging Line 1', 'PKG-01', 'Finishing', 'Available', 10000);

-- 5. Insert Employees
INSERT INTO Employees (FullName, EmployeeCode, Department, ShiftId) VALUES 
('Nimal Sirisena', 'EMP-101', 'Prep', 1),
('Sunil Shantha', 'EMP-102', 'Production', 1),
('Ruwan Silva', 'EMP-103', 'Production', 2),
('Amitha Perera', 'EMP-104', 'Raw Material', 1),
('Kamal de Silva', 'EMP-105', 'Finishing', 2);

-- 6. Insert Inventory Items (Realistic for RPAC Lanka manufacturing)
INSERT INTO InventoryItems (ItemCode, ItemName, Category, QuantityOnHand, ReorderLevel, UnitOfMeasure) VALUES 
('RM-RUB-01', 'Natural Rubber Gr-1', 'Raw Material', 5000, 1000, 'KG'),
('RM-CHEM-02', 'Sulphur Powder', 'Chemicals', 200, 50, 'KG'),
('RM-FAB-05', 'Nylon Canvas Fabric', 'Fabric', 1500, 300, 'SQM'),
('RM-CHEM-10', 'Accelerator CZ', 'Chemicals', 15, 20, 'KG'), -- Low Stock
('PK-BOX-01', 'Standard Carton Box', 'Packaging', 5000, 1000, 'PCS'),
('RM-RUB-05', 'Synthetic Rubber BR', 'Raw Material', 3000, 500, 'KG'),
('RM-CHEM-03', 'Zinc Oxide', 'Chemicals', 45, 50, 'KG'); -- Low Stock

-- 7. Insert Production Orders
INSERT INTO ProductionOrders (OrderCode, ProductName, Quantity, UnitOfMeasure, Status, Priority, PlannedStart, PlannedEnd, MachineId, AssignedEmployeeId, CreatedBy) VALUES 
('PO-2026-001', 'Industrial Mats A1', 500, 'PCS', 'In Progress', 'High', '2026-04-18 08:00', '2026-04-21 17:00', 2, 2, 2),
('PO-2026-002', 'Conveyor Belt V-Shape', 50, 'Rolls', 'Planned', 'Urgent', '2026-04-20 06:00', '2026-04-25 14:00', 4, 3, 2),
('PO-2026-003', 'Gasket Seal 40mm', 2000, 'PCS', 'Completed', 'Medium', '2026-04-10 09:00', '2026-04-12 17:00', 5, 2, 2),
('PO-2026-004', 'Rubber Lining Sheets', 300, 'KG', 'On Hold', 'Medium', '2026-04-15 08:00', '2026-04-18 17:00', 1, 1, 2);

-- 8. Insert BOM Data
INSERT INTO BillOfMaterials (ProductName, ItemId, QuantityRequired, UnitOfMeasure) VALUES 
('Industrial Mats A1', 1, 2.5, 'KG'), -- 2.5kg Rubber per mat
('Industrial Mats A1', 2, 0.05, 'KG'), -- 50g sulphur per mat
('Conveyor Belt V-Shape', 3, 10.0, 'SQM'),
('Conveyor Belt V-Shape', 1, 15.0, 'KG');

-- 9. Alerts
INSERT INTO AlertNotifications (AlertType, Message, RelatedId) VALUES 
('Low Stock', 'Accelerator CZ is below reorder level (Current: 15 KG)', 4),
('Low Stock', 'Zinc Oxide is below reorder level (Current: 45 KG)', 7),
('Schedule Conflict', 'Machine Vulcanizer A has overlapping orders on 2026-04-21', 1);

-- 10. Audit Logs
INSERT INTO AuditLog (UserId, Action, TableAffected, RecordId, IPAddress) VALUES 
(1, 'Created User', 'Users', 2, '192.168.1.5'),
(2, 'Created Order', 'ProductionOrders', 1, '192.168.1.10'),
(4, 'Update Stock', 'InventoryItems', 1, '192.168.1.15');
