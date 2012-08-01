// tipsy, facebook style tooltips for jquery
// version 1.5.0 (big rewrite by adrien Gibrat)
// (c) 2008-2012 jason frame [jason@onehackoranother.com]
// released under the MIT license
( function ( $ ) {
	$.fn.tipsy         = function ( options ) {
		var set    = typeof options !== 'string'
			, opts = set ? $.tipsy.options( this.get( 0 ) || document, options ) : $.tipsy.defaults
		;
		if ( opts.live ) { // @todo: rewrite this to use jQuery 1.7 $.fn.one() ?!
			$( this.context )
				.delegate( this.selector, opts.trigger == 'hover' ? 'mouseenter.tipsy' : 'focus.tipsy', function () {
					$.tipsy.get( this, opts ).show();
				} )
				.delegate( this.selector, opts.trigger == 'hover' ? 'mouseleave.tipsy' : 'blur.tipsy', function () {
					$.tipsy.get( this, opts ).hide();
				} );
			return this;
		}
		return this.each( function () {
			var tipsy   = $.tipsy.get( this, options, set );
			if ( ! set && options in $.tipsy.prototype )
				tipsy[ options ]();
		} );
	};
	$.tipsy            = function ( element, options ) {
		var $element = $( element )
			, $tip   = $( '<div class="tipsy"><div class="tipsy-arrow"></div><div class="tipsy-inner"></div></div>' )
		;
		this.$element = $element;
		this.set( options = $.tipsy.options( element, options ) );
		this.$tip = $tip
			.addClass( options.className )
			.css( { top: 0, left: 0, visibility: 'hidden' } )
			.remove()
			.prependTo( document.body )
			.data( 'tipsy-pointee', element )
			.bind( 'position', function () {
				var width     = $tip.outerWidth()
					, height  = $tip.outerHeight()
					, gravity = $.isFunction( options.gravity ) ? options.gravity.call( element ) : options.gravity
					, pointee = $.extend( $element.offset(), {
						width  : $element.outerWidth(),
						height : $element.outerHeight()
					} )
					, position
				;
				switch ( gravity.charAt( 0 ) ) {
					case 'n':
						position = {
							top    : pointee.top + pointee.height + options.offset
							, left : pointee.left + pointee.width / 2 - width / 2
						};
						break;
					case 's':
						position = {
							top    : pointee.top - height - options.offset
							, left : pointee.left + pointee.width / 2 - width / 2
						};
						break;
					case 'e':
						position = {
							top    : pointee.top + pointee.height / 2 - height / 2
							, left : pointee.left - width - options.offset
						};
						break;
					case 'w':
						position = {
							top    : pointee.top + pointee.height / 2 - height / 2
							, left : pointee.left + pointee.width + options.offset
						};
						break;
				}
				if ( gravity.length == 2 )
					position.left = pointee.left + pointee.width / 2 - ( gravity.charAt( 1 ) == 'w' ? 15 : width - 15 );
				$tip
					.css( position )
					.attr( 'class', 'tipsy' ) // reset classname in case of dynamic gravity
					.addClass( 'tipsy-' + gravity )
					.find( '.tipsy-arrow' )
						.attr( 'class', 'tipsy-arrow tipsy-arrow-' + gravity.charAt( 0 ) )
				;
			} );
	};
	$.tipsy.prototype  = {
		set        : function ( options ) {
			if ( $.isPlainObject( options ) ) {
				this.options = $.extend( this.options || {}, options );
				var trigger = this.options.trigger;
				if ( trigger != 'manual' && ! this.options.live )
					this.$element
						.unbind( '.tipsy' )
						.bind( ( trigger == 'hover' ? 'mouseenter' : 'focus' ) + '.tipsy', $.proxy( this.show, this ) )
						.bind( ( trigger == 'hover' ? 'mouseleave' : 'blur' ) + '.tipsy', $.proxy( this.hide, this ) )
					;
			}
			return this;
		}
		, show     : function () {
			var title = this.$element.attr( 'title' );
			if ( title ) {
				this.$element.attr( 'data-original-title', title ).removeAttr( 'title' );
				if ( ! this.options.title )
					this.options.title = title;
			 }
			this.options.title ? this.enable() : this.disable();
			if ( ! this.enabled )
				return this;
			this.active = true;
			this.$tip
				.find( '.tipsy-inner' )
					.html( this.options.title )
				.end()
					.trigger( 'position' )
			;
			var self = this, title;
			setTimeout( function () {
				if ( self.active )
					if ( self.options.fade )
						self.$tip
							.stop()
							.css( { opacity: 0, visibility: 'visible' } )
							.animate( { opacity: self.options.opacity } )
						;
					else
						self.$tip
							.css( { opacity: self.options.opacity, visibility: 'visible' } )
						;
			}, this.options.delayIn );
			return this;
		}
		, hide     : function () {
			if ( ! this.enabled )
				return this;
			this.active = false;
			var self = this;
			setTimeout( function () {
				if ( ! self.active )
					if ( self.options.fade )
						self.$tip
							.stop()
							.animate( { opacity: 0 }, function() {
								self.$tip.css( { visibility: 'hidden' } )
							} )
						;
					else
						self.$tip
							.css( { visibility: 'hidden' } )
						;
			}, this.options.delayOut );
			return this;
		}
		, remove   : function () {
			var title = this.$element.attr( 'data-original-title' );
			if ( title )
				this.$element.attr( 'title', title ).removeAttr( 'data-original-title' );
			this.hide().disable().$tip.remove();
		}
		, validate : function () {
			if ( this.$element.is( ':not(:visible)' ) )
				return this.hide();
			var element = this.$element.get( 0 );
			if ( element )
				while ( element = element.parentNode )
					if ( element == document )
						return this;
			return this.remove();
		}
		, enable   : function () {
			this.enabled = true;
			return this;
		}
		, disable  : function () {
			this.enabled = false;
			return this.hide();
		}
		, toggle   : function () {
			return this.enabled ? this.disable() : this.enable();
		}
	};
	$.tipsy.defaults   = {
		className  : null
		, delayIn  : 0
		, delayOut : 0
		, fade     : false
		, gravity  : 'n'
		, live     : false
		, offset   : 0
		, opacity  : .8
		, title    : null
		, trigger  : 'hover'
	};
	$.tipsy.get        = function ( element, options, reset ) {
		var tipsy = $.data( element, 'tipsy' );
		if ( tipsy && reset )
			return tipsy.set( options );
		return tipsy || $.data( element, 'tipsy', new this( element, options ) );
	};
	$.tipsy.options    = function ( element, options ) {
		return $.extend( {}, $.tipsy.defaults /*, $.data( elements, 'tipsy-*' )*/, options );
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
			var offset    = $( this ).offset()
				, win     = $( window )
				, doc     = $( document )
				, top     = doc.scrollTop()
				, left    = doc.scrollLeft()
				, gravity = ( prefer || '' ).split( '' );
			if ( offset.top < top + margin )
				gravity[0] = 'n';
			if ( win.width() + left - offset.left < margin )
				gravity[1] = 'e';
			if ( win.height() + top - offset.top < margin )
				gravity[0] = 's';
			if ( offset.left < top + margin )
				gravity[1] = 'w';
			return gravity.join( '' );
		}
	};
	$.tipsy.autoNS     = function () {
		return $( this ).offset().top > ( $( document ).scrollTop() + $( window ).height() / 2 ) ? 's' : 'n';
	};
	$.tipsy.autoWE     = function () {
		return $( this ).offset().left > ( $( document ).scrollLeft() + $( window ).width() / 2 ) ? 'e' : 'w';
	};
} )( jQuery );
