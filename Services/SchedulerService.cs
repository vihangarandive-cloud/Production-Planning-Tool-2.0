// /Services/SchedulerService.cs
using System;
using System.Collections.Generic;
using System.Data;
using Dapper;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Services
{
    public class SchedulerService
    {
        public IEnumerable<dynamic> GetScheduleData(DateTime start, DateTime end)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.Query("usp_GetMachineSchedule", new { StartDate = start, EndDate = end }, commandType: CommandType.StoredProcedure);
            }
        }

        public bool CheckConflicts(int machineId, DateTime start, DateTime end, int? excludeOrderId = null)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                var conflicts = conn.Query("usp_DetectScheduleConflicts", 
                    new { MachineId = machineId, PlannedStart = start, PlannedEnd = end, ExcludeOrderId = excludeOrderId }, 
                    commandType: CommandType.StoredProcedure);
                
                return conflicts != null && conflicts.AsList().Count > 0;
            }
        }
    }
}
