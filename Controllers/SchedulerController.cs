// /Controllers/SchedulerController.cs
using System;
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Services;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Admin", "Planner", "Supervisor")]
    public class SchedulerController : Controller
    {
        private readonly SchedulerService _schedulerService;

        public SchedulerController()
        {
            _schedulerService = new SchedulerService();
        }

        public ActionResult Index()
        {
            ViewBag.ActiveModule = "Scheduler";
            return View();
        }

        [HttpGet]
        public JsonResult GetEvents(DateTime start, DateTime end)
        {
            var data = _schedulerService.GetScheduleData(start, end);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}
