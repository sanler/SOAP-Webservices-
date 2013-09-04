/**
 * Created with JetBrains WebStorm.
 * User: b.slm
 * Date: 3/09/13
 * Time: 9:51
 * To change this template use File | Settings | File Templates.
 */

var app2 = require('./app.js');
var swig = require('swig');
var cons = require('consolidate');
var request = require('request');

var cheerio = require('cheerio');



var wsUrl = 'http://www.w3schools.com/webservices/tempconvert.asmx';

var soapUse = function soapPost2(fToC, cb) {

    var soap = swig.renderFile('soapEnvelope.xml', { conversion: fToC.conversion, grades: fToC.grades, temperatura: fToC.data.msg});
    console.log(soap);

    request.post({

            url: wsUrl,
            headers: {
                "Host": "www.w3schools.com",
                "Content-Type": "text/xml",
                "SOAPAction": fToC.soap
            },
            body: soap

        },

        function (error, response, body) {
            if (response.statusCode === 201) {
                console.log('Status Update');
            } else {
                var $ = cheerio.load(body, {xmlMode: true});
                var temp = $(fToC.conversion+'Result').text();
                cb(null, temp);
            }
        });

}

//module.exports.soapUse2 = soapUse2;
module.exports.soapUse = soapUse;