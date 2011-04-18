window.onload = function(){
	window.document.body.onload = init();
};

function getJSON(url,callback)
{
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET",url,true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4) {
			if(xmlhttp.status === 200) {
				callback(JSON.parse(xmlhttp.responseText));
			}
		}
	};
	xmlhttp.send(null);	
}

function findElement(id,cssClass)
{
	var results = [];
	
	function checkClassList(node,classList)
	{
		if( current.classList)
		{
			if(classList instanceof Array) {
				for(var key in classList) {
					if(!current.classList.contains(classList[key])) {
						return false;
					}
				}
			} else {
				if(current.classList.contains(classList))
					return true;
			}
		}
		return false;				
	}
	
	function find(where) {	
		for(var childItem in where.childNodes)
		{
			var current=where.childNodes[childItem];
			// если задан только id
			if(id!=="" && current.id === id)
			{
				// проверяем что у этого id есть нужные классы
				if( cssClass === undefined || checkClassList(current,cssClass)) {
					return current;
				}else {
					return;
				}
			}
				
			if( cssClass !== undefined ) {
				if(checkClassList(current,cssClass))
					results.push(current);
			}
			var res=find(current);
			if(res !== undefined)
				return res;
		}
	};

	
	var result=find(document.body);

	if (results.length !== 0)
		return results;
	return result;
}

function newCenterQuote() {
    var quote = findElement("quote");
    var quoteText = findElement("quoteText");
    var quoteSource = findElement("quoteSource");	
    var quoteWidth = quoteText.clientWidth;
    var quoteHeight = quoteText.clientHeight + quoteSource.clientHeight;
    var docHeight = document.body.clientHeight;
    var docWidth = document.body.clientWidth;
    var posX = docWidth / 2 - quoteWidth / 2;
    var posY = docHeight / 2 - quoteHeight / 2;
	quote.style.setProperty("margin-left", posX + "px", "");
	quote.style.setProperty("margin-top", posY + "px", "");
}

function centerQuote(){
    var quote = $("#quote");
    var quoteText = $("#quoteText");
    var quoteSource = $("#quoteSource");
    
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
    $("#quoteText").html(quote.quote);
    if (quote.quoteSource == "") 
        $("#quoteSource").html("");
    else 
        $("#quoteSource").html('&mdash;&nbsp;' + quote.quoteSource);
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
    $("#quote").fadeOut('fast', function(){
        getJSON("/api/getRandomQuote", function(json){
            if (json.error) {
                alert(json.error + "\n" + json.errorInfo);
                json = {
                    quote: "",
                    quoteSource: ""
                };
            }
            setQuoteOnPage(json);
            setDownloadState(false);
            $("#quote").fadeIn('fast');
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
};

function showPlayerProgress()
{
	$(".fullControl").show('fast');
}

function hidePlayerProgress()
{
	$(".fullControl").hide('fast');
}
