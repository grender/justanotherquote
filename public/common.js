function setDownloadState(isDownload){
	_$(".whenDownloadHide").forEach(function(elem){toggle(elem,!isDownload);});
	_$(".whenDownloadShow").forEach(function(elem){toggle(elem,isDownload);});
}

function showError(message){
	alert(message);
}

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

function toggle(elem,show)
{
	if(show===undefined)
	{
		var curr=css(elem,"display");
		if(curr==="none")
		{
			show=true;
		}else {
			show=false;
		}
	}
	
	if(show)
		css(elem,"display","block");
	else
		css(elem,"display","none");
}

function css(elem,prop,val)
{
	if(val ===undefined)
		return elem.style.getPropertyValue(prop);
	elem.style.setProperty(prop,val,"");
}

function _$(qweryStr)
{
	var idRegExp = /#([\w\-]+)/;
	var classRegExp = /\.[\w\-]+/g;
	var id=(t=qweryStr.match(idRegExp))? t[1] : "";
	var classes=(t=qweryStr.match(classRegExp))? t : "";
	for(var i in classes)
		classes[i] = classes[i].substring(1,classes[i].length)
	return findElement(id,classes);
}

function findElement(id,cssClass)
{
	var results = [];
	function checkClassList(node,classList)
	{
		if(node.classList)
		{
			if(classList instanceof Array) {
				for(var key in classList) {
					if(!node.classList.contains(classList[key])) {
						return false;
					}
				}
				return true;
			} else {
				if(node.classList.contains(classList))
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
			if( id !== undefined && id !== "") {
				if(current.id === id) {
					if( cssClass !== undefined && cssClass !== "") {
						if(checkClassList(current,cssClass))
							return current;
					}else {
						return current;
					}
				}
			}
			
			if( cssClass !== undefined && cssClass !== "") {
				if(checkClassList(current,cssClass))
					results.push(current);
			}
			var res=find(current);
			if(res !== undefined)
				return res;
		}
	};

	
	var result=find(document.body);
	if(result)
		return result;
	return results;
}





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




