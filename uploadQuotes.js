/**
 * @author grender
 */
var CL='\n';
var quotes = [{
    quote: 'I must not fear.' + CL +
    'Fear is the mind-killer.' + CL +
    'Fear is the little-death that brings total obliteration.',
    quoteSource: 'Bene Gesserit litany against fear, «Dune» Frank Herbert'
}, {
    quote: 'Мысли о еще более быстрой скорости' + CL +
    'Обгоняют шальные мысли.' + CL +
    'Милая мы не молоды... Мы в таком возрасте,' + CL +
    'Когда надо чуть-чуть думать о жизни.',
    quoteSource: 'Сергей Бабкин — Не уходи'
}, {
    quote: 'В детстве я не мечтал стать никем.' + CL +
    'И сбылось, если честно.',
    quoteSource: 'макулатура — Никто'
}, {
    quote: 'Всё просто. Чётко и ясно. Я иду не туда.' + CL +
    'Человек никогда не становится взрослым.',
    quoteSource: 'ночные грузчики — Когда вырастешь'
}, {
    quote: 'Попугай повторял за ведущим программы «Время».' + CL +
    'А потом в кипящий борщ окунул голову.',
    quoteSource: 'ночные грузчики — Тоска атома'
}, {
    quote: 'Никто не заставляет продавать душу.' + CL +
    'Просто скажи: «Да я заблуждался, был молод.»',
    quoteSource: 'ночные грузчики — Изнанка'
}, {
    quote: 'Чувак не пропадёт.',
    quoteSource: '«Большой Лебовский»'
}, ];



var http = require('http');

var client = http.createClient(80, "grender.couchone.com");
var base64authData ="Basic " + new Buffer("reman:gnmjHkjgmnSdffj56", 'binary').toString('base64');

quotes.forEach(function(item){	
    var request = client.request("POST", "/justanotherquote/", {
        'Content-Type': 'application/json',
		host:"grender.couchone.com",
		authorization :base64authData
    });
    request.addListener('response', function(response){
        var responseBody = "";
response.addListener('error', function(){console.log("e");});
        
        response.addListener("data", function(chunk){
            responseBody += chunk;
        });
        
        response.addListener("end", function(){
            console.log(responseBody);
        });
    });
    request.end(JSON.stringify(item, encoding = 'utf8'), encoding = 'utf8');
});
