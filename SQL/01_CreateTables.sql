-- /SQL/01_CreateTables.sql
-- RPAC Lanka Production Planning System - Database Schema

CREATE DATABASE RPACProductionDB;
GO

USE RPACProductionDB;
GO

-- 1. Roles table
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(256) NOT NULL,
    RoleId INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

-- 3. ShiftSchedules table
CREATE TABLE ShiftSchedules (
    ShiftId INT IDENTITY(1,1) PRIMARY KEY,
    ShiftName NVARCHAR(50) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsActive BIT DEFAULT 1
);

-- 4. Employees table
CREATE TABLE Employees (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    EmployeeCode NVARCHAR(20) NOT NULL UNIQUE,
    Department NVARCHAR(50) NOT NULL,
    ShiftId INT,
    IsActive BIT DEFAULT 1,
    CONSTRAINT FK_Employees_Shifts FOREIGN KEY (ShiftId) REFERENCES ShiftSchedules(ShiftId)
);

-- 5. MachineResources table
CREATE TABLE MachineResources (
    MachineId INT IDENTITY(1,1) PRIMARY KEY,
    MachineName NVARCHAR(100) NOT NULL,
    MachineCode NVARCHAR(20) NOT NULL UNIQUE,
    Department NVARCHAR(50) NOT NULL, -- Thermal, Flexo, PFL, Heat Transfer, RFID, Offset, Levi's, Pre-Press
    Status NVARCHAR(20) DEFAULT 'Available', -- Available, Maintenance, Breakdown
    LastMaintenance DATETIME,
    NextMaintenance DATETIME,
    CapacityPerShift INT -- Units per shift
);

-- 6. ProductionOrders table (Enhanced for Printing & Pre-Press)
CREATE TABLE ProductionOrders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    OrderCode NVARCHAR(20) NOT NULL UNIQUE, -- Internal Order ID
    SalesOrderNo NVARCHAR(50), -- Reference from SAP B1
    CustomerName NVARCHAR(200),
    ProductName NVARCHAR(100) NOT NULL,
    Department NVARCHAR(50) NOT NULL, -- Thermal, Flexo, PFL, Heat Transfer, RFID, Offset, Levi's
    Quantity INT NOT NULL,
    UnitOfMeasure NVARCHAR(20) NOT NULL,
    
    -- Pre-Press Workflow
    PrePressStatus NVARCHAR(50) DEFAULT 'Pending', -- Pending, Layout In Progress, Plate Making, Proof Reading, Completed
    LayoutProofReadBy INT, -- UserId
    PlatesReady BIT DEFAULT 0,
    
    Status NVARCHAR(20) DEFAULT 'Planned', -- Planned, In Progress, On Hold, Completed, Cancelled
    Priority NVARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    PlannedStart DATETIME,
    PlannedEnd DATETIME,
    ActualStart DATETIME,
    ActualEnd DATETIME,
    MachineId INT,
    AssignedEmployeeId INT,
    CreatedBy INT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Notes NVARCHAR(MAX),
    CONSTRAINT FK_Orders_Machines FOREIGN KEY (MachineId) REFERENCES MachineResources(MachineId),
    CONSTRAINT FK_Orders_Employees FOREIGN KEY (AssignedEmployeeId) REFERENCES Employees(EmployeeId),
    CONSTRAINT FK_Orders_Creator FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Orders_ProofReader FOREIGN KEY (LayoutProofReadBy) REFERENCES Users(UserId)
);

-- 7. InventoryItems table
CREATE TABLE InventoryItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemCode NVARCHAR(20) NOT NULL UNIQUE,
    ItemName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    QuantityOnHand DECIMAL(18, 2) DEFAULT 0,
    ReorderLevel DECIMAL(18, 2) DEFAULT 0,
    UnitOfMeasure NVARCHAR(20) NOT NULL,
    LastUpdated DATETIME DEFAULT GETDATE(),
    SupplierId INT -- Linking to a potential Suppliers table
);

-- 8. BillOfMaterials table
CREATE TABLE BillOfMaterials (
    BOMId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    ItemId INT NOT NULL,
    QuantityRequired DECIMAL(18, 4) NOT NULL,
    UnitOfMeasure NVARCHAR(20) NOT NULL,
    CONSTRAINT FK_BOM_Inventory FOREIGN KEY (ItemId) REFERENCES InventoryItems(ItemId)
);

-- 9. AlertNotifications table
CREATE TABLE AlertNotifications (
    AlertId INT IDENTITY(1,1) PRIMARY KEY,
    AlertType NVARCHAR(50) NOT NULL, -- Low Stock, Schedule Conflict, Overdue
    Message NVARCHAR(MAX) NOT NULL,
    RelatedId INT, -- ID of Order or Item related to alert
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 10. AuditLog table
CREATE TABLE AuditLog (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT,
    Action NVARCHAR(100) NOT NULL,
    TableAffected NVARCHAR(100),
    RecordId INT,
    Timestamp DATETIME DEFAULT GETDATE(),
    IPAddress NVARCHAR(50),
    CONSTRAINT FK_Audit_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Indexes for performance
CREATE INDEX IX_ProductionOrders_Status ON ProductionOrders(Status);
CREATE INDEX IX_ProductionOrders_PlannedStart ON ProductionOrders(PlannedStart);
CREATE INDEX IX_InventoryItems_ItemCode ON InventoryItems(ItemCode);
CREATE INDEX IX_AuditLog_Timestamp ON AuditLog(Timestamp);
