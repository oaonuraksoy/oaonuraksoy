// ==============================================================================
// İleti Merkezi C# .NET XML SMS Gateway Integration Service
// Architecture: Onur Aksoy (a.k.a. Hackonomist) — https://onuraksoy.com.tr
// Repository: https://github.com/oaonuraksoy/iletimerkezi-cSharp-XML-Api
// Target: .NET Standard 2.0 / .NET 6 / .NET 8 / .NET 9
// ==============================================================================

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Xml.Linq;

namespace IletiMerkeziApi
{
    public class IletiMerkeziSmsService
    {
        private readonly string _apiKey;
        private readonly string _apiHash;
        private readonly string _originator;
        private const string ApiEndpoint = "https://api.iletimerkezi.com/v1/send-sms";
        private const string BalanceEndpoint = "https://api.iletimerkezi.com/v1/get-balance";

        public IletiMerkeziSmsService(string apiKey, string apiHash, string originator)
        {
            _apiKey = apiKey ?? throw new ArgumentNullException(nameof(apiKey));
            _apiHash = apiHash ?? throw new ArgumentNullException(nameof(apiHash));
            _originator = originator ?? throw new ArgumentNullException(nameof(originator));
        }

        /// <summary>
        /// Sends an immediate single transactional SMS or 2FA OTP code.
        /// </summary>
        public SmsResponse SendSingle(string rawPhoneNumber, string messageText)
        {
            var cleanPhone = SanitizePhoneNumber(rawPhoneNumber);
            var xmlPayload = new XDocument(
                new XElement("request",
                    new XElement("authentication",
                        new XElement("key", _apiKey),
                        new XElement("hash", _apiHash)
                    ),
                    new XElement("order",
                        new XElement("sender", _originator),
                        new XElement("sendDateTime"),
                        new XElement("message",
                            new XElement("text", new XCData(messageText)),
                            new XElement("receipents",
                                new XElement("number", cleanPhone)
                            )
                        )
                    )
                )
            ).ToString(SaveOptions.DisableFormatting);

            return ExecutePost(ApiEndpoint, xmlPayload);
        }

        /// <summary>
        /// Sends a batch SMS to multiple recipients in a single HTTP request.
        /// </summary>
        public SmsResponse SendBulk(IEnumerable<string> phoneNumbers, string messageText)
        {
            var recipientsElement = new XElement("receipents");
            foreach (var phone in phoneNumbers)
            {
                recipientsElement.Add(new XElement("number", SanitizePhoneNumber(phone)));
            }

            var xmlPayload = new XDocument(
                new XElement("request",
                    new XElement("authentication",
                        new XElement("key", _apiKey),
                        new XElement("hash", _apiHash)
                    ),
                    new XElement("order",
                        new XElement("sender", _originator),
                        new XElement("sendDateTime"),
                        new XElement("message",
                            new XElement("text", new XCData(messageText)),
                            recipientsElement
                        )
                    )
                )
            ).ToString(SaveOptions.DisableFormatting);

            return ExecutePost(ApiEndpoint, xmlPayload);
        }

        /// <summary>
        /// Queries remaining SMS account balance credits.
        /// </summary>
        public int QueryBalance()
        {
            var xmlPayload = new XDocument(
                new XElement("request",
                    new XElement("authentication",
                        new XElement("key", _apiKey),
                        new XElement("hash", _apiHash)
                    )
                )
            ).ToString(SaveOptions.DisableFormatting);

            var response = ExecutePost(BalanceEndpoint, xmlPayload);
            if (response.IsSuccess && int.TryParse(response.RawBody, out int balance))
            {
                return balance;
            }
            return -1;
        }

        private static string SanitizePhoneNumber(string input)
        {
            var digitsOnly = new StringBuilder();
            foreach (char c in input)
            {
                if (char.IsDigit(c)) digitsOnly.Append(c);
            }
            var s = digitsOnly.ToString();
            if (s.StartsWith("90") && s.Length == 12) return s.Substring(2);
            if (s.StartsWith("0") && s.Length == 11) return s.Substring(1);
            return s;
        }

        private static SmsResponse ExecutePost(string url, string xmlPayload)
        {
            byte[] byteArray = Encoding.UTF8.GetBytes(xmlPayload);
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "text/xml; charset=UTF-8";
            request.ContentLength = byteArray.Length;
            request.Timeout = 15000;

            using (var dataStream = request.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
            }

            try
            {
                using (var response = (HttpWebResponse)request.GetResponse())
                using (var reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
                {
                    var resultXml = reader.ReadToEnd();
                    var xdoc = XDocument.Parse(resultXml);
                    var status = xdoc.Root?.Element("status");
                    var code = status?.Element("code")?.Value ?? "500";
                    var message = status?.Element("message")?.Value ?? "Unknown";

                    return new SmsResponse
                    {
                        StatusCode = code,
                        Message = message,
                        IsSuccess = code == "200",
                        RawBody = resultXml
                    };
                }
            }
            catch (WebException ex)
            {
                return new SmsResponse
                {
                    StatusCode = "ERR",
                    Message = ex.Message,
                    IsSuccess = false,
                    RawBody = string.Empty
                };
            }
        }
    }

    public class SmsResponse
    {
        public string StatusCode { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string RawBody { get; set; } = string.Empty;
    }
}
