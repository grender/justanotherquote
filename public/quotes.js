window.onload = function(){
	window.document.body.onload = init();
};

function newCenterQuote() {
    var quote = _$("#quote");
    var quoteText = _$("#quoteText");
    var quoteSource = _$("#quoteSource");	
    var quoteWidth = quoteText.clientWidth;
    var quoteHeight = quoteText.clientHeight + quoteSource.clientHeight;
    var docHeight = document.body.clientHeight;
    var docWidth = document.body.clientWidth;
    var posX = docWidth / 2 - quoteWidth / 2;
    var posY = docHeight / 2 - quoteHeight / 2;
	css(quote,"margin-left", posX + "px");
	css(quote,"margin-top", posY + "px");
}

function setQuoteOnPage(quote){
    _$("#quoteText").innerHTML=quote.quote;
    if (quote.quoteSource == "") 
        _$("#quoteSource").innerHTML="";
    else 
        _$("#quoteSource").innerHTML='&mdash;&nbsp;' + quote.quoteSource;
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
	
	fadeOut(_$("#quote"),500, function(){
        getJSON("/api/getRandomQuote?"+Math.random(), function(json){
            if (json.error) {
                alert(json.error + "\n" + json.errorInfo);
                json = {
                    quote: "",
                    quoteSource: ""
                };
            }
            setQuoteOnPage(json);
            setDownloadState(false);
			fadeIn(_$("#quote"),500);
            newCenterQuote();
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



function init(){
    _$("#nextQuoteLink").onclick=getNewQuote;
    $("#helpLink").click(showHelp);
    $(".helpDiv").click(hideHelp);
    getNewQuote();
    $("#jPlayer").jPlayer({
        swfPath: "./",
		solution: "html,flash",
		supplied: "mp3" 		
    });

	$(".jp-audio").mouseenter(showPlayerProgress);
	$(".jp-audio").mouseleave(hidePlayerProgress);
	
	//$(".footerButtonsBarRight").width();
};

function showPlayerProgress()
{
	$(".fullControl").show('fast');
}

function hidePlayerProgress()
{
	$(".fullControl").hide('fast');
}
