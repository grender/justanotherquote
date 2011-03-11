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
	$("#ajaxLoader").toggle(true);
    $(".quote").fadeOut('fast', function(){
        $.getJSON("/getRandomQuote", function(json){
            $(".quoteText").html(json.quote);
			$("#ajaxLoader").toggle(false);
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






            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-21693376-1']);
            _gaq.push(['_trackPageview']);
            
            (function(){
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();




