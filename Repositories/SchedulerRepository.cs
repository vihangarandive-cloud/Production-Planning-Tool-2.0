// /Repositories/SchedulerRepository.cs
using System;
using System.Collections.Generic;
using System.Data;
using Dapper;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public class SchedulerRepository
    {
        public IEnumerable<dynamic> GetMachineSchedule(DateTime start, DateTime end)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query("usp_GetMachineSchedule", new { StartDate = start, EndDate = end }, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
