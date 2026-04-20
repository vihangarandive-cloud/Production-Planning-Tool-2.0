// /Repositories/ReportRepository.cs
using System;
using System.Collections.Generic;
using System.Data;
using Dapper;
using RPACProductionPlanner.Helpers;

namespace RPACProductionPlanner.Repositories
{
    public class ReportRepository : IReportRepository
    {
        public IEnumerable<dynamic> GetOEEReport(DateTime start, DateTime end)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query("usp_GetOEEReport", new { StartDate = start, EndDate = end }, commandType: CommandType.StoredProcedure);
            }
        }

        public decimal GetOnTimeDeliveryRate(DateTime start, DateTime end)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.QuerySingle<decimal>("usp_GetOnTimeDeliveryRate", new { StartDate = start, EndDate = end }, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
