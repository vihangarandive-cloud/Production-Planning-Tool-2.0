// /Controllers/AccountController.cs
using System;
using System.Security.Cryptography;
using System.Text;
using System.Web.Mvc;
using System.Web.Security;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Repositories;

namespace RPACProductionPlanner.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserRepository _userRepo;

        public AccountController()
        {
            _userRepo = new UserRepository();
        }

        [HttpGet]
        public ActionResult Login()
        {
            if (User.Identity.IsAuthenticated) return RedirectToAction("Index", "Dashboard");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(string username, string password)
        {
            string hash = GetSha256Hash(password);
            var user = _userRepo.ValidateUser(username, hash);

            if (user != null)
            {
                FormsAuthentication.SetAuthCookie(username, false);
                SessionHelper.UserId = user.UserId;
                SessionHelper.Username = user.Username;
                SessionHelper.FullName = user.FullName;
                SessionHelper.UserRole = user.RoleName;

                return RedirectToAction("Index", "Dashboard");
            }

            ViewBag.Error = "Invalid username or password.";
            return View();
        }

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            SessionHelper.Clear();
            return RedirectToAction("Login");
        }

        private string GetSha256Hash(string input)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
