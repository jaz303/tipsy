(function($) {
    $.fn.tipsy = function(opts) {

        opts = $.extend({fade: false, gravity: 'n', title: 'title', fallback: '', html: false}, opts || {});
        var tip = null;

        this.hover(function() {
            
            $.data(this, 'cancel.tipsy', true);

            var tip = $.data(this, 'active.tipsy');
            if (!tip) {
                tip = $('<div class="tipsy"><div class="tipsy-inner"/></div>');
                tip.css({position: 'absolute', zIndex: 100000});
                $.data(this, 'active.tipsy', tip);
            }
            
            if ($(this).attr('title') || typeof($(this).attr('original-title')) != 'string') {
                $(this).attr('original-title', $(this).attr('title') || '').removeAttr('title');
            }
            
            var title;
            if (typeof opts.title == 'string') {
                title = $(this).attr(opts.title == 'title' ? 'original-title' : opts.title);
            } else if (typeof opts.title == 'function') {
                title = opts.title.call(this);
            }
            
            tip.find('.tipsy-inner')[opts.html ? 'html' : 'text'](title || opts.fallback);
            
            var pos = $.extend({}, $(this).offset(), {width: this.offsetWidth, height: this.offsetHeight});
            tip.get(0).className = 'tipsy'; // reset classname in case of dynamic gravity
            tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
            var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
            var gravity = (typeof opts.gravity == 'function') ? opts.gravity.call(this) : opts.gravity;
            
            switch (gravity.charAt(0)) {
                case 'n':
                    tip.css({top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tipsy-north');
                    break;
                case 's':
                    tip.css({top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tipsy-south');
                    break;
                case 'e':
                    tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}).addClass('tipsy-east');
                    break;
                case 'w':
                    tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}).addClass('tipsy-west');
                    break;
            }

            if (opts.fade) {
                tip.css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 0.8});
            } else {
                tip.css({visibility: 'visible'});
            }

        }, function() {
            $.data(this, 'cancel.tipsy', false);
            var self = this;
            setTimeout(function() {
                if ($.data(this, 'cancel.tipsy')) return;
                var tip = $.data(self, 'active.tipsy');
                if (opts.fade) {
                    tip.stop().fadeOut(function() { $(this).remove(); });
                } else {
                    tip.remove();
                }
            }, 100);
            
        });

    };
    
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
    
})(jQuery);
