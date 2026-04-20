// /Models/KPISummary.cs
namespace RPACProductionPlanner.Models
{
    public class KPISummary
    {
        public int TotalActiveOrders { get; set; }
        public decimal OnTimeDeliveryRate { get; set; }
        public int LowStockCount { get; set; }
        public int MachinesActive { get; set; }
    }
}
