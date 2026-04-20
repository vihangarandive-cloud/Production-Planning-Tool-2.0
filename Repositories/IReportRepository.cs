// /Repositories/IReportRepository.cs
using System;
using System.Collections.Generic;

namespace RPACProductionPlanner.Repositories
{
    public interface IReportRepository
    {
        IEnumerable<dynamic> GetOEEReport(DateTime start, DateTime end);
        decimal GetOnTimeDeliveryRate(DateTime start, DateTime end);
    }
}
