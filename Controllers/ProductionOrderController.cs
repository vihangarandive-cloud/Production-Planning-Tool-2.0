// /Controllers/ProductionOrderController.cs
using System;
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;
using RPACProductionPlanner.Repositories;
using RPACProductionPlanner.Services;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Admin", "Planner", "Supervisor")]
    public class ProductionOrderController : Controller
    {
        private readonly IProductionOrderRepository _orderRepo;
        private readonly ProductionService _productionService;

        public ProductionOrderController()
        {
            _orderRepo = new ProductionOrderRepository();
            _productionService = new ProductionService(_orderRepo, new InventoryRepository());
        }

        public ActionResult Index(string status, DateTime? start, DateTime? end)
        {
            ViewBag.ActiveModule = "Production";
            var orders = _orderRepo.GetAll(status, start, end);
            return View(orders);
        }

        [HttpGet]
        [RoleAuthorize("Admin", "Planner")]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [RoleAuthorize("Admin", "Planner")]
        public ActionResult Create(ProductionOrder order)
        {
            order.CreatedBy = SessionHelper.UserId;
            var result = _productionService.CreateOrder(order);
            if (result.Success) return RedirectToAction("Index");
            
            ViewBag.Error = result.Message;
            return View(order);
        }

        public ActionResult Details(int id)
        {
            var order = _orderRepo.GetById(id);
            if (order == null) return HttpNotFound();
            return View(order);
        }

        [HttpPost]
        public JsonResult UpdateStatus(int id, string status)
        {
            var order = _orderRepo.GetById(id);
            if (order != null)
            {
                order.Status = status;
                if (status == "In Progress") order.ActualStart = DateTime.Now;
                if (status == "Completed") order.ActualEnd = DateTime.Now;
                
                _orderRepo.Update(order);
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }
    }
}
