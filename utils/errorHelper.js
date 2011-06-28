function Error(errorMessage){
    if (errorMessage) {
        this.isSuccess = false;
        this.message = errorMessage;
    }
    else {
        this.isSuccess = true;
        this.message = '';
    }
}

exports.ok = new Error();
exports.error = function(errorMessage){
    if (errorMessage) {
        return new Error(errorMessage);
    }
    else {
        return new Error('Error');
    }
};

exports.okStr = JSON.stringify(exports.ok);
exports.errorStr = function(errorMessage){
    return JSON.stringify(exports.error(errorMessage))
};
