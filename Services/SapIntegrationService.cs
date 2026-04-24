using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace RPACProductionPlanner.Services
{
    /// <summary>
    /// Service to handle integration with SAP Business One Service Layer
    /// </summary>
    public class SapIntegrationService
    {
        private static readonly string ServiceLayerUrl = "https://your-sap-server:50000/b1s/v1/";
        private string _sessionContext;

        public async Task<bool> LoginAsync(string username, string password, string companyDb)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var loginData = new { UserName = username, Password = password, CompanyDB = companyDb };
                    var content = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");
                    
                    var response = await client.PostAsync(ServiceLayerUrl + "Login", content);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsAsync<dynamic>();
                        _sessionContext = result.SessionId;
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error: ex.Message
            }
            return false;
        }

        public async Task<dynamic> GetSalesOrderAsync(int docEntry)
        {
            if (string.IsNullOrEmpty(_sessionContext)) throw new Exception("Not logged in to SAP");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Cookie", $"B1SESSION={_sessionContext}");
                var response = await client.GetAsync(ServiceLayerUrl + $"Orders({docEntry})");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsAsync<dynamic>();
                }
            }
            return null;
        }

        public async Task<dynamic> GetItemStockAsync(string itemCode)
        {
            if (string.IsNullOrEmpty(_sessionContext)) throw new Exception("Not logged in to SAP");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Cookie", $"B1SESSION={_sessionContext}");
                var response = await client.GetAsync(ServiceLayerUrl + $"Items('{itemCode}')?$select=ItemCode,ItemName,QuantityOnStock");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsAsync<dynamic>();
                }
            }
            return null;
        }
    }
}
