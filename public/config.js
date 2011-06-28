$(document).ready(function(){
    $("#saveLink").click(saveForm);
});

function saveForm(){
    var result = {
        dbHost: $("#dbHost").val(),
        dbPort: $("#dbPort").val(),
        dbPath: $("#dbPath").val(),
        dbUser: $("#dbUser").val(),
        dbPass: $("#dbPass").val(),
		serverPort: $("#serverPort").val()
    };
    var resultPort=result.serverPort;
	setDownloadState(true);
    $.ajax({
        type: 'POST',
        url: "/api/saveConfig",
        data: result,
        dataType: "json"
    }).success(function(result){
		if(result.isSuccess) {
			alert("All ok. Redirecting...");
			window.location = "http://"+window.location.hostname + (resultPort===80 ? "" : ":"+resultPort);
		} else {
			showError(result.message);
		}
		setDownloadState(false);
    }).error(function(){
        showError("Error working with server...");
		setDownloadState(false);
    });
}
