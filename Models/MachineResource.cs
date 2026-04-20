// /Models/MachineResource.cs
using System;

namespace RPACProductionPlanner.Models
{
    public class MachineResource
    {
        public int MachineId { get; set; }
        public string MachineName { get; set; }
        public string MachineCode { get; set; }
        public string Department { get; set; }
        public string Status { get; set; }
        public DateTime? LastMaintenance { get; set; }
        public DateTime? NextMaintenance { get; set; }
        public int CapacityPerShift { get; set; }
    }
}
