-- MSSQL Schema for RPAC Production Planner
-- Use this script to set up your main database in MSSQL

-- 1. Create Departments Table
CREATE TABLE departments (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) UNIQUE NOT NULL
);

-- 2. Create Machines Table
CREATE TABLE machines (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    department_id INT,
    CONSTRAINT FK_Machines_Departments FOREIGN KEY (department_id) 
    REFERENCES departments(id)
);

-- 3. Create Users Table
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(100) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    full_name NVARCHAR(100) NOT NULL
);

-- 4. Create Delay Logs Table
CREATE TABLE delay_logs (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    original_date NVARCHAR(20),
    new_date NVARCHAR(20),
    reason NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);

-- 5. Create BOM Table
CREATE TABLE bom (
    id INT PRIMARY KEY IDENTITY(1,1),
    fg_item_code NVARCHAR(100),
    parent_item NVARCHAR(100),
    material_code NVARCHAR(100),
    description NVARCHAR(MAX),
    quantity_per_unit FLOAT,
    uom NVARCHAR(20)
);

-- Initial Data
INSERT INTO departments (name) VALUES 
('Thermal'), ('Flexo'), ('PFL'), ('Heat Transfer'), ('RFID'), ('Offset'), ('Levi''s');

INSERT INTO users (username, password, role, full_name) VALUES 
('admin', 'admin123', 'admin', 'System Administrator'),
('planner', 'plan123', 'planner', 'Production Planner'),
('manager', 'manage123', 'management', 'Plant Manager'),
('supervisor', 'super123', 'supervisor', 'Shift Supervisor');
