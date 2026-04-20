// /Controllers/InventoryController.cs
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Admin", "Planner", "Supervisor", "InventoryOfficer")]
    public class InventoryController : Controller
    {
        private readonly IInventoryRepository _inventoryRepo;

        public InventoryController()
        {
            _inventoryRepo = new InventoryRepository();
        }

        public ActionResult Index()
        {
            ViewBag.ActiveModule = "Inventory";
            var items = _inventoryRepo.GetAll();
            return View(items);
        }

        public ActionResult BOMCheck(string productName, int quantity = 1)
        {
            var shortages = _inventoryRepo.CheckBOM(productName, quantity);
            ViewBag.ProductName = productName;
            ViewBag.Quantity = quantity;
            return View(shortages);
        }
    }
}
