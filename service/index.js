var express = require('express');
var superagent = require('superagent')
var cheerio = require('cheerio')
var app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function (req, res) {

    superagent.get('https://www.imooc.com/course/list?c=fe')
        .end(function (err, sres) {

            if (err) {
                return next(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];
            $('.course-card-container').each(function (idx, element) {
                var $element = $(element);
                items.push({
                    image: $(this).find(".course-card-top").children('img').attr('src'),
                    title: $(this).find(".course-card-content").children('h3').text(),
                    people: $(this).find(".course-card-info").find("span:last-child").text()

                });
            });

            res.json(items);
        });
});

app.listen(process.env.PORT || 5000);