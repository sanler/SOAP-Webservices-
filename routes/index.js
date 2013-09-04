
/*
 * GET home page.
 */

exports.index = function(req, res){
    tempClient.getCelsius(12, function(err, result){
        res.render('index.html', {result: result });
    });

};