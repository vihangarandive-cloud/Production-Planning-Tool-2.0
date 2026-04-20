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

-- 4. Insert Machines (Printing & Pre-Press)
INSERT INTO MachineResources (MachineName, MachineCode, Department, Status, CapacityPerShift) VALUES 
('Thermal Transfer T1', 'TH-01', 'Thermal', 'Available', 5000),
('Flexo Press 8-Color', 'FL-01', 'Flexo', 'Available', 20000),
('Offset Press KBA', 'OF-01', 'Offset', 'Available', 15000),
('PFL Rotary Cutter', 'PF-01', 'PFL', 'Available', 10000),
('RFID Inlay Inserter', 'RF-01', 'RFID', 'Available', 8000),
('Levi''s Custom Press', 'LE-01', 'Levi''s', 'Available', 3000),
('Graphic Layout Station A', 'PP-01', 'Pre-Press', 'Available', 100);

-- 5. Insert Employees (Printing Departments)
INSERT INTO Employees (FullName, EmployeeCode, Department, ShiftId) VALUES 
('Amara Perera', 'EMP-101', 'Pre-Press', 1),
('Suneth Silva', 'EMP-102', 'Flexo', 1),
('Kasun Jayawardena', 'EMP-103', 'Thermal', 1),
('Lakmal Perera', 'EMP-104', 'RFID', 1),
('Nimal Sirisena', 'EMP-105', 'Offset', 1);

-- 6. Insert Inventory Items (SAP B1 Sync Items)
INSERT INTO InventoryItems (ItemCode, ItemName, Category, QuantityOnHand, ReorderLevel, UnitOfMeasure) VALUES 
('INK-BLU-UV', 'Ink Blue UV Premium', 'Consumables', 500, 100, 'Liters'),
('RIB-BLK-T', 'Thermal Ribbon Black', 'Consumables', 200, 50, 'Rolls'),
('FAB-POLY-01', 'Polyester Fabric Roll', 'Raw Material', 1000, 200, 'Meters'),
('RFID-CHP-N', 'RFID Chips Ntag213', 'Raw Material', 50000, 10000, 'Units'),
('PRO-PLA-OF', 'Offset Printing Plates', 'Plates', 50, 10, 'Sets');

-- 7. Insert Production Orders (SAP B1 Integrated)
INSERT INTO ProductionOrders (OrderCode, SalesOrderNo, CustomerName, ProductName, Department, Quantity, UnitOfMeasure, Status, PrePressStatus, Priority, PlannedStart, PlannedEnd, MachineId, AssignedEmployeeId, CreatedBy) VALUES 
('PO-2024-001', 'SO-SAP-9901', 'Nike International', 'Care Labels (Flexo)', 'Flexo', 50000, 'Units', 'In Progress', 'Completed', 'High', '2024-05-25 08:00', '2024-05-28 17:00', 2, 2, 2),
('PO-2024-002', 'SO-SAP-9902', 'Levi Strauss', 'Branded Hangtags', 'Levi''s', 10000, 'Units', 'Planned', 'Layout In Progress', 'Urgent', '2024-05-26 08:00', '2024-05-30 14:00', 6, 5, 2),
('PO-2024-003', 'SO-SAP-9903', 'Marks & Spencer', 'RFID Security Tags', 'RFID', 25000, 'Units', 'Planned', 'Pending', 'Medium', '2024-05-27 09:00', '2024-05-31 17:00', 5, 4, 2),
('PO-2024-004', 'SO-SAP-4401', 'Victoria Secret', 'Heat Transfer Stickers', 'Heat Transfer', 5000, 'Sheets', 'Planned', 'Pending', 'Low', '2024-06-01 08:00', '2024-06-03 17:00', 7, 1, 2);

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
