;
'use strict';
(function(){
	var W = window, DOC = document, HEAD = DOC.getElementsByTagName( 'head' )[ 0 ], proto;

// FLASH :
	dk.cls( 'Flash', (function( $doc, $detector ){
		var factory, Flash, uuList = {}, proto = {}, destroyFlash;

		destroyFlash = function( $k ){
			// todo 导飘府 力芭
			delete uuList[ $k ];
		},

			Flash = function(){
				var el = $doc.createElement( "div" ), s = el.style, conEl = $doc.createElement( "div" ), conS = conEl.style;
				this.el = el, this.style = s, el.appendChild( conEl ), this.conEl = conEl, this.conStyle = conS
			},
			Flash.prototype.S = (function(){
				var prefixCss = $detector.prefixCss, nopx = { opacity : 1, zIndex : 1, 'z-index' : 1 };
				return function(){
					var i = 0, j = arguments.length, k, v, e = this.el, s = this.style, r, t0;
					while( i < j ){
						k = arguments[ i++ ];
						if( i == j ) return proto[ k ] ? proto[ k ].call( this ) :
								k.indexOf( '@' ) > -1 ? e.getAttribute( k.replace( '@', '' ) ) :
							( r = s[ k ], t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0 );
						else  v = arguments[ i++ ],
							proto[ k ] ? proto[ k ].call( this, v ) :
									k.indexOf( '@' ) > -1 ? e.setAttribute( k.replace( '@', '' ), v ) :
								s[ k ] = s[ prefixCss + k ] = typeof v == 'number' ? nopx[ k ] ? v : v + 'px' : v
					}
					return this;
				}
			})(),

			factory = function( $k, $v ){
				if( $v === null ) return destroyFlash( $k ); // 导力芭
				return uuList[ $k ] ? uuList[ $k ] : uuList[ $k ] = new Flash();
			},
			factory.fn = function(){
				var i = 0, j = arguments.length, k, v;
				while( i < j ){
					k = arguments[ i++ ];
					if( i == j ) return proto[ k ];
					else v = arguments[ i++ ], v === null ? delete proto[ k ] : proto[ k ] = v;
				}
			};

		return factory;
	})( DOC, dk.DETECTOR ) ),
		proto = {
			url : function( $v ){
				log( $v )
			},
			version : function( $v ){
				log( 'version', $v )
			}
		},
		dk.PROTO.connect( dk.Flash.fn, dk.PROTO.css, dk.PROTO.tree, proto )

})()