// /Controllers/ReportsController.cs
using System;
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Admin", "Planner", "Management")]
    public class ReportsController : Controller
    {
        private readonly IReportRepository _reportRepo;

        public ReportsController()
        {
            _reportRepo = new ReportRepository();
        }

        public ActionResult Index()
        {
            ViewBag.ActiveModule = "Reports";
            return View();
        }
    }
}
