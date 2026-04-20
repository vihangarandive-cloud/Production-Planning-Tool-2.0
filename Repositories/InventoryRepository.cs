// /Repositories/InventoryRepository.cs
using System.Collections.Generic;
using System.Data;
using Dapper;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        public IEnumerable<InventoryItem> GetAll()
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query<InventoryItem>("usp_GetInventoryItems", commandType: CommandType.StoredProcedure);
            }
        }

        public IEnumerable<BillOfMaterial> CheckBOM(string productName, int quantity)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query<BillOfMaterial>("usp_CheckBOMAvailability", new { ProductName = productName, RequiredQuantity = quantity }, commandType: CommandType.StoredProcedure);
            }
        }

        public IEnumerable<AlertNotification> GetAlerts(int? userId = null)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query<AlertNotification>("usp_GetAlerts", new { UserId = userId }, commandType: CommandType.StoredProcedure);
            }
        }

        public void MarkAlertRead(int alertId)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                conn.Execute("usp_MarkAlertRead", new { AlertId = alertId }, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
