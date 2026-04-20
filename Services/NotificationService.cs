// /Services/NotificationService.cs
using RPACProductionPlanner.Models;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Services
{
    public class NotificationService
    {
        private readonly IInventoryRepository _inventoryRepo;

        public NotificationService(IInventoryRepository inventoryRepo)
        {
            _inventoryRepo = inventoryRepo;
        }

        public void ProcessAlerts()
        {
            // Logic to check stock and schedule to generate alerts
        }
    }
}
