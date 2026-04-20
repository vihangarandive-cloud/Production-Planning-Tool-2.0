// /Helpers/RoleAuthorizeAttribute.cs
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace RPACProductionPlanner.Helpers
{
    public class RoleAuthorizeAttribute : AuthorizeAttribute
    {
        private readonly string[] _targetRoles;

        public RoleAuthorizeAttribute(params string[] roles)
        {
            _targetRoles = roles;
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (!httpContext.User.Identity.IsAuthenticated) return false;

            var userRole = SessionHelper.UserRole;
            if (string.IsNullOrEmpty(userRole)) return false;

            // Admin always has access
            if (userRole.Equals("Admin", StringComparison.OrdinalIgnoreCase)) return true;

            foreach (var role in _targetRoles)
            {
                if (userRole.Equals(role, StringComparison.OrdinalIgnoreCase)) return true;
            }

            return false;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                base.HandleUnauthorizedRequest(filterContext);
            }
            else
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Dashboard", action = "Index", area = "" }));
            }
        }
    }
}
