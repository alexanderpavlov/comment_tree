(function ($) {
    $.showLoading = function () {
        $.hideLoading();
        $('body').append('<div class="loading-hider"></div>')
            .append('<div class="loading-progress-wrapper"><div class="loading-progress"><img src="/img/loading.gif"></div></div>');
        $('div.loading-hider').css('top', String(-$('div.loading-hider').offset().top) + 'px').css('height', $(document).height());
    };

    $.hideLoading = function () {
        $('div.loading-hider').remove();
        $('div.loading-progress-wrapper').remove();
    };

    $.hideAllModals = function () {
        $('.modal').modal('hide');
    };

    $.dateFormat = function (date) {
        var time;

        try {
            date = date.split(' ');
            time = date[1];
            date = date[0].split('-');
            time = time.split(':');
            time.pop();
            time = time.join(':');
            return date[2] + '.' + date[1] + '.' + date[0] + ', ' + time;
        }
        catch (err) {
            return date;
        }
    };

    $.showServiceModal = function (msg, type, callback) {
        var $serviceModal = $('#service-modal');

        if (msg instanceof Array)
            msg = msg.join('<br>');
        else if (msg instanceof Object) {
            var buffer = [];

            for (var key in msg) {
                buffer.push(msg[key]);
            }

            msg = buffer.join('<br>');
        }

        if (type == 'error') {
            $serviceModal.find('button').removeClass('btn-primary');
            $serviceModal.find('button').addClass('btn-danger');
        } else {
            $serviceModal.find('button').removeClass('btn-danger');
            $serviceModal.find('button').addClass('btn-primary');
        }

        $serviceModal.modal();
        $serviceModal.find('div[data-el="message"]').html(msg);

        $serviceModal.find('button').one('click', function () {
            $serviceModal.modal('hide');

            if (callback) {
                callback();
            }
        });
    };

    $.showErrorModal = function (msg, callback) {
        $.showServiceModal(msg, 'error', callback);
    };

    $.showInfoModal = function (msg, callback) {
        $.showServiceModal(msg, '', callback);
    };

    $.showConfirmModal = function (msg, callback) {
        var $confirmModal = $('#confirm-modal');
        $confirmModal.modal();
        $confirmModal.find('div[data-el="message"]').html(msg);
        $confirmModal.find('button[data-action="ok"]').unbind();
        $confirmModal.find('button[data-action="ok"]').one('click', function () {
            $confirmModal.modal('hide');
            callback();
        });
    };

    $.escapeHtml = function (text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }
})(jQuery);
