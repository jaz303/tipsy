// tipsy, facebook style tooltips for jquery
// version 1.0.0a version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license
( function ( $ ) {
	function maybeCall ( thing, ctx ) {
		return $.isFunction( thing ) ? thing.call( ctx ) : thing;
	};
	$.tipsy            = function ( element, options ) {
		this.$element = $( element );
		this.options  = options;
		this.enabled  = true;
		if ( this.$element.attr( 'title' ) || typeof( this.$element.attr('original-title') ) != 'string' ) {
			this.$element.attr( 'original-title', this.$element.attr( 'title' ) || '' ).removeAttr( 'title' );
		}
		this.$tip = $( '<div class="tipsy"><div class="tipsy-arrow"></div><div class="tipsy-inner"></div></div>' );
	};
	$.tipsy.prototype  = {
		show     : function () {
			var $e = this.$element, o = this.options;
		function getTitle () {
			var title;
			if (typeof o.title == 'string') {
				title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
			} else if (typeof o.title == 'function') {
				title = o.title.call($e[0]);
			}
			title = ('' + title).replace(/(^\s*|\s*$)/, "");
			return title || o.fallback;
		}
			
			var title = getTitle();
			if (title && this.enabled) {
				var self = this,
					$tip = this.$tip;
				
				$tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
				$tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
				$tip.remove()
				.css({top: 0, left: 0, visibility: 'hidden', display: 'block'})
				.prependTo(document.body)
				.data('tipsy-pointee', this.$element[0]);
				var actualWidth = $tip[0].offsetWidth,
					actualHeight = $tip[0].offsetHeight,
					gravity = maybeCall(this.options.gravity, this.$element[0]);
				$tip.bind( 'position', function () {
					var pos = $.extend({}, self.$element.offset(), {
						width: self.$element[0].offsetWidth,
						height: self.$element[0].offsetHeight
					});
					var tp;
					switch (gravity.charAt(0)) {
						case 'n':
							tp = {top: pos.top + pos.height + self.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
							break;
						case 's':
							tp = {top: pos.top - actualHeight - self.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
							break;
						case 'e':
							tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - self.options.offset};
							break;
						case 'w':
							tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + self.options.offset};
							break;
					}
					if (gravity.length == 2) {
						if (gravity.charAt(1) == 'w') {
							tp.left = pos.left + pos.width / 2 - 15;
						} else {
							tp.left = pos.left + pos.width / 2 - actualWidth + 15;
						}
					}
					$tip.css(tp);
				})
				.trigger('position')
				.addClass('tipsy-' + gravity)
				.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
				if (this.options.className) {
					$tip.addClass(maybeCall(this.options.className, this.$element[0]));
				}
				if (this.options.fade) {
					$tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
				} else {
					$tip.css({visibility: 'visible', opacity: this.options.opacity});
				}
			}
		},
		hide     : function () {
			if ( this.options.fade )
				this.$tip.stop().fadeOut( function () { $( this ).remove(); } );
			else 
				this.$tip.remove();
		},
		validate : function () { // validate in DOM => validate visibility?
			var element = this.$element && this.$element[0];
			if ( element )
				while ( element = element.parentNode )
					if ( element == document )
						return;
			this.hide();
			this.$element = this.options = this.$tip = null;
		},
		enable   : function() { this.enabled = true; },
		disable  : function() { this.enabled = false; },
		toggle   : function() { this.enabled = ! this.enabled; }
	};
	$.fn.tipsy         = function ( options ) {
		if ( options === true )
			return this.data( 'tipsy' );
		if ( typeof options == 'string' ) {
			if ( options in $.tipsy.prototype )
				this.each( function () {
					get.call( this )[ options ]();
				} );
			return this;
		}
		function get ( options ) {
			var tipsy = $.data( this, 'tipsy' );
			if ( ! tipsy )
				$.data( this, 'tipsy', tipsy = new $.tipsy( this, options ) );
			return tipsy;
		}
		function enter () {
			var tipsy = get.call( this, options );
			tipsy.hoverState = 'in';
			options.delayIn ? 
				setTimeout( function () {
					if (tipsy.hoverState == 'in')
						tipsy.show();
				}, options.delayIn )
				: tipsy.show();
		};
		function leave () {
			var tipsy = get.call( this, options );
			tipsy.hoverState = 'out';
			options.delayOut ?
				setTimeout( function () {
					if (tipsy.hoverState == 'out')
						tipsy.hide();
				}, options.delayOut )
				: tipsy.hide();
		};
		options = $.extend( {}, $.tipsy.defaults, options );
		if ( ! options.live )
			this.each( function () {
				get.call( this, options );
			} );
		if ( options.trigger != 'manual' ) {
			var binder   = options.live ? 'live' : 'bind',
				eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
				eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
			this[binder](eventIn, enter)
				[binder](eventOut, leave);
		}
		return this;
	};
	$.tipsy.defaults   = {
		className : null,
		delayIn   : 0,
		delayOut  : 0,
		fade      : false,
		fallback  : '',
		gravity   : 'n',
		html      : false,
		live      : false,
		offset    : 0,
		opacity   : 0.8,
		title     : 'title',
		trigger   : 'hover'
	};
	$.tipsy.validate   = function () {
		$( '.tipsy' ).each( function () {
			var element = $.data( this, 'tipsy-pointee' );
			element ?
				$( element ).tipsy( 'validate' )
				: $( this  ).remove();
		} );
	};
	/**
	 * yields a closure of the supplied parameters, producing a function that takes
	 * no arguments and is suitable for use as an autogravity function like so:
	 *
	 * @param margin (int) - distance from the viewable region edge that an
	 *		element should be before setting its tooltip's gravity to be away
	 *		from that edge.
	 * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
	 *		if there are no viewable region edges effecting the tooltip's
	 *		gravity. It will try to vary from this minimally, for example,
	 *		if 'sw' is preferred and an element is near the right viewable 
	 *		region edge, but not the top edge, it will set the gravity for
	 *		that element's tooltip to be 'se', preserving the southern
	 *		component.
	 */
	$.tipsy.autoBounds = function ( margin, prefer ) {
		return function() {
			var offset   = $( this ).offset()
				, win    = $( window )
				, doc    = $( document )
				, top    = doc.scrollTop()
				, left   = doc.scrollLeft();
			prefer = ( prefer || '' ).split( '' );
			if ( offset.top < top + margin )
				prefer[0] = 'n';
			if ( win.width() + left - offset.left < margin )
				prefer[1] = 'e';
			if ( win.height() + top - offset.top < margin )
				prefer[0] = 's';
			if ( offset.left < top + margin )
				prefer[1] = 'w';
			return prefer.join( '' );
		}
	};
	$.tipsy.autoNS     = function () {
		return $( this ).offset().top > ( $( document ).scrollTop() + $( window ).height() / 2 ) ? 's' : 'n';
	};
	$.tipsy.autoWE     = function () {
		return $( this ).offset().left > ( $( document ).scrollLeft() + $( window ).width() / 2 ) ? 'e' : 'w';
	};
} )( jQuery );