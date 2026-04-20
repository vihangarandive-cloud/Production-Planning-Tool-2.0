// /Repositories/ProductionOrderRepository.cs
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public class ProductionOrderRepository : IProductionOrderRepository
    {
        public IEnumerable<ProductionOrder> GetAll(string status = null, DateTime? start = null, DateTime? end = null)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                var p = new DynamicParameters();
                p.Add("@Status", status);
                p.Add("@Department", null); 
                p.Add("@StartDate", start);
                p.Add("@EndDate", end);
                return conn.Query<ProductionOrder>("usp_GetAllProductionOrders", p, commandType: CommandType.StoredProcedure);
            }
        }

        public ProductionOrder GetById(int id)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                var p = new DynamicParameters();
                p.Add("@OrderId", id);
                return conn.QueryFirstOrDefault<ProductionOrder>("usp_GetProductionOrderById", p, commandType: CommandType.StoredProcedure);
            }
        }

        public int Create(ProductionOrder order)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                var p = new DynamicParameters();
                p.Add("@OrderCode", order.OrderCode);
                p.Add("@SalesOrderNo", order.SalesOrderNo);
                p.Add("@CustomerName", order.CustomerName);
                p.Add("@ProductName", order.ProductName);
                p.Add("@Department", order.Department);
                p.Add("@Quantity", order.Quantity);
                p.Add("@UnitOfMeasure", order.UnitOfMeasure);
                p.Add("@Status", order.Status);
                p.Add("@Priority", order.Priority);
                p.Add("@PlannedStart", order.PlannedStart);
                p.Add("@PlannedEnd", order.PlannedEnd);
                p.Add("@MachineId", order.MachineId);
                p.Add("@CreatedBy", order.CreatedBy);
                p.Add("@Notes", order.Notes);
                return conn.QuerySingle<int>("usp_CreateProductionOrder", p, commandType: CommandType.StoredProcedure);
            }
        }

        public bool Update(ProductionOrder order)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                var p = new DynamicParameters();
                p.Add("@OrderId", order.OrderId);
                p.Add("@Status", order.Status);
                p.Add("@ActualStart", order.ActualStart);
                p.Add("@ActualEnd", order.ActualEnd);
                p.Add("@Notes", order.Notes);
                // Implementation would call an update SP
                return conn.Execute("usp_UpdateProductionOrder", p, commandType: CommandType.StoredProcedure) > 0;
            }
        }

        public bool Delete(int id)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Execute("usp_DeleteProductionOrder", new { OrderId = id }, commandType: CommandType.StoredProcedure) > 0;
            }
        }

        public KPISummary GetDashboardKPIs()
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.QueryFirstOrDefault<KPISummary>("usp_GetDashboardKPIs", commandType: CommandType.StoredProcedure);
            }
        }
    }
}
