// /Helpers/DatabaseHelper.cs
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace RPACProductionPlanner.Helpers
{
    public static class DatabaseHelper
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["RPACConnection"].ConnectionString;

        public static IDbConnection GetConnection()
        {
            var connection = new SqlConnection(ConnectionString);
            if (connection.State != ConnectionState.Open)
            {
                connection.Open();
            }
            return connection;
        }
    }
}
