// /Helpers/SessionHelper.cs
using System.Web;

namespace RPACProductionPlanner.Helpers
{
    public static class SessionHelper
    {
        public static int UserId
        {
            get => HttpContext.Current.Session["UserId"] != null ? (int)HttpContext.Current.Session["UserId"] : 0;
            set => HttpContext.Current.Session["UserId"] = value;
        }

        public static string Username
        {
            get => HttpContext.Current.Session["Username"]?.ToString();
            set => HttpContext.Current.Session["Username"] = value;
        }

        public static string FullName
        {
            get => HttpContext.Current.Session["FullName"]?.ToString();
            set => HttpContext.Current.Session["FullName"] = value;
        }

        public static string UserRole
        {
            get => HttpContext.Current.Session["UserRole"]?.ToString();
            set => HttpContext.Current.Session["UserRole"] = value;
        }

        public static void Clear()
        {
            HttpContext.Current.Session.Clear();
            HttpContext.Current.Session.Abandon();
        }
    }
}
