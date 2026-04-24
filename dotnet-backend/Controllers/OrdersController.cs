using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using Newtonsoft.Json;
using RPAC_ProductionPlanner.Services;

namespace RPAC_ProductionPlanner.Controllers
{
    [RoutePrefix("api/orders")]
    public class OrdersController : ApiController
    {
        private DatabaseService _db = new DatabaseService();

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetOrders(int? department_id = null)
        {
            // 1. Try MySQL (Production Tracking)
            string mysqlQuery = "SELECT * FROM work_orders";
            var mysqlParams = new Dictionary<string, object>();
            if (department_id.HasValue)
            {
                mysqlQuery += " WHERE department_id = @deptId";
                mysqlParams.Add("@deptId", department_id.Value);
            }

            DataTable dt = _db.ExecuteMySQL(mysqlQuery, mysqlParams);
            
            if (dt != null && dt.Rows.Count > 0)
            {
                return Ok(dt);
            }

            // 2. Fallback to SQLite
            string sqliteQuery = @"
                SELECT w.*, d.name as department_name, m.name as machine_name 
                FROM work_orders w
                LEFT JOIN departments d ON w.department_id = d.id
                LEFT JOIN machines m ON w.machine_id = m.id";
            
            var sqliteParams = new Dictionary<string, object>();
            if (department_id.HasValue)
            {
                sqliteQuery += " WHERE w.department_id = @deptId";
                sqliteParams.Add("@deptId", department_id.Value);
            }

            DataTable fallbackDt = _db.ExecuteSQLite(sqliteQuery, sqliteParams);
            return Ok(fallbackDt);
        }

        [HttpPost]
        [Route("delay")]
        public IHttpActionResult PostDelay([FromBody] DelayRequest request)
        {
            if (request == null) return BadRequest();

            // Store in MSSQL
            string mssqlQuery = "INSERT INTO delay_logs (order_id, original_date, new_date, reason) VALUES (@order_id, @orig, @new, @reason)";
            var mssqlParams = new Dictionary<string, object>
            {
                { "@order_id", request.order_id },
                { "@orig", request.original_date },
                { "@new", request.new_date },
                { "@reason", request.reason }
            };
            _db.ExecuteMSSQL(mssqlQuery, mssqlParams);

            // Update SQLite (Mirror)
            string sqliteUpdate = "UPDATE work_orders SET delivery_date_cs = @new WHERE id = @order_id";
            var sqliteParams = new Dictionary<string, object>
            {
                { "@new", request.new_date },
                { "@order_id", request.order_id }
            };
            _db.ExecuteSQLite(sqliteUpdate, sqliteParams);

            return Ok(new { success = true });
        }
    }

    public class DelayRequest
    {
        public int order_id { get; set; }
        public string original_date { get; set; }
        public string new_date { get; set; }
        public string reason { get; set; }
    }
}
