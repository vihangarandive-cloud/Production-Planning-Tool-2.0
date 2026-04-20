// /Repositories/IInventoryRepository.cs
using System.Collections.Generic;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public interface IInventoryRepository
    {
        IEnumerable<InventoryItem> GetAll();
        IEnumerable<BillOfMaterial> CheckBOM(string productName, int quantity);
        IEnumerable<AlertNotification> GetAlerts(int? userId = null);
        void MarkAlertRead(int alertId);
    }
}
