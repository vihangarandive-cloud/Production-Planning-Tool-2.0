using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using RPAC_ProductionPlanner.Services;

namespace RPAC_ProductionPlanner.Controllers
{
    public class MasterDataController : ApiController
    {
        private DatabaseService _db = new DatabaseService();

        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Try MSSQL (Main Auth)
            string mssqlQuery = "SELECT * FROM users WHERE username = @user AND password = @pass";
            var mssqlParams = new Dictionary<string, object> { 
                { "@user", request.username }, 
                { "@pass", request.password } 
            };
            
            DataTable dt = _db.ExecuteMSSQL(mssqlQuery, mssqlParams);
            if (dt != null && dt.Rows.Count > 0)
            {
                var row = dt.Rows[0];
                return Ok(new { success = true, user = new { role = row["role"], name = row["full_name"] } });
            }

            // 2. Fallback to SQLite
            string sqliteQuery = "SELECT * FROM users WHERE username = @user AND password = @pass";
            DataTable sqliteDt = _db.ExecuteSQLite(sqliteQuery, mssqlParams);
            if (sqliteDt != null && sqliteDt.Rows.Count > 0)
            {
                var row = sqliteDt.Rows[0];
                return Ok(new { success = true, user = new { role = row["role"], name = row["full_name"] } });
            }

            return Unauthorized();
        }

        [HttpGet]
        [Route("api/departments")]
        public IHttpActionResult GetDepartments()
        {
            DataTable dt = _db.ExecuteMSSQL("SELECT * FROM departments") ?? _db.ExecuteSQLite("SELECT * FROM departments");
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/machines")]
        public IHttpActionResult GetMachines(int? department_id = null)
        {
            string query = "SELECT * FROM machines";
            var ps = new Dictionary<string, object>();
            if (department_id.HasValue) {
                query += " WHERE department_id = @id";
                ps.Add("@id", department_id.Value);
            }

            DataTable dt = _db.ExecuteMSSQL(query, ps) ?? _db.ExecuteSQLite(query, ps);
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/bom/{itemCode}")]
        public IHttpActionResult GetBOM(string itemCode)
        {
            string query = "SELECT * FROM bom WHERE fg_item_code = @code OR parent_item = @code";
            var ps = new Dictionary<string, object> { { "@code", itemCode } };
            
            DataTable dt = _db.ExecuteMSSQL(query, ps) ?? _db.ExecuteSQLite(query, ps);
            return Ok(dt);
        }
    }

    public class LoginRequest {
        public string username { get; set; }
        public string password { get; set; }
    }
}
