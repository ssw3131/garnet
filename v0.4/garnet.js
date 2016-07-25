;
'use strict';
(function(){
	var W = window, DOC = document;
	var dk;
	var trim = /^\s*|\s*$/g;

// 보정패치 :
	W.console = W[ 'console' ] ? W[ 'console' ] : { log : function(){} },
		W.log = W[ 'log' ] ? W[ 'log' ] : function(){ W.console.log( arguments[ 0 ] ) },
		Date.now = Date.now * 1 || function(){ return +new Date },
		W.requestAnimFrame = (function(){ return W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function( $loop ){ W.setTimeout( $loop, 17 ) } })(),
		(function( f ){ W.setTimeout = f( W.setTimeout ), W.setInterval = f( W.setInterval ) })( function( f ){
			return function( $a, $b ){
				var a = [].slice.call( arguments, 2 );
				return f( function(){ $a.apply( this, a ); }, $b );
			};
		} ),

// dk :
		dk = W.dk = W[ 'dk' ] ? W[ 'dk' ] : dk = (function( $doc ){
			return function( $host ){
				var check;
				check = setInterval( function(){
					switch( $doc.readyState ){
						case'complete':
						case'interactive':
						case'loaded':
							break;
						default:
							return;
					}
					if( $doc && $doc.getElementsByTagName && $doc.getElementById && $doc.body ){
						clearInterval( check ), $host ? $host() : null;
					}
				}, 5 );
			}
		})( DOC ),

// CORE :
		dk.fn = function( $k, $v ){
			$k = $k.replace( trim, '' ), $k = $k.charAt( 0 ).toLowerCase() + $k.substring( 1, $k.length ),
				dk[ $k ] ? dk.err( 'dk.fn에 이미 ' + $k + '값이 존재합니다' ) : dk[ $k ] = $v;
		},
		dk.cls = function( $k, $v ){
			$k = $k.replace( trim, '' ), $k = $k.charAt( 0 ).toUpperCase() + $k.substring( 1, $k.length ),
				dk[ $k ] ? dk.err( 'dk.cls에 이미 ' + $k + '값이 존재합니다' ) : dk[ $k ] = $v;
		},
		dk.stt = function( $k, $v ){
			$k = $k.replace( trim, '' ).toUpperCase(),
				dk[ $k ] ? dk.err( 'dk.stt에 이미 ' + $k + '값이 존재합니다' ) : dk[ $k ] = $v;
		},

// INFO :
		dk.stt( 'INFO', { name : 'Dk garnet', version : 'v0.4.1', github : 'https://github.com/ssw3131/garnet.git' } ),

// ERROR :
		dk.fn( 'err', function( $log ){ log( 'dk error : ' + $log ); } ),

// BOM :
		dk.stt( 'W', W ),
		dk.stt( 'DOC', DOC ),
		dk.stt( 'HEAD', DOC.getElementsByTagName( 'head' )[ 0 ] );
})();
// DETECTOR :
;
dk.stt( 'DETECTOR', (function( $w, $doc ){
	var navi = $w.navigator, agent = navi.userAgent.toLowerCase(), platform = navi.platform.toLowerCase(), app = navi.appVersion.toLowerCase(),
		device = 'pc', os, osv, browser, bv, flash,
		prefixCss, prefixStyle, transform3D, keyframe = $w[ 'CSSRule' ],
		docMode = 0,
		d = $doc.createElement( 'div' ), s = d.style, c = $doc.createElement( 'canvas' ), a = $doc.createElement( 'audio' ), v = $doc.createElement( 'video' ), t0,
		edge, ie, chrome, firefox, safari, opera, naver;

	edge = function(){
		if( agent.indexOf( 'edge' ) < 0 ) return;
		if( agent.indexOf( 'Windows Phone' ) > -1 ) os = 'winMobile';
		return browser = 'edge', bv = 'edge'; // todo
	},
		ie = function(){
			if( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
			if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
			return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[ 1 ] );
		},
		chrome = function(){
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			if( agent.indexOf( t0 = 'chrome' ) < 0 && agent.indexOf( t0 = 'crios' ) < 0 ) return;
			return browser = 'chrome', bv = parseFloat( ( t0 == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[ 1 ] );
		},
		firefox = function(){
			return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		safari = function(){
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		opera = function(){
			var i;
			return ( agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		naver = function(){
			return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver';
		};

	// os, browser
	if( agent.indexOf( 'android' ) > -1 ){
		browser = os = 'android';
		if( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
		else device = 'mobile';
		if( t0 = /android ([\d.]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	}else if( agent.indexOf( t0 = 'ipad' ) > -1 || agent.indexOf( t0 = 'iphone' ) > -1 ){
		device = t0 == 'ipad' ? 'tablet' : 'mobile', browser = os = t0;
		if( t0 = /os ([\d_]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '_' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	}else{
		if( platform.indexOf( 'win' ) > -1 ){
			os = 'win', t0 = 'windows nt ';
			if( agent.indexOf( t0 + '5.1' ) > -1 ) osv = 'xp';
			else if( agent.indexOf( t0 + '6.0' ) > -1 ) osv = 'vista';
			else if( agent.indexOf( t0 + '6.1' ) > -1 ) osv = '7';
			else if( agent.indexOf( t0 + '6.2' ) > -1 ) osv = '8';
			else if( agent.indexOf( t0 + '6.3' ) > -1 ) osv = '8.1';
			else if( agent.indexOf( t0 + '10.0' ) > -1 ) osv = '10';
			edge() || ie() || chrome() || firefox() || safari() || opera();
		}else if( platform.indexOf( 'mac' ) > -1 ){
			os = 'mac', t0 = /os x ([\d._]+)/.exec( agent )[ 1 ].replace( '_', '.' ).split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ),
			safari() || chrome() || firefox() || opera();
		}else{
			os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0, chrome() || firefox();
		}
	}
	// flash
	(function(){
		var plug = navi.plugins, t0;
		if( browser == 'ie' ) try{ t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' ).GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ); }catch( e ){}
		else if( ( t0 = plug[ 'Shockwave Flash 2.0' ] ) || ( t0 = plug[ 'Shockwave Flash' ] ) ) t0 = t0.description.split( ' ' )[ 2 ].split( '.' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else if( agent.indexOf( 'webtv' ) > -1 ) flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf( 'webtv/2.5' ) > -1 ? 3 : 2;
	})();
	// dom
	switch( browser ){
		case'ie':
			if( bv == -1 ) bv = !c[ 'getContext' ] ? 8 : !( 'msTransition' in s ) && !( 'transition' in s ) ? 9 : c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' ) ? 11 : 10;
			prefixCss = '-ms-', prefixStyle = 'ms', transform3D = bv > 9 ? true : false, docMode = $doc[ 'documentMode' ] || 0;
			break;
		case'firefox':
			prefixCss = '-moz-', prefixStyle = 'Moz', transform3D = true;
			break;
		case'opera':
			prefixCss = '-o-', prefixStyle = 'O', transform3D = true;
			break;
		default:
			prefixCss = '-webkit-', prefixStyle = 'webkit', transform3D = os == 'android' ? ( osv < 4 ? false : true ) : true;
	}
	if( keyframe ){
		if( keyframe.WEBKIT_KEYFRAME_RULE ) keyframe = '-webkit-keyframes';
		else if( keyframe.MOZ_KEYFRAME_RULE ) keyframe = '-moz-keyframes';
		else if( keyframe.KEYFRAME_RULE ) keyframe = 'keyframes';
		else keyframe = null;
	}

	return {
		device : device,
		os : os,
		osVer : osv,
		browser : browser,
		browserVer : bv,
		ie8 : browser == 'ie' && bv < 9 ? true : false,
		mobile : device == 'pc' ? false : true,
		flash : flash,
		prefixCss : prefixCss,
		prefixStyle : prefixStyle,
		transform3D : transform3D,
		transform : ( prefixStyle + 'Transform' in s || 'transform' in s ) ? true : false,
		transition : ( prefixStyle + 'Transition' in s || 'transition' in s ) ? true : false,
		keyframe : keyframe,
		float : 'cssFloat' in s ? 'cssFloat' : 'styleFloat',
		canvas : c ? true : false,
		canvasText : c && c[ 'getContext' ] && c.getContext( '2d' ).fillText ? true : false,
		audio : a ? true : false,
		video : v ? true : false,
		videoPoster : v && 'poster' in v ? true : false,
		videoWebm : v && v[ 'canPlayType' ] && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoH264 : v && v[ 'canPlayType' ] && v.canPlayType( 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoTeora : v && v[ 'canPlayType' ] && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? true : false,
		insertBefore : 'insertBefore' in d ? true : false,
		innerText : 'innerText' in d ? true : false,
		textContent : 'textContent' in d ? true : false,
		touchBool : 'ontouchstart' in $w ? true : false,
		currentTarget : browser == 'firefox' ? 'target' : 'srcElement',
		wheelEvent : browser == 'firefox' ? 'DOMMouseScroll' : 'mousewheel',
		isLocalhost : location.host.indexOf( 'localhost' ) < 0 ? false : true
	}
})( dk.W, dk.DOC ) );
// UTIL :
;
dk.fn( 'random', (function( $mathRandom ){
	return function( $max, $min ){ return $max = $max || 1, $min = $min || 0, ( $max - $min ) * $mathRandom() + $min; }
})( Math.random ) ),

	dk.fn( 'randomInt', (function( $mathRandom ){
		return function( $max, $min ){ return $min = $min || 0, parseInt( ( $max - $min + 0.99999 ) * $mathRandom() + $min ); }
	})( Math.random ) ),

	dk.fn( 'randomColor', (function( $randomInt ){
		return function(){ return 'rgb(' + $randomInt( 256 ) + ', ' + $randomInt( 256 ) + ', ' + $randomInt( 256 ) + ')'; }
	})( dk.randomInt ) ),

	dk.fn( 'timeCheck', (function( $dateNow ){
		var t0, r;
		return function(){ return t0 ? ( r = $dateNow() - t0, t0 = null, r ) : ( t0 = $dateNow(), null ); }
	})( Date.now ) );
;
// SELECTOR : bsSelector v0.3.2, 141110
dk.fn( 'selector', (function( $doc ){
	/* bsSelector v0.3.2
	 * Copyright (c) 2014 by ProjectBS Committe and contributors.
	 * http://www.bsplugin.com All rights reserved.
	 * Licensed under the BSD license. See http://opensource.org/licenses/BSD-3-Clause
	 */
	var bsSelector = function( doc, trim, domData ){
		'use strict';
		var subTokens = {},
			subTokener = function( sels ){
				var i, j, k, m, n, sel, token, t0, t1, v, skip, mT0;
				m = sels.length,
					mT0 = { '~' : 1, '|' : 1, '!' : 1, '^' : 1, '$' : 1, '*' : 1 },
					skip = {
						'target' : 1, 'active' : 1, 'visited' : 1, 'first-line' : 1, 'first-letter' : 1, 'hover' : 1, 'focus' : 1, 'after' : 1, 'before' : 1, 'selection' : 1,
						'eq' : 1, 'gt' : 1, 'lt' : 1,
						'valid' : 1, 'invalid' : 1, 'optional' : 1, 'in-range' : 1, 'out-of-range' : 1, 'read-only' : 1, 'read-write' : 1, 'required' : 1
					};
				while( m-- ){//,
					sel = sels[ m ], j = sel.length;
					while( j-- ){
						token = sel[ j ], k = token.charAt( 0 );
						if( k == '[' ){
							subTokens[ token ] = [];
							if( ( i = token.indexOf( '=' ) ) == -1 ) subTokens[ token ].push( token.substr( 1 ) );
							else
								subTokens[ token ].push( token.substring( 1, i - ( mT0[ t1 = token.charAt( i - 1 ) ] ? 1 : 0 ) ) ),
									subTokens[ token ].push( t1 ),
									subTokens[ token ].push( token.substr( i + 1 ) );
						}else if( k == ':' ){
							subTokens[ token ] = [],
								k = token.substr( 1 ), i = k.indexOf( '(' ), v = i > -1 ? isNaN( t0 = k.substr( i + 1 ) ) ? t0.replace( trim, '' ) : parseFloat( t0 ) : null;
							if( v ) k = k.substring( 0, i );
							if( !skip[ k ] )
								subTokens[ token ].push( k ), subTokens[ token ].push( v );
						}
					}
				}
			},
			compare = {
				// id
				'#' : function( el, token ){
					return token.substr( 1 ) == el.id;
				},
				// class
				'.' : function( el, token ){
					var t0, k;
					return !( t0 = el.className ) ? 0 : ( k = token.substr( 1 ), t0.indexOf( ' ' ) > -1 ? k == t0 : t0.split( ' ' ).indexOf( k ) > -1 );
				},
				// Attribute
				'[' : function( el, token ){
					var t0, k, v, s, t2;
					t2 = subTokens[ token ], k = t2[ 0 ], s = t2[ 1 ], v = t2[ 2 ];
					if( !s ) return el.getAttribute( k ) === null ? 0 : 1;
					if( ( t0 = el.getAttribute( k ) ) === null ) return;
					switch( s ){
						case'~':
							return t0.split( ' ' ).indexOf( v ) > -1;
						case'|':
							return t0.split( '-' ).indexOf( v ) > -1;
						case'^':
							return t0.indexOf( v ) == 0;
						case'$':
							return t0.lastIndexOf( v ) == ( t0.length - v.length );
						case'*':
							return t0.indexOf( v ) > -1;
						case'!':
							return t0 !== v;
						default:
							return t0 === v;
					}
				},
				// pseudo
				':' : (function( domData ){
					var mTag = { 'first-of-type' : 1, 'last-of-type' : 1, 'only-of-type' : 1 },
						nChild = { 'first-child' : 'firstElementChild', 'last-child' : 'lastElementChild' },
						enabled = { INPUT : 1, BUTTON : 1, SELECT : 1, OPTION : 1, TEXTAREA : 1 },
						checked = { INPUT : 1, radio : 1, checkbox : 1, OPTION : 2 };
					return function filters( el, token ){
						var parent, childs, tag, dir, t0, t1, t2, k, v, i, j, m, dd, tname, ename, lname;
						t0 = subTokens[ token ], k = t0[ 0 ], v = t0[ 1 ];
						if( !k ) return;
						switch( k ){
							case'link':
								return el.tagName == 'A' && el.getAttribute( 'href' );
							case'root':
								return el.tagName == 'HTML';
							case'lang':
								return el.getAttribute( 'lang' ) == v;
							case'empty':
								return el.nodeType == 1 && !el.nodeValue && !el.childNodes.length;
							case'checked':
								return t0 = checked[ el.tagName ], ( t0 == 1 && el.checked && checked[ el.getAttribute( 'type' ) ] ) || ( t0 == 2 && el.selected );
							case'enabled':
								return enabled[ el.tagName ] && ( ( t0 = el.getAttribute( 'disabled' ) ) == null || t0 == '' );
							case'disabled':
								return enabled[ el.tagName ] && ( ( t0 = el.getAttribute( 'disabled' ) ) != null && t0 != '' );
							case'contains':
								return ( el.innerText || el.textContent || '' ).indexOf( v ) > -1;
							case'not':
								switch( v.charAt( 0 ) ){
									case'#':
										return v.substr( 1 ) != el.id;
									case'.':
										return !( !( t0 = el.className ) ? 0 : ( t1 = v.substr( 1 ), t0.indexOf( ' ' ) < 0 ? t1 == t0 : t0.split( ' ' ).indexOf( t1 ) > -1 ) );
									default:
										return v != el.tagName && v != '*';
								}
								return 0;
							case'first-child':
							case'first-of-type':
								dir = 1;
							case'last-child':
							case'last-of-type':
								if( isElCld && ( t1 = nChild[ k ] ) ) return el.parentNode[ t1 ] == el;
								dd = domData( parent = el.parentNode ), tag = el.tagName;
								(t1 = mTag[ k ]) ? dir ? ( tname = 'DQseqFCT' + tag, ename = 'DQFCTEl' + tag ) : ( tname = 'DQseqLCT' + tag, ename = 'DQLCTEl' + tag ) :
									dir ? ( tname = 'DQseqFC', ename = 'DQFCEl' ) : ( tname = 'DQseqLC', ename = 'DQLCEl' );
								if( !dd[ tname ] || dd[ tname ] != bsRseq ){
									if( ( childs = isElCld ? parent.children : parent.childNodes ) && ( i = j = childs.length ) ){
										m = 0;
										while( i-- ){
											t0 = childs[ dir ? j - i - 1 : i ];
											if( ( isElCld ? 1 : t0.nodeType == 1 ) && ( t1 ? tag == t0.tagName : 1 ) && !m++ ){
												dd[ tname ] = bsRseq,
													dd[ ename ] = t0;
												break;
											}
										}
									}
								}
								return dd[ ename ] == el;
							case'only-of-type':
							case'only-child':
								if( isElCld && k == 'only-child' ) return el.parentNode.children.length == 1;
								dd = domData( parent = el.parentNode ),
									t1 = mTag[ k ], tag = el.tagName;
								k == 'only-of-type' ? ( tname = 'DQseqOT' + tag, lname = 'DQTChElLen' + tag ) : ( tname = 'DQseqOCH', lname = 'DQChElLen' );
								if( !dd[ tname ] || dd[ tname ] != bsRseq ){
									if( ( childs = isElCld ? parent.children : parent.childNodes ) && ( i = childs.length ) ){
										m = 0;
										while( i-- ){
											t0 = childs[ i ];
											if( ( isElCld ? 1 : t0.nodeType == 1 ) && ( t1 ? tag == t0.tagName : 1 ) && !m++ );
										}
										dd[ tname ] = bsRseq,
											dd[ lname ] = m;
									}
								}
								return dd[ lname ] == 1;
							default:
								if( !( parent = el.parentNode ) || parent.tagName == 'HTML' || !( childs = isElCld ? parent.children : parent.childNodes ) || !( j = i = childs.length ) )
									return;
								if( v == 'n' ) return 1;
								t1 = 1, dd = domData( el );
								switch( k ){
									case'nth-child':
										if( !dd.DQseq || dd.DQseq != bsRseq ){
											for( i = 0; i < j; i++ ){
												t0 = childs[ i ];
												if( isElCld ? 1 : t0.nodeType == 1 ){
													( t2 = domData( t0 ) ).DQseq = bsRseq,
														t2.DQindex = t1++;
												}
											}
										}
										return t0 = dd.DQindex, v == 'even' || v == '2n' ? t0 % 2 == 0 :
											v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
											t0 == v;
									case'nth-last-child':
										if( !dd.DQseqL || dd.DQseqL != bsRseq ){
											while( i-- ){
												t0 = childs[ i ];
												if( isElCld ? 1 : t0.nodeType == 1 ){
													( t2 = domData( t0 ) ).DQseqL = bsRseq,
														t2.DQindexL = t1++;
												}
											}
										}
										return t0 = dd.DQindexL, v == 'even' || v == '2n' ? t0 % 2 == 0 :
											v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
											t0 == v;
									case'nth-of-type':
										tag = el.tagName, tname = 'DQseqT' + tag, lname = 'DQindexT' + tag;
										if( !dd[ tname ] || dd[ tname ] != bsRseq ){
											for( i = 0; i < j; i++ ){
												t0 = childs[ i ];
												if( ( isElCld ? 1 : t0.nodeType == 1 ) && t0.tagName == tag ){
													( t2 = domData( t0 ) )[ tname ] = bsRseq,
														t2[ lname ] = t1++;
												}
											}
										}
										return t0 = dd[ lname ], v == 'even' || v == '2n' ? t0 % 2 == 0 :
											v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
											t0 == v;
									case'nth-last-of-type':
										tag = el.tagName, tname = 'DQseqTL' + tag, lname = 'DQindexTL' + tag;
										if( !dd[ tname ] || dd[ tname ] != bsRseq ){
											while( i-- ){
												t0 = childs[ i ];
												if( ( isElCld ? 1 : t0.nodeType == 1 ) && t0.tagName == tag ){
													( t2 = domData( t0 ) )[ tname ] = bsRseq,
														t2[ lname ] = t1++;
												}
											}
										}
										return t0 = dd[ lname ], v == 'even' || v == '2n' ? t0 % 2 == 0 :
											v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
											t0 == v;
								}
						}//
					};
				})( domData || (function(){
						var id = 1, data = {};
						return function domData( el, k, v ){
							var t0;
							if( !( t0 = el[ 'data-bs' ] ) ) el[ 'data-bs' ] = t0 = id++, data[ t0 ] = {};
							return k == undefined ? data[ t0 ] : v == undefined ? data[ t0 ][ k ] : v === null ? delete data[ t0 ][ k ] : ( data[ t0 ][ k ] = v );
						};
					})() )
			},
			rTag = /^[a-z]+[0-9]*$/i, rAlpha = /[a-z]/i, rClsTagId = /^[.#]?[a-z0-9]+$/i,
			DOC = document, tagName = {}, clsName = {},
			getById = (function( tagName ){
				var r = [];
				return DOC[ 'getElementById' ] ? function( id ){
					var t0;
					return r.length = 0, (t0 = DOC.getElementById( id )) ? (r[ 0 ] = t0, r) : r;
				} : function( id ){
					var t0 = tagName[ '*' ] || ( tagName[ '*' ] = DOC.getElementsByTagName( '*' ) ), t1, i = 0, j = t0.length;
					r.length = 0;
					while( i < j ){
						if( id == t0[ i ].id ){
							r[ 0 ] = t0[ i ];
							break;
						}
						i++;
					}
					return r;
				};
			})( tagName ),
			className = (function( tagName, clsName ){
				var r = [];
				return DOC[ 'getElementsByClassName' ] ? function( cls ){return clsName[ cls ] || ( clsName[ cls ] = DOC.getElementsByClassName( cls ) );} :
					function( cls ){
						var t0 = tagName[ '*' ] || ( tagName[ '*' ] = DOC.getElementsByTagName( '*' ) ), t1, i = t0.length;
						r.length = 0;
						while( i-- ) if( cls == ( t1 = t0[ i ].className ) || t1.indexOf( cls + ' ' ) > -1 || t1.indexOf( ' ' + cls ) > -1 ) r[ r.length ] = t0[ i ];
						return r;
					};
			})( tagName, clsName ),
			bsRseq = 0,
			navi,
			chrome = ( navi = window[ 'navigator' ].userAgent.toLowerCase() ).indexOf( 'chrome' ) > -1 || navi.indexOf( 'crios' ) ? 1 : 0,
			mQSA = { ' ' : 1, '+' : 1, '~' : 1, ':' : 1, '[' : 1 },
			mParent = { ' ' : 1, '>' : 1 }, mBracket = { '[' : 1, '(' : 1, ']' : 2, ')' : 2 },
			mEx = { ' ' : 1, '*' : 1, ']' : 1, '>' : 1, '+' : 1, '~' : 1, '^' : 1, '$' : 1 },
			mT0 = { ' ' : 1, '*' : 2, '>' : 2, '+' : 2, '~' : 2, '#' : 3, '.' : 3, ':' : 3, '[' : 3 }, mT1 = { '>' : 1, '+' : 1, '~' : 1 },
			R = [], arrs = { _l : 0 },
			aPsibl = [ 'previousSibling', 'previousElementSibling' ],
			tEl = DOC.createElement( 'ul' ), isElCld, isQSA;
		if( !Array.prototype.indexOf ) Array.prototype.indexOf = function( v, I ){
			var i, j, k, l;
			if( j = this.length ) for( I = I || 0, i = I, k = parseInt( ( j - i ) * .5 ) + i + 1, j--; i < k; i++ ) if( this[ l = i ] === v || this[ l = j - i + I ] === v ) return l;
			return -1;
		};
		tEl.innerHTML = '<li>1</li>',
			isElCld = tEl[ 'firstElementChild' ] && tEl[ 'lastElementChild' ] && tEl[ 'children' ] ? 1 : 0,
			isQSA = isElCld && DOC[ 'querySelectorAll' ] ? 1 : 0;
		return function selector( query, doc, r ){
			var sels, sel,
				hasParent, hasQSAErr, hasQS,
				t0, t1, t2, t3, i, j, k, l, m, n,
				el, els, hit, token, tokens, isFilter;

			if( !r ) r = R;
			i = query.indexOf( ',' );
			if( doc && 'length' in doc ) isFilter = 1;
			else{
				isFilter = 0, doc ? ( DOC = doc ) : ( doc = DOC );
				if( rClsTagId.test( query ) ) switch( query.charAt( 0 ) ){
					case'#':
						return getById( query.substr( 1 ) );
					case'.':
						return className( query.substr( 1 ) );
					default:
						return tagName[ query ] || ( tagName[ query ] = doc.getElementsByTagName( query ) );
				}
				if( chrome && isQSA && query.indexOf( ':contains' ) < 0 && query.indexOf( '!' ) < 0 ) return doc.querySelectorAll( query );
				if( isQSA && i > -1 && query.indexOf( '!' ) < 0 ) return doc.querySelectorAll( query );
			}
			if( i == -1 ) sels = arrs._l ? arrs[ --arrs._l ] : [], sels[ 0 ] = query, i = 1;
			else sels = query.split( ',' ), i = sels.length;
			while( i-- ){
				t0 = arrs._l ? arrs[ --arrs._l ] : [], t1 = '', sel = sels[ i ].replace( trim, '' ), m = 0, j = sel.length;
				while( j-- ){
					k = sel.charAt( j );
					if( hasParent || mParent[ k ] ) hasParent = 1;
					if( m == 2 && k == '!' ) hasQSAErr = 1;
					if( ( t2 = mBracket[ k ] ) && ( m = t2 ) == 2 ) continue;
					if( !( t2 = mEx[ k ] ) ) t1 = k + t1;
					if( t2 && m == 2 ) t1 = k + t1;
					else if( ( t2 = mT0[ k ] ) == 1 ){
						if( ( t3 = t0[ t0.length - 1 ] ) == ' ' ) continue;
						if( t1 ) t0[ t0.length ] = t1, t1 = '';
						if( !mT1[ t3 ] ) t0[ t0.length ] = k;
					}else if( t2 == 2 ){
						if( t1.replace( trim, '' ) ) t0[ t0.length ] = t1, t1 = '';
						if( t0[ t0.length - 1 ] == ' ' ) t0.pop();
						t0[ t0.length ] = k;
					}else if( t2 == 3 || !j ){
						if( t1 && m < 2 ) t0[ t0.length ] = t1, t1 = '';
					}else if( sel.charAt( j - 1 ) == ' ' ) t0[ t0.length ] = t1, t1 = '';
				}
				j = t0.length;
				while( j-- ){
					if( rTag.test( t0[ j ] ) ) t0[ j ] = t0[ j ].toUpperCase();
					else if( t0[ j ].charAt( 0 ) == ':' ){
						if( !( t1 = t0[ j ] ).indexOf( ':contains(' ) ){
							hasQSAErr = 1;
							continue;
						}else{
							t0[ j ] = t1;
							if( ( t1 == ':nth-child(n' || t1 == ':nth-last-child(n' ) && t0.length != 1 ){
								hasQSAErr = 1, t0.splice( j, 1 );
								continue;
							}
						}
					}
					if( isQSA && !hasQS && !mQSA[ t0[ j ].charAt( 0 ) ] ) hasQS = 1;
				}
				sels[ i ] = t0;
			}
			if( !isFilter ){
				if( hasQSAErr ) hasQS = 0;
				if( sels.length == 1 ){
					t0 = sels[ 0 ][ 0 ];
					if( ( k = t0.charAt( 0 ) ) == '#' ) els = getById( t0.substr( 1 ) ), sels[ 0 ].shift();
					else if( k == '.' ){
						els = className( t0.substr( 1 ) ), sels[ 0 ].shift();
						if( hasQS && els.length > 100 ) return doc.querySelectorAll( query );
					}else if( k == '[' || k == ':' ){
						if( hasQS ) return doc.querySelectorAll( query );
						if( !hasParent ){
							t0 = sels[ 0 ][ sels[ 0 ].length - 1 ], k = t0.charAt( 0 );
							if( k == '#' ) sels[ 0 ].pop(), els = getById( t0.substr( 1 ) );
							else if( k == '.' ) sels[ 0 ].pop(), els = className( t0.substr( 1 ) );
							else if( rTag.test( t0 ) ) sels[ 0 ].pop(), els = tagName[ t0 ] || ( tagName[ t0 ] = doc.getElementsByTagName( t0 ) );
						}
					}else if( rTag.test( t0 ) ){
						sels[ 0 ].shift(), els = tagName[ t0 ] || ( tagName[ t0 ] = doc.getElementsByTagName( t0 ) );
						if( hasQS && els.length > 100 ) return doc.querySelectorAll( query );
					}
				}
				if( !els ) els = tagName[ '*' ] || ( tagName[ '*' ] = doc.getElementsByTagName( '*' ) );
				if( !sels[ 0 ].length ) return arrs[ arrs._l++ ] = sels[ 0 ], sels.length = 0, arrs[ arrs._l++ ] = sels, els;
				r.length = 0;
			}else els = doc, doc = DOC, r = [];
			bsRseq++, subTokener( sels );
			for( i = 0, j = els.length; i < j; i++ ){
				l = sels.length;
				while( l-- ){
					el = els[ i ];
					for( tokens = sels[ l ], m = 0, n = tokens.length; m < n; m++ ){
						token = tokens[ m ], hit = 0;
						if( ( k = token.charAt( 0 ) ) == ' ' ){
							m++;
							while( el = el.parentNode )
								if( hit = ( ( t0 = compare[ tokens[ m ].charAt( 0 ) ] ) ? t0( el, tokens[ m ] ) : ( tokens[ m ] == el.tagName || tokens[ m ] == '*' ) ) ) break;
						}else if( k == '>' )
							hit = ( ( t0 = compare[ tokens[ ++m ].charAt( 0 ) ] ) ? t0( el = el.parentNode, tokens[ m ] ) :
								( tokens[ m ] == ( el = el.parentNode ).tagName || tokens[ m ] == '*' ) );
						else if( k == '+' ){
							while( el = el[ aPsibl[ isElCld ] ] ) if( ( isElCld ? 1 : el.nodeType == 1 ) ) break;
							hit = el && ( ( t0 = compare[ tokens[ ++m ].charAt( 0 ) ] ) ? t0( el, tokens[ m ] ) : ( tokens[ m ] == el.tagName || tokens[ m ] == '*' ) );
						}else if( k == '~' ){
							m++;
							while( el = el[ aPsibl[ isElCld ] ] ){
								if( ( isElCld ? 1 : el.nodeType == 1 ) && ( ( t0 = compare[ tokens[ m ].charAt( 0 ) ] ) ? t0( el, tokens[ m ] ) : ( tokens[ m ] == el.tagName || tokens[ m ] == '*' ) ) ){
									hit = 1;
									break;
								}
							}
						}else hit = ( ( t0 = compare[ token.charAt( 0 ) ] ) ? t0( el, token ) : ( token == el.tagName || token == '*' ) );
						if( !hit ) break;
					}
					if( i == j - 1 ) tokens.length = 0, arrs[ arrs._l++ ] = tokens;
					if( hit ) break;
				}
				if( i == j - 1 ) sels.length = 0, arrs[ arrs._l++ ] = sels;
				if( hit ) r[ r.length ] = els[ i ];
			}
			return r;
		};
	};
	return bsSelector( $doc, /^\s*|\s*$/g );
})( dk.DOC ) );
;
// EVENT :
dk.fn( 'dkEvent', (function( $detector ){
	var t0 = $detector.currentTarget;
	return function( $e ){
		return {
			nativeEvent : $e,
			nativeTarget : $e[ t0 ]
		}
	}
})( dk.DETECTOR ) ),

	(function( $w, $detector ){
		var map = { over : 'mouseover', out : 'mouseout', down : 'mousedown', move : 'mousemove', up : 'mouseup', enter : 'mouseenter', leave : 'mouseleave' };
		$detector.touchBool ? ( map.down = 'touchstart', map.move = 'touchmove', map.up = 'touchend' ) : null,
			dk.fn( 'addEvent', (function(){
				return $w.addEventListener ? function( $el, $et, $cb, $cap ){
					$et = map[ $et ] ? map[ $et ] : $et, $el.addEventListener( $et, $cb, $cap );
				} : function( $el, $et, $cb ){
					$et = map[ $et ] ? map[ $et ] : $et, $el.attachEvent( 'on' + $et, $cb ); // ie8 이하 capture 불가능
				}
			})() ),
			dk.fn( 'delEvent', (function(){
				return $w.removeEventListener ? function( $el, $et, $cb, $cap ){
					$et = map[ $et ] ? map[ $et ] : $et, $el.removeEventListener( $et, $cb, $cap );
				} : function( $el, $et, $cb ){
					$et = map[ $et ] ? map[ $et ] : $et, $el.detachEvent( 'on' + $et, $cb ); // ie8 이하 capture 불가능
				}
			})() )
	})( dk.W, dk.DETECTOR );
;
// PROTOTYPE :
dk.stt( 'PROTO', {
	connect : function( $fn/* , $obj, $obj */ ){
		var i = arguments.length, k, param = [];
		while( i-- > 1 ){
			for( k in arguments[ i ] ) param.push( k ), param.push( arguments[ i ][ k ] );
		}
		$fn.apply( undefined, param );
	},
	attr : (function(){
		var trim = /^\s*|\s*$/g;
		return {
			'@addClass' : function( $v ){
				var e = this.el, r, check = new RegExp( '(\\s|^)' + $v + '(\\s|$)' );
				r = e.getAttribute( 'class' ), r = r ? r.replace( check, ' ' ).replace( trim, '' ) + ' ' + $v : $v,
					e.setAttribute( 'class', r.replace( trim, '' ) );
			},
			'@delClass' : function( $v ){
				var e = this.el, r, check = new RegExp( '(\\s|^)' + $v + '(\\s|$)' );
				r = e.getAttribute( 'class' ), r ? e.setAttribute( 'class', r.replace( check, ' ' ).replace( trim, '' ) ) : null;
			},
			scrollLeft : function( $v ){
				var e = this.el;
				if( $v === undefined ) return e[ 'scrollLeft' ];
				else e[ 'scrollLeft' ] = $v;
			},
			scrollTop : function( $v ){
				var e = this.el;
				if( $v === undefined ) return e[ 'scrollTop' ];
				else e[ 'scrollTop' ] = $v;
			}
		}
	})(),
	css : (function( $detector ){
		var prefixCss = $detector.prefixCss, dtFloat = $detector.float, t0 = $detector.ie8;
		return {
			bgColor : t0 ? function( $v ){
				var s = this.style, t0;
				if( $v === undefined ) return s[ 'backgroundColor' ];
				else $v.indexOf( 'rgba' ) >= 0 ? ( t0 = $v.replace( 'rgba', 'rgb' ).split( ',' ), t0.pop(), $v = t0.join( ',' ) + ')' ) : null, s[ 'backgroundColor' ] = $v;
			} : function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ 'backgroundColor' ];
				else s[ 'backgroundColor' ] = $v;
			},
			bgImg : function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ 'backgroundImage' ];
				else s[ 'backgroundImage' ] = 'url(' + $v + ')';
			},
			float : function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ dtFloat ];
				else s[ dtFloat ] = $v;
			},
			fontSmoothing : function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ 'font-smoothing' ];
				else s[ 'font-smoothing' ] = $v, s[ prefixCss + 'font-smoothing' ] = $v;
			},
			opacity : t0 ? function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ 'opacity' ];
				else s[ 'opacity' ] = $v, s[ 'filter' ] = 'alpha(opacity=' + ( $v * 100 ) + ')';
			} : function( $v ){
				var s = this.style;
				if( $v === undefined ) return s[ 'opacity' ];
				else s[ 'opacity' ] = $v;
			}
		}
	})( dk.DETECTOR ),
	tree : (function( $doc, $detector ){
		var text = $detector.innerText ? 'innerText' : 'textContent';
		return {
			'>' : function( $v ){ this.el.appendChild( $v.list[ 0 ].el ); },
			'<' : function( $v ){ $v === 'body' ? $doc.body.appendChild( this.el ) : $v.list[ 0 ].el.appendChild( this.el ); },
			'>-' : function( $v ){ this.el.removeChild( $v.list[ 0 ].el ); },
			'<-' : function( $v ){ $v === 'body' ? $doc.body.removeChild( this.el ) : $v.list[ 0 ].el.removeChild( this.el ); },
			'html' : function( $v ){ return ( $v === undefined ) ? this.el.innerHTML : this.el.innerHTML = $v; },
			'+html' : function( $v ){ return this.el.innerHTML = $v + this.el.innerHTML; },
			'html+' : function( $v ){ return this.el.innerHTML = this.el.innerHTML + $v; },
			'text' : function( $v ){ return $v === undefined ? this.el[ text ] : this.el[ text ] = $v; },
			'+text' : function( $v ){ return this.el[ text ] = $v + this.el[ text ]; },
			'text+' : function( $v ){ return this.el[ text ] = this.el[ text ] + $v; }
		}
	})( dk.DOC, dk.DETECTOR ),
	event : (function( $w, $dkEvent, $addEvent, $delEvent ){
		var r = {}, evList = [ 'over', 'out', 'down', 'move', 'up', 'click', 'enter', 'leave', 'contextmenu', 'dblclick' ], i = evList.length,
			cancleMap = { mousedown : 1, mouseup : 1, mousemove : 1 }, t0,
			cancelBubbling, makeListener, make;

		cancelBubbling = function( $e ){
			cancelBubbling = $e.stopPropagation ? function( $e ){ $e.stopPropagation(); } : $w.event ? function(){ $w.event.cancelBubble = true; } : null, cancelBubbling( $e );
		},
			makeListener = function( $k, $dom, $cb ){
				return $dom.eventList[ $k ] = function( $e ){
					var ev = $dkEvent( $e ), type = $e.type;
					cancleMap[ type ] ? null : cancelBubbling( $e ), ev.type = type, ev.target = $dom, $cb( ev );
				}
			},
			make = function( $k ){
				return function( $v ){
					var el = this.el;
					$v ? $addEvent( el, $k, makeListener( $k, this, $v ) ) : ( $delEvent( el, $k, this.eventList[ $k ] ), delete this.eventList[ $k ] );
				}
			};

		while( i-- ) r[ t0 = evList[ i ] ] = make( t0 );
		return r;
	})( dk.W, dk.dkEvent, dk.addEvent, dk.delEvent )
} );
;
// DOM :
dk.cls( 'Dom', (function( $doc, $selector, $detector ){
	var factory, DomList, Dom, uuList = {}, proto = {}, maker = $doc.createElement( 'div' ), destroy, parser;

	DomList = function( $arr ){
		var leng = $arr.length, i = leng;
		this.domList = [], this.elList = [], this.length = leng;
		while( i-- ) this.domList[ i ] = new Dom( $arr[ i ], i ), this.elList[ i ] = this.domList[ i ].el;
		this.dom = this.domList[ 0 ], this.el = this.elList[ 0 ]; // 리스트 첫번째 요소
	},
		DomList.prototype.S = function(){
			var r, i, leng = this.length;
			if( this.length ){
				r = this.dom.S.apply( this.dom, arguments );
				for( i = 1; i < leng; i++ ) this.domList[ i ].S.apply( this.domList[ i ], arguments );
				return r === false ? this : r;
			}else return this;
		},

		Dom = function( $el, $idx ){
			this.el = $el, this.style = $el.style, this.idx = $idx, this.eventList = {};
		},
		Dom.prototype.S = (function(){
			var prefixCss = $detector.prefixCss, nopx = { zIndex : 1, 'z-index' : 1 };
			return function(){
				var i = 0, j = arguments.length, k, v, e = this.el, s = this.style, r, t0;
				while( i < j ){
					k = arguments[ i++ ];
					if( i === j ) return proto[ k ] ? proto[ k ].call( this ) :
						k.indexOf( '@' ) > -1 ? e.getAttribute( k.replace( '@', '' ) ) :
							( r = s[ k ], r.indexOf( '%' ) > -1 ? r : ( t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0 ) );
					else  v = arguments[ i++ ],
						proto[ k ] ? proto[ k ].call( this, v ) :
							k.indexOf( '@' ) > -1 ? e.setAttribute( k.replace( '@', '' ), v ) :
								s[ k ] = s[ prefixCss + k ] = typeof v === 'number' ? nopx[ k ] ? v : v + 'px' : v
				}
				return false;
			}
		})(),

		destroy = function( $k ){
			dk.Dom( $k ).S( 'over', null, 'out', null, 'down', null, 'move', null, 'up', null, 'click', null, 'enter', null, 'leave', null, 'contextmenu', null, 'dblclick', null );
			delete uuList[ $k ];
		},

		parser = function( $str ){
			if( $str.indexOf( '>' ) < 0 ) return $doc.createElement( $str.substring( 1, $str.length ) );
			else return ( maker.innerHTML = $str, maker ).firstChild;
		},

		factory = function( $k, $v ){
			if( $v === null ) destroy( $k ); // 캐싱제거
			else if( $k === undefined ) return new DomList( [ $doc.createElement( 'div' ) ] );
			else if( typeof $k === 'string' ){ // 문자열
				if( $k.charAt( 0 ) === '<' ) return new DomList( [ parser( $k ) ] ); // 태그문자
				else return uuList[ $k ] ? uuList[ $k ] : uuList[ $k ] = new DomList( $selector( $k ) ); // 셀렉터, 캐싱
			}else if( $k instanceof Object && $k.length ) return new DomList( $k ); // element 배열
			else if( $k.nodeType === 1 ) return new DomList( [ $k ] )
			else return null;
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
})( dk.DOC, dk.selector, dk.DETECTOR ) ),
	dk.PROTO.connect( dk.Dom.fn, dk.PROTO.attr, dk.PROTO.css, dk.PROTO.tree, dk.PROTO.event );
;
// CSS :
dk.cls( 'Css', (function( $doc, $head, $detector ){
	var factory, Css, uuList = {}, proto = {}, el, sheet, rules;
	el = $doc.createElement( 'style' ), $head.appendChild( el ), sheet = el.sheet || el.styleSheet, rules = sheet.cssRules || sheet.rules,

		Css = sheet.insertRule ? function( $key ){
			this.sheet = sheet, this.rules = rules, this.cssId = rules.length, sheet.insertRule( $key + '{}', this.cssId );
		} : sheet.addRule ? function( $key ){
			this.sheet = sheet, this.rules = rules, this.cssId = rules.length, sheet.addRule( $key, ' ', this.cssId );
		} : function( $key ){
			dk.err( 'sheet에 rule을 추가할 수 없습니다.' );
		},
		Css.prototype.S = (function(){
			var prefixCss = $detector.prefixCss, nopx = { zIndex : 1, 'z-index' : 1 };
			return function(){
				var i = 0, j = arguments.length, k, v, s = this.rules[ this.cssId ].style, r, t0;
				while( i < j ){
					k = arguments[ i++ ];
					if( i == j ) return proto[ k ] ? proto[ k ].call( { style : s } ) :
						( r = s[ k ], r.indexOf( '%' ) > -1 ? r : ( t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0 ) );
					else  v = arguments[ i++ ],
						proto[ k ] ? proto[ k ].call( { style : s }, v ) :
							s[ k ] = s[ prefixCss + k ] = typeof v == 'number' ? nopx[ k ] ? v : v + 'px' : v
				}
				return this;
			}
		})(),

		factory = function( $k ){
			return uuList[ $k ] ? uuList[ $k ] : uuList[ $k ] = new Css( $k );
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
})( dk.DOC, dk.HEAD, dk.DETECTOR ) ),
	dk.PROTO.connect( dk.Css.fn, dk.PROTO.css );
// SList :
;
dk.cls( 'SList', (function(){
	var SList, reset;
	SList = function( $k, $update, $start, $end ){
		this.list = {}, this._list = [], this.name = $k,
			this.update = $update ? function( $param ){
				var t, i, j;
				t = this._list, i = t.length, j = i % 8;
				while( i-- > j ) t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i-- ]( $param ), t[ i ]( $param );
				while( j-- ) t[ j ]( $param );
			} : null,
			this.start = $start, this.end = $end, this.isStart = false;
	},

		reset = function(){
			var k, t0 = this.list, t1 = [];
			for( k in t0 ) t1.push( t0[ k ] );
			this._list = t1;
			//t1.length  ? this.start ? this.start() : null : this.end ? this.end() : null;
			if( this.start && this.end ){
				if( t1.length ) this.isStart ? null : this.start(), this.isStart = true;
				else this.isStart ? this.end() : null, this.isStart = false;
			}
		},

		SList.prototype.S = function(){
			var i = 0, j = arguments.length, k, v;
			while( i < j ){
				k = arguments[ i++ ];
				if( i == j ) return this.list[ k ];
				else v = arguments[ i++ ], v === null ? delete this.list[ k ] : this.list[ k ] ? null : this.list[ k ] = v;
				//else v = arguments[ i++ ], v === null ? delete this.list[ k ] : this.list[ k ] ? dk.err( 'dk.SList에 이미 ' + k + '값이 존재합니다' ) : this.list[ k ] = v;
			}
			reset.call( this );
			return this;
		}
	return function( $k, $update, $start, $end ){
		return new SList( $k, $update, $start, $end );
	}
})() );
// STATIC :
;
dk.stt( 'LOOP', (function( $SList ){
	var r, start, end, loop;
	start = function(){
		loop = function(){
			r[ 'update' ](), requestAnimFrame( loop );
			//r[ 'update' ](), setTimeout( loop, 160 );
		}, loop();
	},
		end = function(){ loop = function(){}; },
		r = $SList( 'LOOP', true, start, end );
	return r;
})( dk.SList ) ),

	dk.stt( 'WIN', (function(){
		return {
			width : 0, height : 0
		}
	})() ),

	dk.stt( 'RESIZE', (function( $w, $doc, $SList, $addEvent, $delEvent, $detector, $dkWIN, $dkEvent ){
		var r, func, t0 = $doc.documentElement, t1 = $detector.ie8 ? t0 : $w, t2 = $w.innerWidth ? 'inner' : 'client';
		func = function( $e ){
			$dkWIN.width = t1[ t2 + 'Width' ], $dkWIN.height = t1[ t2 + 'Height' ], r[ 'update' ]( $dkEvent( $e ) );
		},
			$addEvent( $w, 'resize', func ),
			r = $SList( 'RESIZE', true ),
			r.dispatchEvent = $detector.ie8 ? function(){
				if( t0 ) t0.fireEvent( 'onresize', $doc.createEventObject() );
			} : function(){
				var ev = $doc.createEvent( 'UIEvents' );
				ev.initUIEvent( 'resize', true, false, $w, 0 ), $w.dispatchEvent( ev );
			}
		return r;
	})( dk.W, dk.DOC, dk.SList, dk.addEvent, dk.delEvent, dk.DETECTOR, dk.WIN, dk.dkEvent ) ),

	dk.stt( 'SCROLL', (function( $w, $doc, $SList, $addEvent, $delEvent, $dkEvent ){
		var r, func;
		func = function( $e ){
			r.scrollLeft = $doc.documentElement ? $doc.documentElement.scrollLeft ? $doc.documentElement.scrollLeft : $doc.body ? $doc.body.scrollLeft : 0 : $doc.body ? $doc.body.scrollLeft : 0,
				r.scrollTop = $doc.documentElement ? $doc.documentElement.scrollTop ? $doc.documentElement.scrollTop : $doc.body ? $doc.body.scrollTop : 0 : $doc.body ? $doc.body.scrollTop : 0,
				r[ 'update' ]( $dkEvent( $e ) );
		},
			$addEvent( $w, 'scroll', func ),
			r = $SList( 'SCROLL', true );
		return r;
	})( dk.W, dk.DOC, dk.SList, dk.addEvent, dk.delEvent, dk.dkEvent ) ),

	dk.stt( 'MOUSE', (function( $doc, $SList, $addEvent, $delEvent, $detector, $dkScroll, $dkEvent ){
		var r, cancelBubbling, func, oldX, oldY, startX, startY, press, map = { mousedown : 'down', mousemove : 'move', mouseup : 'up', touchstart : 'down', touchmove : 'move', touchend : 'up' };
		cancelBubbling = function( $e ){
			cancelBubbling = $e.stopPropagation !== undefined ? function( $e ){ $e.stopPropagation(); } : $w.event !== undefined ? function(){ $w.event.cancelBubble = true; } : null, cancelBubbling( $e );
		},
			func = $detector.touchBool ? function( $e ){
				var mouseX = 0, mouseY = 0, evType = $e.type, eTouches = $e.touches, i = eTouches.length, ev = $dkEvent( $e );
				if( i ){
					r.mouseX = mouseX = eTouches[ 0 ].clientX, r.speedX = mouseX - oldX, oldX = mouseX, r.pageX = mouseX + $dkScroll.scrollLeft,
						r.mouseY = mouseY = eTouches[ 0 ].clientY, r.speedY = mouseY - oldY, oldY = mouseY, r.pageY = mouseY + $dkScroll.scrollTop,
						r.touches = eTouches, r.targetTouches = $e.targetTouches, r.changedTouches = $e.changedTouches;
				}
				cancelBubbling( $e ),
					ev.type = map[ evType ] ? map[ evType ] : evType;
				// move
				switch( evType ){
					case'touchstart':
						eTouches.length == 1 ? ( startX = mouseX, startY = mouseY, r.moveX = r.moveY = 0, r.speedX = r.speedY = 0 ) : null;
						break;
					case'touchmove':
						r.moveX = mouseX - startX, r.moveY = mouseY - startY;
						break;
					case'touchend':
						eTouches.length == 0 ? r.moveX = r.moveY = 0 : null;
						break;
				}
				r[ 'update' ]( ev );
			} : function( $e ){
				var mouseX, mouseY, evType = $e.type, ev = $dkEvent( $e );
				r.mouseX = mouseX = $e.clientX, r.speedX = mouseX - oldX, oldX = mouseX, r.pageX = mouseX + $dkScroll.scrollLeft,
					r.mouseY = mouseY = $e.clientY, r.speedY = mouseY - oldY, oldY = mouseY, r.pageY = mouseY + $dkScroll.scrollTop,
					ev.type = map[ evType ] ? map[ evType ] : evType;
				switch( evType ){
					case'mousedown':
						press = true, startX = mouseX, startY = mouseY, r.moveX = r.moveY = 0;
						break;
					case'mousemove':
						r.moveX = press ? mouseX - startX : 0, r.moveY = press ? mouseY - startY : 0;
						break;
					case'mouseup':
						press = false, r.moveX = r.moveY = 0;
						break;
				}
				r[ 'update' ]( ev );
			},
			$addEvent( $doc, 'down', func, true ), $addEvent( $doc, 'move', func, true ), $addEvent( $doc, 'up', func, true ),
			r = $SList( 'MOUSE', true );
		return r;
	})( dk.DOC, dk.SList, dk.addEvent, dk.delEvent, dk.DETECTOR, dk.SCROLL, dk.dkEvent ) ),

	dk.stt( 'WHEEL', (function( $w, $SList, $addEvent, $delEvent, $detector, $dkEvent ){
		var r, func, start, end;
		func = function( $e ){
			var dkEvent, ev = $w.event || $e, delta = ev.detail ? ev.detail < 0 ? -1 : 1 : ev.wheelDelta > 0 ? -1 : 1;
			dkEvent = $dkEvent( ev ), dkEvent.delta = delta,
				r[ 'update' ]( dkEvent );
		},
			start = function(){ $addEvent( $w, $detector.wheelEvent, func ); },
			end = function(){ $delEvent( $w, $detector.wheelEvent, func ); },
			r = $SList( 'WHEEL', true, start, end );
		return r;
	})( dk.W, dk.SList, dk.addEvent, dk.delEvent, dk.DETECTOR, dk.dkEvent ) ),

	dk.stt( 'KEY', (function( $w, $SList, $addEvent, $delEvent, $dkEvent ){
		var r, func, start, end, list, t0 = {}, t1 = {}, t2 = ( "SPACE,32,BACKSPACE,8,TAB,9,ENTER,13,SHIFT,16,CTRL,17,ALT,18,PAUSE,19,CAPSLOCK,20,ESC,27," + "PAGE_UP,33,PAGE_DOWN,34,END,35,HOME,36,LEFT_ARROW,37,UP_ARROW,38,RIGHT_ARROW,39,DOWN_ARROW,40,INSERT,45,DELETE,46,NUMLOCK,144,SCROLLLOCK,145," + "0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57,A,65,B,66,C,67,D,68,E,69,F,70,G,71,H,72,I,73,J,74,K,75,L,76,M,77,N,78,O,79,P,80,Q,81,R,82,S,83,T,84,U,85,V,86,W,87,X,88,Y,89,Z,90," + "NUMPAD_0,96,NUMPAD_1,97,NUMPAD_2,98,NUMPAD_3,99,NUMPAD_4,100,NUMPAD_5,101,NUMPAD_6,102,NUMPAD_7,103,NUMPAD_8,104,NUMPAD_9,105," + "'*',106,'+',107,'-',109,'.',110,'/',111,'=',187,COMA,188,'SLASH',191,'BACKSLASH',220," + "F1,112,F2,113,F3,114,F4,115,F5,116,F6,117,F7,118,F8,119,F9,120,F10,121,F11,122,F12,123" ).split( "," ), i = t2.length;
		func = function( $e ){
			var ev = $dkEvent( $e ), t0 = list[ t1[ ev.keyCode = $e.keyCode ] ];
			//ev.target = dk.Dom( ev.nativeTarget );
			t0 ? t0( ev ) : 0;
		},
			start = function(){ $addEvent( $w, 'keydown', func ); },
			end = function(){ $delEvent( $w, 'keydown', func ); },
			r = $SList( 'KEY', 0, start, end ),
			list = r.list;
		while( i-- ) t1[ t2[ i-- ] ] = t2[ i ].toUpperCase(), t0[ t2[ i ].toUpperCase() ] = 0;
		return r;
	})( dk.W, dk.SList, dk.addEvent, dk.delEvent, dk.dkEvent ) ),

	dk.stt( 'REG', (function(){
		return {
			numeric : function( k ){ return /^[+-]*[0-9]*\.?\d+$/.test( k ) },
			stringOnly : function( k ){ return /^[^0-9]*$/.test( k ) },
			stripHTMLTags : function( k ){ return k.replace( /<\/?[^\<\/]+\/?>/g, "" ) },
			lineModify : function( k ){ return k.split( "\r\n" ).join( "\n" ) },
			Email : function( k ){ return /^(.+)\@(.+)\.(\w+)$/.test( k ) },
			ip : function( k ){ return /^[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?$/.test( k ) },
			url : function( k ){ return /^(https?\:\/\/)(www\.)?(.+)\.(\w)+/.test( k ) && k.match( /\./g ).length > 1 },
			KoreanRegistrationNumber : function( k ){ return /^[0-9]{6}-?[0-9]{7}$/.test( k ) },
			empty : function( k ){
				if( !k ) return true;
				return !k.length
			}
		}
	})() );
// LOADER :
;
dk.stt( 'JSON', {
	parse : function( $v ){ return ( new Function( '', 'return ' + $v ) )(); }
} ),

	dk.fn( 'ajax', (function( $w ){
		var checkXMLHttp, async;
		checkXMLHttp = (function(){
			if( $w[ 'XMLHttpRequest' ] !== undefined ) return function(){ return new XMLHttpRequest() };
			var t0 = [ 'MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP' ], i = 0, leng = t0.length;
			while( i < leng ){
				try{
					new ActiveXObject( t0[ i ] );
					return function(){ return new ActiveXObject( t0[ i ] ); }
				}catch( $e ){
					i++;
				}
			}
		})(),
			async = function( $cb, $url ){
				var rq = checkXMLHttp(),
					timeId = setTimeout( function(){
						if( timeId == -1 ) return;
						if( rq.readyState !== 4 ) rq.abort();
						timeId = -1, rq.onreadystatechange = null, $cb( null, 'timeout' );
					}, 5000 ),
					param = function( $arg ){
						var i = 2, j = $arg.length, k, v, r = '';
						if( !$arg || j < i + 1 ) return '';
						while( i < j ){
							r += i == 2 ? '?' : '&', k = $arg[ i++ ], v = $arg[ i++ ],
								r += encodeURIComponent( k ) + '=' + encodeURIComponent( v )
						}
						return r;
					},
					url = $url + param( arguments, 2 );
				rq.open( 'get', url, true ),
					rq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' ),
					rq.onreadystatechange = function(){
						if( rq.readyState !== 4 || timeId == -1 ) return;
						clearTimeout( timeId ), timeId = -1;
						if( rq.readyState == 4 ){
							if( rq.status == 404 ) return $cb( null, rq.status );
							if( rq.status >= 200 && rq.status < 300 || rq.status == 304 ){
								rq.onreadystatechange = null;
								$cb( rq.responseText, rq.status )
							}
						}
					},
					rq.send( null );
			};
		return async;
	})( dk.W ) ),

	dk.fn( 'js', (function( $w, $doc, $head ){
		var js;
		js = (function(){
			var uuId = 0;
			return function( $cb, $url ){
				var el = $doc.createElement( 'script' ), t0, t1, id = uuId++;
				$cb ? ( t0 = $url.charAt( $url.length - 1 ) ) : 0, t1 = ( t0 == '=' ),
					t1 ? $w[ '____callbacks' + id ] = function(){
						$cb.apply( null, arguments ), $w[ '____callbacks' + id ] = null;
					} : $doc.addEventListener ? el.onload = $cb : el.onreadystatechange = function(){
						if( el.readyState == 'loaded' || el.readyState == 'complete' ) el.onreadystatechange = null, $cb ? $cb() : 0;
					},
					el.type = 'text/javascript', el.charset = 'utf-8', el.src = $url + ( t1 ? ( '____callbacks' + id ) : '' ), $head.appendChild( el )
			}
		})();
		return function( $cb, $url/* , [ $url ], $url, $url */ ){
			var arg = arguments, arr, i, leng, load, complete;
			arr = (function(){
				var r = [], i, leng = arg.length, j, leng2;
				for( i = 1; i < leng; i++ ){
					if( Object.prototype.toString.call( arg[ i ] ) === '[object Array]' ){
						leng2 = arg[ i ].length;
						for( j = 0; j < leng2; j++ ){
							r.push( arg[ i ][ j ] )
						}
					}else{
						r.push( arg[ i ] )
					}
				}
				return r;
			})(),
				i = 0, leng = arr.length,
				load = function(){ js( complete, arr[ i++ ] ); },
				complete = function(){ i == leng ? $cb ? $cb() : null : load(); },
				leng == 1 ? js( $cb, arr[ i++ ] ) : load();
		}
	})( dk.W, dk.DOC, dk.HEAD ) ),

	dk.fn( 'img', (function( $doc, $detector ){
		var onload = (function(){
			if( $detector.ie8 )
				return function( $el, $cb ){
					var timeId = setTimeout( function(){
							if( timeId == -1 ) return;
							timeId = -1, $cb( false, $el );
						}, 5000 ),
						t0 = setInterval( function(){
							// todo $el.complete 이 무조건 뜬다
							$el.complete ? ( clearInterval( t0 ), clearTimeout( timeId ), timeId = -1, $cb( true ) ) : null;
						}, 16 );
				}
			else
				return function( $el, $cb ){
					$el.onload = function(){
						$el.onerror = $el.onabort = $el.onload = null, $cb( true );
					},
						$el.onerror = $el.onabort = function(){
							$el.onerror = $el.onabort = $el.onload = null, $cb( false, $el );
						}
				}
		})();

		return function( $cb, $src /* , [ $src ], $src, $src */ ){
			var arg = arguments, arr, i, leng, load, complete, r = [], el;
			arr = (function(){
				var r = [], i, leng = arg.length, j, leng2;
				for( i = 1; i < leng; i++ ){
					if( Object.prototype.toString.call( arg[ i ] ) === '[object Array]' ){
						leng2 = arg[ i ].length;
						for( j = 0; j < leng2; j++ ){
							r.push( arg[ i ][ j ] )
						}
					}else{
						r.push( arg[ i ] )
					}
				}
				return r;
			})(),
				i = 0, leng = arr.length,
				load = function(){ el = $doc.createElement( 'img' ), onload( el, complete ), el.src = arr[ i++ ], r.push( el ); },
				complete = function( $bool, $el ){
					if( $bool ){
						i == leng ? $cb( r ) : load();
					}else{
						$cb( false, $el.src );
					}
				},
				load();
		}
	})( dk.DOC, dk.DETECTOR ) );
;
// SPRITE SHEET :
dk.cls( 'Sheet', (function( $doc, $dkDom, $dkAjax, $dkJSON ){
	var factory, Sheet, proto = {}, uuId = 0;

	Sheet = function( $cb, $img, $json, $framerate ){
		var dom, self = this;
		this.uuId = 'Sheet' + uuId++,
			dom = $dkDom().S( 'bgImg', $img ), this.dom = dom, this.el = dom.el, this.style = this.el.style,
			this.arr = null, this.repeat = true, this.currentFrame = 1, this.totalFrames = 1, this.startFrame = 1, this.endFrame = 1, this.currentRate = 0, this.frameRate = 30, this.direction = true,
			$dkAjax( function( $data ){
				var data = $dkJSON.parse( $data ), arr = self.arr = data.frames;
				self.totalFrames = self.endFrame = arr.length, self.frameRate = $framerate == undefined ? 2 : 60 / $framerate,
					dom.S( 'width', arr[ 0 ].sourceSize.w, 'height', arr[ 0 ].sourceSize.h ), $cb( self );
			}, $json );
	},
		Sheet.prototype.S = function(){
			var r = this.dom.S.apply( this.dom, arguments );
			return r === this.dom ? this : r;
		},
		Sheet.prototype.S2 = function(){
			var i = arguments.length, k = arguments[ 0 ];
			i == 1 ? proto[ k ].call( this ) : proto[ k ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			return this;
		},

		factory = function( $img, $json, $framerate ){
			return new Sheet( $img, $json, $framerate );
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
})( dk.DOC, dk.Dom, dk.ajax, dk.JSON ) ),

	dk.PROTO.connect( dk.Sheet.fn, (function( $dkLOOP, $SList ){
		var sList, func, start, end, goFrame;
		func = function(){
			var list = sList._list, i = list.length, sheet;
			while( i-- ){
				sheet = list[ i ];
				if( sheet.arr == null ) continue;
				if( ++sheet.currentRate % sheet.frameRate < 1 ){
					if( sheet.direction ){
						++sheet.currentFrame > sheet.endFrame ?
							sheet.repeat ? sheet.currentFrame = sheet.startFrame : ( sheet.currentFrame = sheet.endFrame, sList.S( sheet.uuId, null ) )
							: null
					}else{
						--sheet.currentFrame < sheet.endFrame ?
							( sheet.currentFrame = sheet.endFrame, sList.S( sheet.uuId, null ) )
							: null
					}
				}
				goFrame( sheet );
			}
		},
			start = function(){ $dkLOOP.S( 'SHEET', func ) },
			end = function(){ $dkLOOP.S( 'SHEET', null ) },
			sList = $SList( 'SHEET', false, start, end ),

			goFrame = function( $sheet ){
				var arr = $sheet.arr, x, y;
				x = arr[ $sheet.currentFrame - 1 ].frame.x,
					y = arr[ $sheet.currentFrame - 1 ].frame.y,
					$sheet.S( 'backgroundPosition', -x + "px " + -y + "px" );
			}

		return {
			repeat : function(){
				this.direction = true, this.repeat = true, this.startFrame = 1, this.endFrame = this.totalFrames,
					sList.S( this.uuId, this );
			},
			play : function(){
				this.direction = true, this.repeat = false, this.endFrame = this.totalFrames,
					this.currentFrame + 1 > this.endFrame ? this.startFrame = this.currentFrame = this.endFrame : null,
					sList.S( this.uuId, this )
			},
			stop : function(){
				sList.S( this.uuId, null )
			},
			rewind : function(){
				this.direction = false, this.repeat = false, this.endFrame = 1,
					this.currentFrame - 1 < 1 ? this.startFrame = this.currentFrame = 1 : null,
					sList.S( this.uuId, this )
			},
			gotoAndStop : function( $frame ){
				this.currentFrame = $frame,
					sList.S( this.uuId, null ),
					goFrame( this );
			},
			gotoAndPlay : function( $frame ){
				this.direction = true, this.repeat = false, this.currentFrame = $frame, this.endFrame = this.totalFrames,
					sList.S( this.uuId, this );
			},
			abRepeat : function( $startFrame, $endFrame ){
				this.direction = true, this.repeat = true, this.startFrame = this.currentFrame = $startFrame, this.endFrame = $endFrame,
					sList.S( this.uuId, this );
			}
		};
	})( dk.LOOP, dk.SList ) );