var request = require("request");

var apiUrl = "https://piazza.com/logic/api";
var cookieJar = request.jar();

var callPetty = function(method, params) {
	var requestJson = {
    url: apiUrl, 
    json: {
      method: method,
      params: params
    }, 
    jar: cookieJar
  };

	var promise = new Promise(function(resolve, reject) {
		request.post(requestJson, function(error, response, body) {
  		if (error) {
  			return reject(error);
  		} else if (body.error) {
  			return reject(body.error);
  		}
  		return resolve(body.result);
  	});
  });

	return promise;
}

module.exports = callPetty;