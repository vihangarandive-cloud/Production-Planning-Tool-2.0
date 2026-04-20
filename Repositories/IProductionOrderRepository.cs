// /Repositories/IProductionOrderRepository.cs
using System;
using System.Collections.Generic;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public interface IProductionOrderRepository
    {
        IEnumerable<ProductionOrder> GetAll(string status = null, DateTime? start = null, DateTime? end = null);
        ProductionOrder GetById(int id);
        int Create(ProductionOrder order);
        bool Update(ProductionOrder order);
        bool Delete(int id);
        KPISummary GetDashboardKPIs();
    }
}
