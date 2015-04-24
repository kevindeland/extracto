var Caller = require('./caller').Caller;

var service_url = 'https://gateway.watsonplatform.net/laser/service/api/v1/sire/6b5a92a6-9fbd-4d8b-a60f-968076b36b3c';//'<service_url>';
var service_username = '97300eec-58ea-437a-89a3-14252b00095d';//'<service_username>';
var service_password = 'zcmIklvE4MJv';//'<service_password>';

var C = new Caller({
    url: service_url, 
    username: service_username, 
    pw: service_password
});




module.exports.Watson = C;

