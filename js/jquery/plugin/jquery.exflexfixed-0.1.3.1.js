/*
 * 	Ex Flex Fixed 0.1.3 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2011 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($){
	$.ex = $.ex || {};

	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(idx){
								var apix = api[idx];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex.flexFixed = function(idx , targets , option){
		var o = this,
		c = o.config = $.extend({} , $.ex.flexFixed.defaults , option);
		c.targets = targets;
		c.target = c.targets.eq(idx);
		c.index = idx;

		c._win = $(window);
		var top = c._win.scrollTop();
		c._win.scrollTop(0);

		c.target.css('position','fixed');
		c._baseTop = c.target.offset().top;
		c._margin = {
			top : parseInt(c.target.css('margin-top')) || 0,
			bottom : parseInt(c.target.css('margin-bottom')) || 0
		}
		c._targetHeight = c.target.outerHeight();
		c._cont = c.container ? $(c.container) : o._getContainer();
		c._contBottom = c._cont.offset().top + c._cont.outerHeight();
		c._baseLeft = (c.target.offset().left - (parseInt(c.target.css('margin-left'))||0))- c._cont.offset().left - c._win.scrollLeft();
		o._setEvent();
		!c.watchPosition || o.watchPosition();
		c._win.scrollTop(top);
	}
	$.extend($.ex.flexFixed.prototype, {
		_getContainer : function(){
			var o = this, c = o.config;
			var cont;
			var parents = c.target.parents()
			parents.each(function(idx){
				if (parents.eq(idx).outerHeight() > c._targetHeight + c._margin.top + c._margin.bottom) {
					cont = parents.eq(idx);
					return false;
				}
			});
			return cont ? cont : $('body');
		},
		_setEvent : function(){
			var o = this, c = o.config;
			c.nextTop = c.prevTop = 0;
			o.adjustPosition();
			c._win.
				scroll(function(){
					o.adjustPosition();
				}).
				resize(function(){
					o._setLeft();
				});
		},
		_setLeft : function(){
			var o = this, c = o.config;
			c.target.css('left',c._cont.offset().left + c._baseLeft - c._win.scrollLeft());
		},
		watchPosition : function(){
			var o = this, c = o.config;
			if (c.watchPosition){
				if(isNaN(c.watchPosition)){
					c.watchPosition = 300;
				}
				setTimeout(function(){
					o.resetTop();
					o.watchPosition();
				},c.watchPosition);
			}
		},
		resetTop : function(){
			var o = this, c = o.config;
			c.target.css('position','static');
			c._baseTop = c.target.offset().top;
			c.target.css('position','fixed');
			o.adjustPosition();
		},
		adjustPosition : function(){
			var o = this, c = o.config;
			var scrollTop = c._win.scrollTop();
			var viewDff = 0;
			if (c._win.height() < c._targetHeight){
				viewDff = c._targetHeight - c._win.height() + c._margin.top + c._margin.bottom;
			}
			var downTop = (c._baseTop - c._margin.top) - scrollTop;
			if (downTop + viewDff >= 0) {
				c.nextTop = downTop;
			}
			else {
				var bottomTop = c._contBottom - (scrollTop + c._targetHeight + c._margin.top + c._margin.bottom);
				if (bottomTop + viewDff <= 0) {
					c.nextTop = bottomTop;
				}
				else {
					c.nextTop = - viewDff;
				}
			}
//			if (c.prevTop != c.nextTop) {
//				c.target.css('top',c.nextTop);
//			}
			c.target.css('top',c.nextTop);
			c.prevTop = c.nextTop;
			o._setLeft();
		}


	});
	$.ex.flexFixed.defaults = {
		api : false,
		watchPosition : false,
		container : null
	}
	$.fn.exFlexFixed = function(option){
		var targets = this,api = [];
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-flex-fixed') || new $.ex.flexFixed( idx , targets , option);
			api.push(obj);
			target.data('ex-flex-fixed',obj);
		});
		return option && option.api ? API(api) : targets;
	}




})(jQuery);

