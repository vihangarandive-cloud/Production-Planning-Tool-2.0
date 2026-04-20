// /Controllers/DashboardController.cs
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Planner", "Supervisor", "InventoryOfficer", "Management")]
    public class DashboardController : Controller
    {
        private readonly IProductionOrderRepository _orderRepo;

        public DashboardController()
        {
            _orderRepo = new ProductionOrderRepository();
        }

        public ActionResult Index()
        {
            ViewBag.ActiveModule = "Dashboard";
            var kpis = _orderRepo.GetDashboardKPIs();
            return View(kpis);
        }
    }
}
