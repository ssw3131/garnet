/**
 * Created by seonki on 2014-08-20.
 */
;
(function () {
	'use strict';
	var w = window, doc = document;
	var dk , fn, sMethod
	var trim = /^\s*|\s*$/g
// CORE :
	if ( !w['console'] ) w['console'] = {log: function () {}}
	w.dk = dk = {},
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
// FNS :
		fn( 'sList', function ( k, v ) {
			var list = {}, r = {
				S: function () {
					var i = 0, j = arguments.length, k, v; //루프용 i,j와 키밸류용 k, v
					while ( i < j ){
						k = arguments[i++];
						if ( i == j ) return k == 'list' ? list : list[k]
						else (v = arguments[i++]) === null ? delete list[k] : list[k] = v
					}
					return v;
				},
				update: function () {
					var k, t = list
					for ( k in t ) t[k]()
				}
			}
			return  r
		} ),
		fn( 'addEvent', function () {
			var arg = arguments, t0
			(t0 = arg[0].addEventListener) ? t0( arg[1], arg[2] ) : w.attachEvent( 'on' + arg[1], arg[2] )
		} ),
// OBJS :
		// 매니저 관련정의
		fn.obj( 'LOOP', (function () {
			var r = dk.sList( 'LOOP' )
			setInterval( r['update'], 16 )
			return r
		})() ),
		fn.obj( 'RESIZE', (function () {
			var r = dk.sList( 'RESIZE' )
			dk.addEvent( w, 'resize', r.update )
			return r
		})() )

})();
