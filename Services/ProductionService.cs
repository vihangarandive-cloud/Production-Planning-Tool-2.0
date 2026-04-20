// /Services/ProductionService.cs
using System;
using System.Collections.Generic;
using RPACProductionPlanner.Models;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Services
{
    public class ProductionService
    {
        private readonly IProductionOrderRepository _orderRepo;
        private readonly IInventoryRepository _inventoryRepo;

        public ProductionService(IProductionOrderRepository orderRepo, IInventoryRepository inventoryRepo)
        {
            _orderRepo = orderRepo;
            _inventoryRepo = inventoryRepo;
        }

        public (bool Success, string Message) CreateOrder(ProductionOrder order)
        {
            // 1. BOM Availability Check
            var shortages = _inventoryRepo.CheckBOM(order.ProductName, order.Quantity);
            foreach (var item in shortages)
            {
                if (item.Shortage > 0)
                {
                    return (false, $"Insufficient inventory for {item.ItemName}. Required: {item.TotalRequired}, Available: {item.QuantityOnHand}");
                }
            }

            // 2. Persistence
            order.CreatedAt = DateTime.Now;
            _orderRepo.Create(order);
            return (true, "Order created successfully.");
        }
    }
}
