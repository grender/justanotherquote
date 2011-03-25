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

function setQuoteOnPage(quote){
    $(".quoteText").html(quote.quote);
    if (quote.quoteSource == "") 
        $(".quoteSource").html("");
    else 
        $(".quoteSource").html('&mdash;&nbsp;' + quote.quoteSource);
    if (quote.mp3link) {
		$(".jp-audio").toggle(true);
        $("#jPlayer").jPlayer("setMedia", {
            mp3: quote.mp3link
        }).jPlayer("play");
    }else {
		$(".jp-audio").toggle(false);
	}
}

function getNewQuote(){
    setDownloadState(true);
	$("#jPlayer").jPlayer("stop");
    $(".quote").fadeOut('fast', function(){
        $.getJSON("/api/getRandomQuote", function(json){
            if (json.error) {
                alert(json.error + "\n" + json.errorInfo);
                json = {
                    quote: "",
                    quoteSource: ""
                };
            }
            setQuoteOnPage(json);
            setDownloadState(false);
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
    $("#jPlayer").jPlayer({
        swfPath: "./",
		solution: "flash,html",
		supplied: "mp3" 		
    });

	$(".jp-audio").mouseenter(showPlayerProgress);
	$(".jp-audio").mouseleave(hidePlayerProgress);
	
	//$(".footerButtonsBarRight").width();
});

function showPlayerProgress()
{
	$(".fullControl").show('fast');
}

function hidePlayerProgress()
{
	$(".fullControl").hide('fast');
}
