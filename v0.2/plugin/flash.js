;
'use strict';
(function(){
	var W = window, DOC = document, proto, addSwf, alterSwf;
	var trim = /^\s*|\s*$/g;

	addSwf = (function( $detector ){
		if( $detector.browser == "ie" && $detector.browserVer < 9 )
			return function(){
				var id = this.uuId, data = this.data, param = data.param, r, k;
				r = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width=' + data.width + ' height=' + data.height + ' id=' + id + ' style="position:absolute; margin:0px; padding:0px"><param name="movie" value=' + data.url + '>';
				for( k in param ){ r += '<param name=' + k + ' value=' + param[ k ] + ' />'; }
				r += '</object>',
					this.conEl.innerHTML = r, this.flash = this.conEl.childNodes[ 0 ];
			}
		else
			return function(){
				var id = this.uuId, data = this.data, param = data.param, r, k;
				r = '<object type="application/x-shockwave-flash" data=' + data.url + ' width=' + data.width + ' height=' + data.height + ' id=' + id + ' style="position:absolute; margin:0px; padding:0px">';
				for( k in param ){ r += '<param name=' + k + ' value=' + param[ k ] + ' />'; }
				r += '</object>',
					this.conEl.innerHTML = r, this.flash = this.conEl.childNodes[ 0 ];
			}
	})( dk.DETECTOR ),
		alterSwf = function(){
			this.conEl.innerHTML = '<a href="http://www.adobe.com/go/getflashplayer" target="_blank"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player"></a>';
		},
// FLASH :
		dk.cls( 'Flash', (function( $doc, $detector ){
			var factory, uuList = {}, Flash, Data, proto = {}, destroyFlash;

			destroyFlash = function( $k ){
				// todo 돔트리 제거
				delete uuList[ $k ];
			},

				Flash = function( $id ){
					var el = $doc.createElement( "div" ), s = el.style, conEl = $doc.createElement( "div" ), conS = conEl.style;
					this.uuId = $id, this.el = el, this.style = s, el.appendChild( conEl ), this.conEl = conEl, this.conStyle = conS, this.data = new Data();
				},
				Data = function(){
					this.url = "", this.width = 0, this.height = 0, this.version = 10.1, this.param = { wmode : 'opaque', allowScriptAccess : 'always' };
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
				Flash.prototype.load = (function(){
					return function(){
						var i = 0, j = arguments.length, k, v, data = this.data;
						while( i < j ){
							k = arguments[ i++ ], v = arguments[ i++ ], k in data ? data[ k ] = v : data.param[ k ] = v;
						}
						$detector.flash >= data.version ? ( addSwf.call( this ), proto.width.call( this, data.width ), proto.height.call( this, data.height ) ) : alterSwf.call( this );
						return this;
					}
				})(),

				factory = function( $k, $v ){
					if( $v === null ) return destroyFlash( $k ); // 돔제거
					return uuList[ $k ] ? uuList[ $k ] : uuList[ $k ] = new Flash( $k );
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

		proto = (function( $detector ){
			return {
				width : function( $v ){
					this.data.width = this.style.width = this.conStyle.width = this.flash.width = typeof $v == "number" ? $v + "px" : $v;
				},
				height : function( $v ){
					this.data.height = this.style.height = this.conStyle.height = this.flash.height = typeof $v == "number" ? $v + "px" : $v;
				},
				show : function(){
					this.conStyle.visibility = "visible";
				},
				hide : function(){
					this.conStyle.visibility = "hidden";
				},
				refresh : function(){
					addSwf.call( this );
				},
				add : function(){
					this.el.appendChild( this.conEl ), addSwf.call( this );
				},
				del : function(){
					this.el.removeChild( this.conEl );
				},
				toFlash : function( $v ){
					// todo ie10 이하 toFlash 문제
					log( this )
					log( this.flash )
					log( this.flash.toFlash )
					var f, t0;
					$v = $v.replace( /(\s*)/g, "" ),
						f = ( t0 = $v.split( '(' ) )[ 0 ],
							t0[ 1 ].charAt( 0 ) == ')' ? this.flash ? this.flash.toFlash( f ) : dk.err( 'flash 로딩 중' ) : this.flash ? this.flash.toFlash( f, t0[ 1 ].substring( 0, t0[ 1 ].length - 1 ) ) : dk.err( 'flash 로딩 중' );
				}
			}
		})( dk.DETECTOR ),
		dk.PROTO.connect( dk.Flash.fn, dk.PROTO.css, dk.PROTO.tree, proto )

})()