var request = require("request");

var apiURL = "https://piazza.com/logic/api";
var cookieJar = request.jar();

var RPC = function(method, params) {
  var requestJSON = {
    url: apiURL,
    json: {
      method: method,
      params: params
    },
    jar: cookieJar
  };

  var promise = new Promise((resolve, reject) => {
    request.post(
      requestJSON,
      (error, response, body) => {
        if (error) {
          return reject(error);
        } else if (body.error) {
          return reject(body.error);
        }
        return resolve(body.result);
      }
    );
  });

  return promise;
}

module.exports = RPC;