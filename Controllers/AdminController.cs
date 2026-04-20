// /Controllers/AdminController.cs
using System.Web.Mvc;
using RPACProductionPlanner.Helpers;

namespace RPACProductionPlanner.Controllers
{
    [RoleAuthorize("Admin")]
    public class AdminController : Controller
    {
        public ActionResult Index()
        {
            return RedirectToAction("Users");
        }

        public ActionResult Users()
        {
            ViewBag.ActiveModule = "Admin";
            return View();
        }

        public ActionResult Roles()
        {
            ViewBag.ActiveModule = "Admin";
            return View();
        }
    }
}
