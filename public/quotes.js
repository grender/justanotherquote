var currentQuote = -1;

function centerQuote(){

    var quote = $(".quote");
    var quoteText = $(".quoteText");
    var quoteSource = $(".quoteSource");
    
    var quoteWidth = quoteText.width();
    var quoteHeight = quoteText.height() + quoteSource.height();
    var docHeight = $(document).height();
    var docWidth = $(document).width();
    var posX = docWidth / 2 - quoteWidth / 2;
    var posY = docHeight / 2 - quoteHeight / 2;
    quote.css("margin-left", posX + "px");
    quote.css("margin-top", posY + "px");
}

function getNewQuote(){
    $.getJSON("/getRandomQuote", function(json){    
        $(".quote").fadeOut('fast', function(){
            $(".quoteText").html(json.quote);
            $(".quoteSource").html('&mdash;&nbsp;' + json.quoteSource);
            $(".quote").fadeIn('fast');
            centerQuote();
        }); 
    });
}

function showHelp(){
    $(".helpDiv").css("display", "block");
    $(".helpDiv").fadeIn('fast');
}

function hideHelp(){
    $(".helpDiv").css("display", "none");
    $(".helpDiv").fadeOut('fast');
}


$(document).ready(function(){
    $("#nextQuoteLink").click(getNewQuote);
    $("#helpLink").click(showHelp);
    $(".helpDiv").click(hideHelp);
    getNewQuote();
});
