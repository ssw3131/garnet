/**
 * Created by seonki on 2014-08-20.
 */
;
(function () {
	'use strict';
	var W = window, doc = document;
	var dk , fn, sMethod
	var trim = /^\s*|\s*$/g
// CORE :
	if ( !W['console'] ) W['console'] = {log: function () {}}
	W.requestAnimFrame = (function () {return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function ( loop ) {W.setTimeout( loop, 17 )}})();
	W.dk = dk = {},
		sMethod = {
			S: function () {
				var i = 0, j = arguments.length, k, v;
				while ( i < j ){
					k = arguments[i++];
					if ( i == j ) {
						if ( k == 'this' ) return this;
						return typeof this[k] == 'function' ? this[k]() : this[k]
					}
					else {
						v = arguments[i++]
						if ( v === null ) delete this[k];
						typeof this[k] == 'function' ? this[k]( v ) : this[k] = v
					}
				}
				return v;
			}
		},
		fn = dk['fn'] = function ( k, v ) { dk[k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length )] = v},
		fn['cls'] = function ( k, v ) { k = k.replace( trim, '' ).toLowerCase(), dk[k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length )] = v},
		fn['obj'] = function ( k, v ) {dk[k.replace( trim, '' ).toUpperCase()] = v},
// EVENT :
		fn( 'addEvent', function () {
			var arg = arguments, t0
			(t0 = arg[0].addEventListener) ? t0( arg[1], arg[2] ) : W.attachEvent( 'on' + arg[1], arg[2] )
		} ),
// FNS :
		fn( 'sList', (function () {
			function dkList() {this.list = {}, this.name = arguments[0]}
			dkList.prototype = {
				S: function () {
					var i = 0, j = arguments.length, k, v;
					while ( i < j ){
						k = arguments[i++];
						if ( i == j ) {
							if ( k == 'this' ) return this;
							else if ( k == 'list' ) return this.list;
							return typeof this[k] == 'function' ? this[k]() : this.list[k]
						}
						else {
							v = arguments[i++]
							if ( v === null ) delete this[k];
							typeof this[k] == 'function' ? this[k]( v ) : this.list[k] = v
						}
					}
					return v;
				},
				update: function () {
					var k, t = this.list
					for ( k in t ) t[k]()
				}
			}
			return function ( k ) { return new dkList( k )}
		})() ),


// OBJS :
		// 매니저 관련정의
		fn.obj( 'LOOP', (function () {
			var r = dk.sList( 'LOOP' );(function loop() { r['update'](), requestAnimFrame( loop )})();
			return r
		})() ),
		fn.obj( 'WIN', (function () {
			return {
				RESIZE: (function () {
					var r = dk.sList( 'RESIZE' )
					dk.addEvent( W, 'resize', function () { r['update'].call( r ) } )
					return r
				})()
			}
		})() )

})();
