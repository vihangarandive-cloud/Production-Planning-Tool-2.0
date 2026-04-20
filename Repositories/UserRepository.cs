// /Repositories/UserRepository.cs
using System.Data;
using Dapper;
using RPACProductionPlanner.Helpers;
using RPACProductionPlanner.Models;

namespace RPACProductionPlanner.Repositories
{
    public class UserRepository
    {
        public UserAccount ValidateUser(string username, string passwordHash)
        {
            using (var conn = DatabaseHelper.GetConnection())
            {
                return conn.QueryFirstOrDefault<UserAccount>("usp_ValidateUser", new { Username = username, PasswordHash = passwordHash }, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
