// /Models/ProductionOrder.cs
using System;

namespace RPACProductionPlanner.Models
{
    public class ProductionOrder
    {
        public int OrderId { get; set; }
        public string OrderCode { get; set; }
        public string SalesOrderNo { get; set; } // SAP B1 Link
        public string CustomerName { get; set; }
        public string ProductName { get; set; }
        public string Department { get; set; } // Thermal, Flexo, etc.
        public int Quantity { get; set; }
        public string UnitOfMeasure { get; set; }
        public string Status { get; set; } // Planned, In Progress, On Hold, Completed, Cancelled
        public string Priority { get; set; } // Low, Medium, High, Urgent
        
        // Pre-Press Workflow
        public string PrePressStatus { get; set; } // Pending, Layout In Progress, Plate Making, Proof Reading, Completed
        public int? LayoutProofReadBy { get; set; }
        public string ProofReaderName { get; set; }
        public bool PlatesReady { get; set; }

        public DateTime? PlannedStart { get; set; }
        public DateTime? PlannedEnd { get; set; }
        public DateTime? ActualStart { get; set; }
        public DateTime? ActualEnd { get; set; }
        public int? MachineId { get; set; }
        public string MachineName { get; set; }
        public int? AssignedEmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Notes { get; set; }
    }
}
