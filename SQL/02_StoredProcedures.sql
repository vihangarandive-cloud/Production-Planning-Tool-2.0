-- /SQL/02_StoredProcedures.sql
-- RPAC Lanka Production Planning System - Stored Procedures

USE RPACProductionDB;
GO

-- 1. Validate User
CREATE PROCEDURE usp_ValidateUser
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(256)
AS
BEGIN
    SELECT u.*, r.RoleName 
    FROM Users u
    JOIN Roles r ON u.RoleId = r.RoleId
    WHERE u.Username = @Username AND u.PasswordHash = @PasswordHash AND u.IsActive = 1;
END;
GO

-- 2. Dashboard KPIs
CREATE PROCEDURE usp_GetDashboardKPIs
AS
BEGIN
    DECLARE @TotalActiveOrders INT, @OTDRate DECIMAL(5,2), @LowStockItems INT, @MachinesInUse INT;

    SELECT @TotalActiveOrders = COUNT(*) FROM ProductionOrders WHERE Status IN ('Planned', 'In Progress');
    
    -- On-Time Delivery Rate: (Completed on time / Total Completed) * 100
    SELECT @OTDRate = CASE 
        WHEN COUNT(*) = 0 THEN 0 
        ELSE (CAST(SUM(CASE WHEN ActualEnd <= PlannedEnd THEN 1 ELSE 0 END) AS DECIMAL) / COUNT(*)) * 100 
    END 
    FROM ProductionOrders WHERE Status = 'Completed';

    SELECT @LowStockItems = COUNT(*) FROM InventoryItems WHERE QuantityOnHand <= ReorderLevel;
    
    SELECT @MachinesInUse = COUNT(DISTINCT MachineId) FROM ProductionOrders WHERE Status = 'In Progress';

    SELECT 
        @TotalActiveOrders AS TotalActiveOrders,
        @OTDRate AS OnTimeDeliveryRate,
        @LowStockItems AS LowStockCount,
        @MachinesInUse AS MachinesActive;
END;
GO

-- 3. Production Orders (Enhanced for Printing & Pre-Press)
CREATE PROCEDURE usp_GetAllProductionOrders
    @Status NVARCHAR(20) = NULL,
    @Department NVARCHAR(50) = NULL,
    @StartDate DATETIME = NULL,
    @EndDate DATETIME = NULL
AS
BEGIN
    SELECT po.*, m.MachineName, e.FullName AS EmployeeName, u.FullName AS CreatedByName, pr.FullName AS ProofReaderName
    FROM ProductionOrders po
    LEFT JOIN MachineResources m ON po.MachineId = m.MachineId
    LEFT JOIN Employees e ON po.AssignedEmployeeId = e.EmployeeId
    LEFT JOIN Users u ON po.CreatedBy = u.UserId
    LEFT JOIN Users pr ON po.LayoutProofReadBy = pr.UserId
    WHERE (@Status IS NULL OR po.Status = @Status)
      AND (@Department IS NULL OR po.Department = @Department)
      AND (@StartDate IS NULL OR po.PlannedStart >= @StartDate)
      AND (@EndDate IS NULL OR po.PlannedStart <= @EndDate)
    ORDER BY po.CreatedAt DESC;
END;
GO

-- 4. Single Production Order
CREATE PROCEDURE usp_GetProductionOrderById
    @OrderId INT
AS
BEGIN
    SELECT * FROM ProductionOrders WHERE OrderId = @OrderId;
END;
GO

-- 5. Create Order
CREATE PROCEDURE usp_CreateProductionOrder
    @OrderCode NVARCHAR(20),
    @SalesOrderNo NVARCHAR(50),
    @CustomerName NVARCHAR(200),
    @ProductName NVARCHAR(100),
    @Department NVARCHAR(50),
    @Quantity INT,
    @UnitOfMeasure NVARCHAR(20),
    @Status NVARCHAR(20),
    @Priority NVARCHAR(20),
    @PlannedStart DATETIME,
    @PlannedEnd DATETIME,
    @MachineId INT,
    @CreatedBy INT,
    @Notes NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO ProductionOrders (OrderCode, SalesOrderNo, CustomerName, ProductName, Department, Quantity, UnitOfMeasure, Status, Priority, PlannedStart, PlannedEnd, MachineId, CreatedBy, Notes)
    VALUES (@OrderCode, @SalesOrderNo, @CustomerName, @ProductName, @Department, @Quantity, @UnitOfMeasure, @Status, @Priority, @PlannedStart, @PlannedEnd, @MachineId, @CreatedBy, @Notes);
    SELECT SCOPE_IDENTITY();
END;
GO

-- 6. Inventory with Shortage List Logic
CREATE PROCEDURE usp_GetInventoryItems
AS
BEGIN
    SELECT *, 
           (CASE WHEN QuantityOnHand <= ReorderLevel THEN 1 ELSE 0 END) AS IsLowStock
    FROM InventoryItems
    ORDER BY ItemName;
END;
GO

-- 7. BOM Check
CREATE PROCEDURE usp_CheckBOMAvailability
    @ProductName NVARCHAR(100),
    @RequiredQuantity INT
AS
BEGIN
    SELECT 
        bom.ItemId,
        ii.ItemName,
        bom.QuantityRequired * @RequiredQuantity AS TotalRequired,
        ii.QuantityOnHand,
        (CASE WHEN (bom.QuantityRequired * @RequiredQuantity) > ii.QuantityOnHand THEN (bom.QuantityRequired * @RequiredQuantity) - ii.QuantityOnHand ELSE 0 END) AS Shortage
    FROM BillOfMaterials bom
    JOIN InventoryItems ii ON bom.ItemId = ii.ItemId
    WHERE bom.ProductName = @ProductName;
END;
GO

-- 8. Machine Schedule for Gantt
CREATE PROCEDURE usp_GetMachineSchedule
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        m.MachineId,
        m.MachineName,
        po.OrderId,
        po.OrderCode,
        po.ProductName,
        po.PlannedStart,
        po.PlannedEnd,
        po.Status
    FROM MachineResources m
    LEFT JOIN ProductionOrders po ON m.MachineId = po.MachineId
    WHERE (po.PlannedStart BETWEEN @StartDate AND @EndDate OR po.PlannedEnd BETWEEN @StartDate AND @EndDate)
      AND po.Status NOT IN ('Cancelled', 'Completed');
END;
GO

-- 9. Detect Schedule Conflicts
CREATE PROCEDURE usp_DetectScheduleConflicts
    @MachineId INT,
    @PlannedStart DATETIME,
    @PlannedEnd DATETIME,
    @ExcludeOrderId INT = NULL
AS
BEGIN
    SELECT * FROM ProductionOrders
    WHERE MachineId = @MachineId
      AND (@ExcludeOrderId IS NULL OR OrderId <> @ExcludeOrderId)
      AND Status NOT IN ('Cancelled', 'Completed')
      AND ((@PlannedStart < PlannedEnd AND @PlannedEnd > PlannedStart));
END;
GO

-- 10. Write Audit Log
CREATE PROCEDURE usp_WriteAuditLog
    @UserId INT,
    @Action NVARCHAR(100),
    @TableAffected NVARCHAR(100),
    @RecordId INT,
    @IPAddress NVARCHAR(50)
AS
BEGIN
    INSERT INTO AuditLog (UserId, Action, TableAffected, RecordId, IPAddress)
    VALUES (@UserId, @Action, @TableAffected, @RecordId, @IPAddress);
END;
GO
