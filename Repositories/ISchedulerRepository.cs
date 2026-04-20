// /Repositories/ISchedulerRepository.cs
using System;
using System.Collections.Generic;

namespace RPACProductionPlanner.Repositories
{
    public interface ISchedulerRepository
    {
        IEnumerable<dynamic> GetMachineSchedule(DateTime start, DateTime end);
    }
}
