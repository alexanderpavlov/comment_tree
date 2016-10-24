(function($) {
    $.request = function(url, method, data, callback, errorCallback) {
        $.ajax({
            type: method,
            url: url,
            data: data,
            success: function(data){
                $.hideLoading();

                if(Number(data.status)) {
                    callback(data);
                } else {
                    $.showErrorModal((data.errors ? data.errors : 'Unknown error occurred!'));

                    if(errorCallback) {
                        errorCallback();
                    }
                }
            },
            error: function() {
                $.showErrorModal('Unknown error occurred!');
                if(errorCallback) {
                    errorCallback();
                }
            }
        });
    };

    $.restGet = function (url, id, callback, errorCallback) {
        return $.request(url+'/'+id, 'get', {}, callback, errorCallback);
    };

    $.restGetCollection = function (url, callback, errorCallback) {
        return $.request(url, 'get', {}, callback, errorCallback);
    };

    $.restAdd = function (url, data, callback, errorCallback) {
        return $.request(url, 'put', data, callback, errorCallback);
    };

    $.restUpdate = function (url, id, data, callback, errorCallback) {
        return $.request(url+'/'+id, 'post', data, callback, errorCallback);
    };

    $.restDelete = function (url, id, callback, errorCallback) {
        return $.request(url+'/'+id, 'delete', {}, callback, errorCallback);
    };
})(jQuery);