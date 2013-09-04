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


var wsUrl = 'http://www.example.com/webservices/tempconvert.asmx';

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
                console.log('error: ' + response.statusCode);
                console.log(body);
                console.log(body[3]);
                var d= ('<'+fToC.conversion+'Result>');
                var c= ('</'+fToC.conversion+'Result>');
                var indice = (body.indexOf(d) + 27);
                console.log(indice);
                var final = body.indexOf(c);
                console.log(final);
                var pos = final - indice;
                console.log(pos);
                var temp = '';
                for (var i = indice; i < (indice + pos); i++) {

                    temp += body[i];

                }
                console.log(temp);

                cb(null, temp);
            }
        });

}

//module.exports.soapUse2 = soapUse2;
module.exports.soapUse = soapUse;