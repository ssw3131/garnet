/**
 * Created by ssw on 14. 4. 3.
 */
"use strict";

(function(){
	var W = window, Doc = document, Head = Doc.getElementsByTagName( "head" )[ 0 ], Dk;

	//----------------------------------------------------------------------------------------------------------------------------------------------//
	// Dk
	Dk = W.Dk = { Information : { name : "Dk garnet", version : "v0.1.0", contact : "ssw3131@daum.net" } },

		//----------------------------------------------------------------------------------------------------------------------------------------------//
		// loader
		(function(){
			Dk.loader = {
				// text 로드
				text : function( $url, $cb, $obj ){
					ajax( $url, function( $data ){
						$cb( $data );
					}, "text", $obj ? $obj : {} );
				},

				// TODO json parser
				// json 로드
				json : function( $url, $cb, $obj ){
					ajax( $url, function( $data ){
						$cb( eval( "(" + $data + ")" ) );
					}, "json", $obj ? $obj : {} );
				},

				// xml 로드
				xml : function( $url, $cb, $obj ){
					ajax( $url, function( $data ){
						xmlParser( $data, $cb )
					}, "xml", $obj ? $obj : {} );
				},

				// js 로드
				js : function( $arr, $cb ){
					var load, hd = Head, count = 0, i = $arr.length;
					if( i == 0 ) return $cb ? $cb() : 0, undefined;

					load = (function(){
						if( Doc.addEventListener )
							return function( $url, $cb ){
								var scr = Doc.createElement( "script" );
								scr.type = "text/javascript", scr.charset = "utf-8", scr.src = $url, scr.onload = $cb, hd.appendChild( scr );
							};
						else
							return function( $url, $cb ){
								var scr = Doc.createElement( "script" );
								scr.type = "text/javascript", scr.charset = "utf-8", scr.src = $url, scr.onreadystatechange = function(){
									if( this.readyState == "loaded" || this.readyState == "complete" ) this.onreadystatechange = null, $cb();
								}, hd.appendChild( scr );
							};
					})(),

						load( $arr[ count ], complete );

					function complete(){
						++count == i ? $cb ? $cb() : 0 : load( $arr[ count ], complete );
					};
				},

				// asset 로드
				asset : function( $arr, $cb ){
					(function(){
						var core = Dk.core, cTe = core.throwError;

						function asset( $arr, $cb ){
							var a = $arr, leng = $arr.length, i = leng, k, v, r = {}, count = 0;
							i % 2 > 0 ? cTe( "DK : 리스트 갯수는 짝수여야 합니다" ) : undefined;
							while( i-- )
								v = a[ i-- ], k = a[ i ], load( k, v, complete );

							function complete( $k, $dom ){
								r[ $k ] = $dom, ++count == leng / 2 ? $cb( r ) : 0;
							}
						}

						function load( $k, $src, $cb ){
							Dk.dom( 'img' ).atr( 'src', $src ).ev( 'onload', function( $target ){
								$cb( $k, $target );
							} );
						}

						asset( $arr, $cb ), Dk.loader.asset = asset;
					})()
				}
			}

			// XMLHttpRequest
			function getXHR(){
				var req;
				try{
					req = new XMLHttpRequest(); // ie7 이후, 그외
					return getXHR = function(){
						return new XMLHttpRequest();
					}, req;
				}catch( $e ){
					try{
						req = new ActiveXObject( "Msxml2.XMLHTTP" ); // ie6
						return getXHR = function(){
							return new ActiveXObject( "Msxml2.XMLHTTP" );
						}, req;
					}catch( $e ){
						req = new ActiveXObject( "Microsoft.XMLHTTP" ); // ie5.5 이하
						return getXHR = function(){
							return new ActiveXObject( "Microsoft.XMLHTTP" );
						}, req;
					}
				}
			}

			// ajax
			function ajax( $url, $cb, $dataType, $obj ){
				var url = $url, type = $obj.type || "GET", cache = $obj.cache == undefined ? true : $obj.cache, postParam = $obj.postParam, req = getXHR();

				req.onreadystatechange = function(){
					req.readyState == 4 ? req.status == 200 ? $cb( $dataType == "xml" ? req.responseXML : req.responseText ) : 0 : 0;
				}

				req.open( type, url, true ), cache ? null : req.setRequestHeader( "If-Modified-Since", new Date( 1970, 0, 1 ).toGMTString() ), type == "GET" ? req.send( null ) : type == "POST" ? ( req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded; charset=UTF-8" ), req.send( postParam ) ) : 0; // TODO post 서버 405
			}

			// TODO xml parser
			function xmlParser( $data, $cb ){
				var result = { $search : function( $tag ){
					return $data.getElementsByTagName( $tag )
				} };

				function _parseNode( $result, $nodes ){
					var node, name, i = $nodes.length, idx = 0, t0;
					while( i-- ){
						node = $nodes[idx];
						if( node.nodeType == 1 ){
							$result[ name = node.nodeName ] ? $result[ name ].push( {} ) : $result[ name ] = [
								{}
							], _parseAtt( node, $result[ name ][ $result[ name ].length - 1 ] ), _parseNode( $result[ name ][ $result[ name ].length - 1 ], $nodes[ idx ].childNodes );
						}else if( node.nodeType == 3 || node.nodeType == 4 ){
							t0 = trim( node.nodeValue );
							if( t0 != "" ) $result['nodeValue'] ? $result['nodeValue'] += t0 : $result['nodeValue'] = t0;
						}
						idx++;
					}
				}

				function trim( $text ){
					return $text.replace( /^\s+|\s+$/g, '' );
				}

				function _parseAtt( $node, $array ){
					for( var i = 0, t0 = $node.attributes, len = t0.length; i < len; i++ )
						$array[ t0[ i ].nodeName ] = t0[ i ].nodeValue;
				}

				_parseNode( result, $data.documentElement.childNodes ), $cb( result );
			}
		})(),

		//----------------------------------------------------------------------------------------------------------------------------------------------//
		// init
		Dk.init = function( $callBack ){
			Dk.init.callBack = $callBack;
		},

		//----------------------------------------------------------------------------------------------------------------------------------------------//
		// Detector
		Dk.loader.js( [ "http://ssw3131.github.io/garnet/bsDetect.js" ], function(){
			var Detector, bsDetect, _callBack, _core, _util, _prototype;

			bsDetect = bs.detectDOM( W, bs.detectWindow( W ) ), Dk.Detector = Detector = {
				device : bsDetect.device,
				browser : bsDetect.browser, browserVersion : bsDetect.browserVer,
				os : bsDetect.os, osVersion : bsDetect.osVer,
				flash : bsDetect.flash,
				prefixCss : bsDetect.cssPrefix, prefixStyle : bsDetect.stylePrefix,
				transform3D : bsDetect.transform3D, transform : bsDetect.transform,
				transition : bsDetect.transition, keyframe : bsDetect.keyframe,
				video : bsDetect.video, videoTeora : bsDetect.videoTeora, videoH264 : bsDetect.videoH264, videoWebm : bsDetect.videoWebm,
				insertBefore : bsDetect.insertBefore,

				touchBool : W.ontouchstart !== undefined,
				innerText : bsDetect.browser == "firefox" ? 0 : 1,
				currentTarget : bsDetect.browser == "firefox" ? "target" : "srcElement",
				wheelEvent : bsDetect.browser == "firefox" ? "DOMMouseScroll" : "mousewheel",
				isLocalhost : location.host.indexOf( "localhost" ) < 0 ? false : true
			},

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// 보정패치
				(function(){
					// setTimeout, setInterval by Hika
					(function( f ){
						W.setTimeout = f( W.setTimeout ), W.setInterval = f( W.setInterval );
					})( function( f ){
						return function( $a, $b ){
							var a = [].slice.call( arguments, 2 );
							return f( function(){
								$a.apply( this, a );
							}, $b );
							a
						}
					} );

					// indexof
					if( Array.prototype.indexOf == undefined ){
						Array.prototype.indexOf = function( $v ){
							var self = this, i = self.length, r = -1;
							while( i-- ) if( self[i] == $v ) r = i;
							return r;
						}
					}

					// Date
					Date.now = Date.now * 1 || function(){
						return +new Date;
					}

					// splice todo 기능테스트
					var dtt = Detector;
					if( dtt.browser == "ie" && dtt.browserVersion < 9 ){
						var t0 = Array.prototype.splice;
						Array.prototype.splice = function(){
							var self = this, arr = [].slice.call( arguments, 0 );
							if( arr.length == 1 ) arr.push( self.length - arr[ 0 ] );
							return t0.apply( self, arr );
						}
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// core
				(function(){
					var dtt = Detector, cRet, cTs;
					Dk.core = _core = {
						push : Array.prototype.push,
						slice : Array.prototype.slice,
						indexOf : Array.prototype.indexOf,
						splice : Array.prototype.splice,
						join : Array.prototype.join,
						toString : cTs = Object.prototype.toString,
						hasOwn : Object.prototype.hasOwnProperty,
						trim : String.prototype.trim,
						replaceEventType : cRet = dtt.device != "pc" ? { mousedown : "touchstart", mousemove : "touchmove", mouseup : "touchend" } : {},

						// addEvent
						addEvent : (function(){
							if( dtt.device != "pc" ){
								if( Doc.addEventListener )
									return function( $e, $et, $cb, $cap ){
										if( $et == "mouseover" || $et == "mouseout" ) return;
										$et = cRet[ $et ] ? cRet[ $et ] : $et, $e.addEventListener( $et, $cb, $cap );
									}
							}else{
								if( Doc.addEventListener )
									return function( $e, $et, $cb, $cap ){
										$e.addEventListener( $et, $cb, $cap );
									}
								else if( Doc.attachEvent )
									return function( $e, $et, $cb ){
										$e.attachEvent( "on" + $et, $cb ); // ie8 이하 capture 불가능
									}
							}
						})(),

						// delEvent
						delEvent : (function(){
							if( dtt.device != "pc" ){
								if( Doc.addEventListener )
									return function( $e, $et, $cb, $cap ){
										if( $et == "mouseover" || $et == "mouseout" ) return;
										$et = cRet[ $et ] ? cRet[ $et ] : $et, $e.removeEventListener( $et, $cb, $cap );
									}
							}else{
								if( Doc.addEventListener )
									return function( $e, $et, $cb, $cap ){
										$e.removeEventListener( $et, $cb, $cap );
									}
								else if( Doc.attachEvent )
									return function( $e, $et, $cb ){
										$e.detachEvent( "on" + $et, $cb ); // ie8 이하 capture 불가능
									}
							}
						})(),

						// onload
						onload : (function(){
							if( dtt.browser == "ie" && dtt.browserVersion < 9 )
								return function( $d, $cb ){
									var t0 = setInterval( function(){
										$d.element.complete ? clearInterval( t0 ) : 0, $cb( $d );
									}, 16 );
								}
							else
								return function( $d, $cb ){
									$d.element.onload = function(){
										$cb( $d );
									}
								}
						})(),

						// ad manager
						adManager : function( $sF, $eF ){
							return (function(){
								var list = [], total = 0;

								return {
									add : function( $k, $v ){
										if( list[ $k ] == undefined )
											return list[ list[ $k ] = list.length ] = { key : $k, value : $v }, ++total == 1 ? $sF ? $sF() : 0 : 0, true;
										else
											return false; //log( "Dk : list에 이미 " + $k + "값이 존재합니다." )
									},

									del : function( $k ){
										// if( list[ $k ] == undefined ) return log( "Dk : list에 " + $k + "값이 존재하지 않습니다." );
										if( list[ $k ] == undefined ) return;
										var t0 = list[ $k ], k;
										list.splice( t0, 1 ), delete list[ $k ];
										for( k in list ) list[ k ] >= t0 ? list[ k ] -= 1 : 0;
										--total ? 0 : $eF ? $eF() : 0;
									},

									getList : function(){
										return list;
									}
								}
							})()
						},

						// 객체의 타입이 맞는지 체크
						// todo is 확장
						is : (function(){
							var t0 = { "array" : "[object Array]", "function" : "[object Function]", "string" : "[object String]", "number" : "[object Number]", "object" : "[object Object]" };
							return function( $t, $o ){
								return $o !== undefined && $o !== null && t0[ $t ] === cTs.call( $o );
							}
						})(),

						// throw error
						throwError : function( $m ){
							throw new Error( $m );
						}
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// util
				(function(){
					var mRandom = Math.random, dNow = Date.now, uRir;

					Dk.util = _util = {
						// 랜덤 범위지정
						randomRange : function( $max, $min ){
							$max = $max || 1, $min = $min || 0;
							return ( $max - $min ) * mRandom() + $min;
						},

						// 정수랜덤 범위지정
						randomIntRange : uRir = function( $max, $min ){
							$min = $min || 0;
							return parseInt( ( $max - $min + 0.99999 ) * mRandom() + $min );
						},

						// 랜덤 컬러생성
						randomColor : (function(){
							var t0 = uRir, rd = function(){
								return t0( 256 )
							};
							return function(){
								return "rgb(" + rd() + ", " + rd() + ", " + rd() + ")";
							}
						})(),

						randomColorHex : (function(){
							var letters = "0123456789ABCDEF".split( "" ), t0 = uRir;
							return function(){
								var color = "#";
								for( var i = 0; i < 6; i++ ){
									color += letters[ t0( 15 ) ];
								}
								return color;
							}
						})(),

						// 모니터 가로값을 가져온다
						widthScreen : function(){
							return screen.width;
						},

						// 모니터 세로값을 가져온다
						heightScreen : function(){
							return screen.height;
						},

						// 타임체크
						timeCheck : function( $toggle ){
							var self = _util.timeCheck;
							if( $toggle )
								self.st = dNow();
							else
								return ( self.et = dNow() ) - self.st;
						}
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// get set
				(function(){
					var cTe = _core.throwError;
					Dk.gs = function(){
						var a = arguments, i = a.length, k0 = a[ 0 ], k, v;
						if( i == 1 )
							return Dk[ k0 ];
						i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
						while( i-- )
							v = a[ i-- ], k = a[ i ], Dk[ k ] ? cTe( "Dk : 제공된 " + k + "가 기존에 존재합니다." ) : Dk[ k ] = v;
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// init
				(function(){
					_callBack = Dk.init.callBack, Dk.init = function( $callBack ){
						var check;
						check = function(){
							switch( Doc.readyState ){
								case"complete":
								case"interactive":
								case"loaded":
									if( Doc && Doc.getElementsByTagName && Doc.getElementById && Doc.body ) $callBack();
									break;
								default:
									setTimeout( check, 10 );
							}
						}, check();
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// plugIn load
				(function(){
					var list = {};

					function loadJs( $arr ){
						var arr = [], i = $arr.length;
						while( i-- ){
							arr[ i ] = $arr[ i ].url;
						}
						Dk.loader.js( arr );
					}

					Dk.plugIn = function( $plugInArr, $callBack ){
						var arr = $plugInArr.slice(), i = arr.length, nc = i, cc = 0;
						while( i-- ){
							list[ arr[ i ].id ] ? arr.splice( i, 1 ) : list[ arr[ i ].id ] = complete;
						}

						function complete(){
							++cc == nc ? $callBack() : 0;
						}

						loadJs( arr );
					},

						Dk.plugIn.add = function( $id ){
							list[ $id ]();
						}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// prototype
				(function(){
					var css, tree, event, getStyle, dtt = Detector, cr = _core, cIs = cr.is, cRet = cr.replaceEventType, cAe = cr.addEvent, cDe = cr.delEvent, cOl = cr.onload, cTe = cr.throwError, pc = dtt.prefixCss, npx = { opacity : true, zIndex : true, "z-index" : true };

					// css
					(function(){
						css = {
							bgColor : function( $s, $v ){
								if( $v ) $s[ "backgroundColor" ] = $v;
								else return $s[ "backgroundColor" ];
							},

							bgImg : function( $s, $v ){
								if( $v ) $s[ "backgroundImage" ] = "url(" + $v + ")";
								else return $s[ "backgroundImage" ];
							},

							float : function( $s, $v ){
								$s[ "cssFloat" ] == undefined ? css.float = function( $s, $v ){
									if( $v ) $s[ "styleFloat" ] = $v;
									else return $s[ "styleFloat" ];
								} : css.float = function( $s, $v ){
									if( $v ) $s[ "cssFloat" ] = $v;
									else return $s[ "cssFloat" ];
								}, css.float( $s, $v );
							},

							fontSmoothing : function( $s, $v ){
								if( $v ) $s[ "font-smoothing" ] = $v, $s[ pc + "font-smoothing" ] = $v;
								else return $s[ "font-smoothing" ];
							}
						}
					})(),

						// tree
						// todo 네이밍
						(function(){
							tree = {
								// innerHTML
								innerHTML : function( $msg ){
									var self = this;
									return ( $msg == undefined ) ? self.element.innerHTML : self.element.innerHTML = $msg, self;
								},

								// text 추가
								text : (function(){
									if( Detector.innerText )
										return function( $msg ){
											var self = this;
											if( $msg == undefined )
												return self.element.innerText;
											else
												return self.element.innerText = $msg, self;
										}
									else
										return function( $msg ){
											// todo br 처리
											var self = this;
											if( $msg == undefined )
												return self.element.textContent;
											else
												return self.element.textContent = $msg, self;
										}
								})(),

								// 자식객체 숫자
								numChildren : function(){
									return this.children.length;
								},

								// 부모객체에 자식으로 추가
								addParent : function( $parent ){
									var self = this, body = Doc.body;
									if( self.parent == $parent ) return self;

									self.parent == body ? body.removeChild( self.element ) : self.parent ? self.parent.tr( "removeChild", self ) : 0, self.parent = $parent, $parent == body ? $parent.appendChild( self.element ) : $parent.tr( "addChild", self );
									return self;
								},

								// 부모객체에 자식객체 제거
								removeParent : function( $parent ){
									var self = this, body = Doc.body;
									self.parent == $parent ? 0 : cTe( "Dk : 제공된 parent는 호출자의 부모이어야 합니다." );
									if( $parent == body )
										self.parent = null, $parent.removeChild( self.element );
									else
										$parent.tr( "removeChild", self );
									return self;
								},

								// 자식객체 추가
								addChild : function( $child ){
									var self = this;
									$child.parent ? $child.parent.tr( "removeChild", $child ) : 0, $child.parent = self, self.children.push( $child ), self.element.appendChild( $child.element );
									return self;
								},

								// 자식객체 해당 인덱스에 추가
								addChildAt : function( $child, $index ){
									var self = this, e = self.element, t0 = self.children, i = t0.length, t1 = $child.element, t2;
									$index < 0 ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : $index = $index > i ? i : $index, $child.parent ? $child.parent.tr( "removeChild", $child ) : 0, $child.parent = self, t2 = t0.splice( $index ), t0.push( $child ), t0 = self.children = t0.concat( t2 ), ( $index >= i ) ? e.appendChild( t1 ) : e.insertBefore( t1, t0[ ++$index ].element );
									return self;
								},

								// 해당 인덱스의 객체 반환
								getChildAt : function( $index ){
									var self = this, t0 = self.children, i = t0.length;
									$index < 0 || $index >= i ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : 0;
									return t0[ $index ];
								},

								// 해당 객체의 인덱스 반환
								getChildIndex : function( $child ){
									$child ? 0 : cTe( "Dk : 제공된 파라미터 값이 존재하지 않습니다." );
									var self = this, t0 = self.children, i = t0.length;
									while( i-- ) if( $child == t0[ i ] ) return i;
									cTe( "Dk : 제공된 child는 호출자의 자식이어야 합니다." );
								},

								// 자식객체 제거
								removeChild : function( $child ){
									var self = this, t0 = self.children, i = t0.length;
									$child.parent == self ? 0 : cTe( "Dk : 제공된 child는 호출자의 자식이어야 합니다." );
									while( i-- ){
										if( t0[ i ] == $child ){
											$child.parent = null, t0.splice( i, 1 ), self.element.removeChild( $child.element );
											break;
										}
									}
									return self;
								},

								// 해당 인덱스의 객체 제거
								removeChildAt : function( $index ){
									var self = this, t0 = self.children, i = t0.length, t1;
									$index < 0 || $index >= i ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : 0, t1 = t0.splice( $index, 1 ), t1[ 0 ].parent = null, self.element.removeChild( t1[ 0 ].element );
									return self;
								},

								// 자식객체 모두 제거 or 해당 인덱스 범위 제거 (slice 개념)
								removeChildren : function( $bIndex, $eIndex ){
									var self = this, e = self.element, i, t0 = self.children, t1 = t0.length, t2;
									( $bIndex < 0 || $eIndex < 0 || $bIndex >= $eIndex || $bIndex >= t1 ) ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : 0, $bIndex == undefined ? $bIndex = 0 : 0, $eIndex == undefined ? $eIndex = t1 : 0, t2 = t0.splice( $bIndex, $eIndex - $bIndex ), i = t2.length;
									while( i-- ) t2[ i ].parent = null, e.removeChild( t2[ i ].element );
									return self;
								}
							}
						})(),

						// event : mousedown, mouseup, mousemove 일경우 버블링유지
						(function(){
							function dispatchEvent( $dom, $v ){
								var self = $dom, cb = $v;
								return function( $e ){
									var r, et;
									et = $e.type, et == "mousedown" || et == "mouseup" || et == "mousemove" ? 0 : cancelBubbling( $e ), r = localPosition( self ), r.type = et, r.currentTarget = self, cb( r );
								}
							}

							// 버블링 캔슬
							function cancelBubbling( $e ){
								if( $e.stopPropagation )
									cancelBubbling = function( $e ){
										$e.stopPropagation();
									}, cancelBubbling( $e );
								else if( W.event )
									cancelBubbling = function(){
										W.event.cancelBubble = true;
									}, cancelBubbling();
							}

							function localPosition( $dom ){
								var e = $dom.element, x = e.offsetLeft, y = e.offsetTop, dkDoc = Dk.Doc;
								while( e.offsetParent ) e = e.offsetParent, x += e.offsetLeft, y += e.offsetTop;
								return { localX : dkDoc.pageX - x, localY : dkDoc.pageY - y };
							}

							event = {
								add : function( $d, $k, $v ){
									var self = $d, e = self.element, cb;
									cb = dispatchEvent( self, $v );
									self.___eventList[ $k ] = cb, cAe( e, $k, cb );
								},
								del : function( $d, $k ){
									var self = $d, e = self.element, el = self.___eventList;
									cDe( e, $k, el[ $k ] ), delete el[ $k ];
								}
							}
						})(),

						// get computed style
						(function(){
							getStyle = {
								scrollWidth : function(){
									return this.element.scrollWidth;
								},
								scrollHeight : function(){
									return this.element.scrollHeight;
								}
							}

							getStyle.gcs = W.getComputedStyle ? function( $k ){
								var self = this;
								return W.getComputedStyle( self.element )[ $k ];
							} : function( $k ){
								var self = this;
								return self.element.currentStyle[ $k ];
							};
						})(),

						Dk.prototype = _prototype = {
							// property
							pp : function(){
								var self = this, a = arguments, i = a.length, k0 = a[ 0 ];
								if( i == 1 )
									return self[ k0 ];
								i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
								while( i-- )
									self[ a[ i - 1 ] ] = a[ i-- ];
								return self;
							},

							// attribute
							atr : function(){
								var self = this, e = self.element, a = arguments, i = a.length, k0 = a[ 0 ];
								if( i == 1 )
									return e[ k0 ];
								i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
								while( i-- )
									e[ a[ i - 1 ] ] = a[ i-- ];
								return self;
							},

							// inline style
							css : function(){
								var self = this, cs = css, e = self.element, s = e.style, a = arguments, i = a.length, k, v, r, t0;
								if( i == 1 )
									return k = a[ 0 ], r = cs[ k ] ? cs[ k ]( s ) : s[ k ], t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0;
								i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
								while( i-- )
									v = a[ i-- ], k = a[ i ], v = typeof v == "number" ? npx[ k ] ? v : v + "px" : v, cs[ k ] ? cs[ k ]( s, v ) : s[ k ] = v, s[ pc + k ] = v;
								return self;
							},

							// tree
							tr : function(){
								var self = this, tr = tree, a = arguments, i = a.length, k, v, r, t0 = cIs;
								if( i == 1 )
									return tr[ a[ 0 ] ].call( self );
								i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
								while( i-- )
									v = a[ i-- ], k = a[ i ], r = t0( "array", v ) ? tr[ k ].apply( self, v ) : tr[ k ].call( self, v );
								return r;
							},

							// event
							ev : (function(){
								var ev = event, t0 = cOl, t1 = cRet;
								if( dtt.device != "pc" )
									return function(){
										var self = this, a = arguments, i = a.length, k, v;
										i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 짝수여야 합니다" ) : 0;
										while( i-- )
											v = a[ i-- ], k = t1[ k = a[ i ] ] ? t1[ k ] : k, k == "onload" ? t0( self, v ) : v ? ev.add( self, k, v ) : ev.del( self, k );
										return self;
									}
								else
									return function(){
										var self = this, a = arguments, i = a.length, k, v;
										i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 짝수여야 합니다" ) : 0;
										while( i-- ){
											v = a[ i-- ], k = a[ i ], k == "onload" ? t0( self, v ) : v ? ev.add( self, k, v ) : ev.del( self, k );
										}
										return self;
									}
							})(),

							// get computed style
							gcs : (function(){
								return function( $k ){
									var self = this, gcs = getStyle;
									return gcs[ $k ] ? gcs[ $k ].call( self ) : parseFloat( gcs.gcs.call( self, $k ) );
								}
							})(),

							// styleSheet
							st : function(){
								var self = this, cs = css, s = self.rules[ self.styleId ].style, a = arguments, i = a.length, k, v, r, t0;
								if( i == 1 )
									return k = a[ 0 ], r = s[ k ], t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0;
								i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : 0;
								while( i-- )
									v = a[ i-- ], k = a[ i ], v = typeof v == "number" ? npx[ k ] ? v : v + "px" : v, cs[ k ] ? cs[ k ]( s, v ) : s[ k ] = v, s[ pc + k ] = v;
								return self;
							}
						}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// dom, style
				(function(){
					// prototype id
					(function(){
						var list, adManager, cr = _core, cTe = cr.throwError;
						list = ( adManager = cr.adManager() ).getList(),

							_prototype.id = function( $id ){
								var self = this;
								Doc.getElementById( $id ) ? cTe( "Dk : 제공된 id가 기존에 존재합니다." ) : adManager.add( $id, self ) ? self.element.id = $id : 0;
								return self;
							},

							// getById
							Dk.getById = function( $id ){
								return list[ $id ] == undefined ? null : list[ list[ $id ] ].value;
							}
					})(),

						// dom
						(function(){
							var Dom, pt = _prototype;

							Dom = function( $type ){
								var self = this, e = Doc.createElement( $type ? $type : "div" ), s = e.style;
								self.___eventList = {}, self.parent = null, self.children = [], self.element = e, self.style = s, self.element.___self = self;
							},

								Dom.prototype = { id : pt.id, pp : pt.pp, atr : pt.atr, css : pt.css, tr : pt.tr, ev : pt.ev, gcs : pt.gcs },

								Dk.dom = function( $type ){
									return new Dom( $type );
								}
						})(),

						// styleSheet
						(function(){
							var Style, pt = _prototype, list, e, sheet, rules;
							list = {}, e = Doc.createElement( "style" ), Head.appendChild( e ), sheet = e.sheet || e.styleSheet, rules = sheet.cssRules || sheet.rules,

								Style = sheet.addRule ? function( $key ){
									var self = this;
									self.sheet = sheet, self.rules = rules, self.styleId = rules.length, sheet.addRule( $key, " ", self.styleId );
								} : function( $key ){
									var self = this;
									self.sheet = sheet, self.rules = rules, self.styleId = rules.length, sheet.insertRule( $key + "{}", self.styleId );
								},

								Style.prototype = { st : pt.st },

								Dk.style = function( $key ){
									if( list[ $key ] )
										return list[ $key ];
									else
										return list[ $key ] = new Style( $key );
								}
						})()
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// Loop
				(function(){
					var list, stats, raf, update;
					list = ( Dk.Loop = _core.adManager() ).getList(), raf = (function(){
						return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || W.oRequestAnimationFrame || function( $loop ){
							return W.setTimeout( $loop, 16 )
						};
					})();

					// stats
					if( W.Stats )
						stats = new Stats(), stats.setMode( 0 ), stats.domElement.style.cssText = "position : fixed; z-index : 2; left : 0px", Doc.body.appendChild( stats.domElement ),
							update = function(){
								stats.begin();

								var i = list.length;
								while( i-- ) list[ i ].value( list[ i ].key );
								raf( update );

								stats.end();
							};
					else
						update = function(){
							var i = list.length;
							while( i-- ) list[ i ].value( list[ i ].key );
							raf( update );
						};

					raf( update );
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// Keyboard
				(function(){
					var list, cr = _core, cAe = cr.addEvent, cDe = cr.delEvent, kco = {}, i, k, v, t0;
					i = (t0 = "a,65,b,66,c,67,d,68,e,69,f,70,g,71,h,72,i,73,j,74,k,75,l,76,m,77,n,78,o,79,p,80,q,81,r,82,s,83,t,84,u,85,v,86,w,87,x,88,y,89,z,90,back,8,tab,9,enter,13,shift,16,control,17,alt,18,pause,19,caps,20,esc,27,space,32,pageup,33,pagedown,34,end,35,home,36,left,37,up,38,right,39,down,40,insert,45,delete,46,numlock,144,scrolllock,145,0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57".split( "," )).length;
					while( i-- ) kco[ t0[ i ] ] = t0[ --i ];
					list = ( Dk.Keyboard = cr.adManager( start, end ) ).getList();

					function start(){
						cAe( Doc, "keydown", update ), cAe( Doc, "keyup", update );
					}

					function end(){
						cDe( Doc, "keydown", update ), cDe( Doc, "keyup", update );
					}

					function update( $e ){
						var i = list.length;
						while( i-- ) list[ i ].value( $e.type, kco[$e.keyCode], list[ i ].key );
					}
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// Doc
				(function(){
					var dkDoc, dtt = Detector, cr = _core, cAe = cr.addEvent, cDe = cr.delEvent, scLeft, scTop;
					Dk.Doc = dkDoc = {},

						// scrollLeft, scrollTop
						scLeft = function(){
							return Doc.documentElement.scrollLeft ? Doc.documentElement.scrollLeft : Doc.body.scrollLeft ? Doc.body.scrollLeft : 0;
						},
						scTop = function(){
							return Doc.documentElement.scrollTop ? Doc.documentElement.scrollTop : Doc.body.scrollTop ? Doc.body.scrollTop : 0;
						},

						// mouse - mouseX, pageX, speedX, moveX, touchList
						(function(){
							var moveF = { mousedown : moveStart, touchstart : moveStart, mouseup : moveStop, touchend : moveStop, mousemove : moveNothing, touchmove : moveNothing }, oldX = 0, oldY = 0, stX, stY;
							cAe( Doc, "mousedown", mouseFunc, true ), cAe( Doc, "mouseup", mouseFunc, true ), cAe( Doc, "mousemove", mouseFunc, true );

							function mouseFunc( $e ){
								if( dtt.device != "pc" )
									mouseFunc = function( $e ){
										var mx, my, touchList = [], eTouches = $e.touches, i = eTouches.length, sl = scLeft(), st = scTop(), et = $e.type;
										mx = eTouches[ 0 ].clientX, my = eTouches[ 0 ].clientY, dkDoc.mouseX = mx, dkDoc.mouseY = my, dkDoc.pageX = mx + sl, dkDoc.pageY = my + st, dkDoc.speedX = mx - oldX, dkDoc.speedY = my - oldY, oldX = mx, oldY = my, moveF[ et ]( mx, my );
										while( i-- ) touchList[ i ] = { pageX : eTouches[ i ].x + sl, pageY : eTouches[ i ].y + st };
										mouse.touchList = touchList;
									}
								else
									mouseFunc = function( $e ){
										var mx, my, et = $e.type;
										mx = $e.clientX, my = $e.clientY, dkDoc.mouseX = mx, dkDoc.mouseY = my, dkDoc.pageX = mx + scLeft(), dkDoc.pageY = my + scTop(), dkDoc.speedX = mx - oldX, dkDoc.speedY = my - oldY, oldX = mx, oldY = my, moveF[ et ]( mx, my );
									}
								mouseFunc( $e );
							}

							function moveStart( $x, $y ){
								moveF.mousemove = moveIng, moveF.touchmove = moveIng, dkDoc.moveX = dkDoc.moveY = 0, stX = $x, stY = $y;
							}

							function moveStop( $x, $y ){
								moveF.mousemove = moveNothing, moveF.touchmove = moveNothing, dkDoc.moveX = $x - stX, dkDoc.moveY = $y - stY;
							}

							function moveIng( $x, $y ){
								dkDoc.moveX = $x - stX, dkDoc.moveY = $y - stY;
							}

							function moveNothing(){
							}
						})(),

						// resize
						(function(){
							var gw, gh, rm, rl;
							gw = (function(){
								if( W.innerWidth )
									return function(){
										return W.innerWidth
									};
								else
									return function(){
										return Doc.documentElement.clientWidth
									};
							})(),

								gh = (function(){
									if( W.innerHeight )
										return function(){
											return W.innerHeight
										};
									else
										return function(){
											return Doc.documentElement.clientHeight
										};
								})(),

								dkDoc.width = gw(), dkDoc.height = gh(), rm = cr.adManager( start, end ), dkDoc.addResize = rm.add, dkDoc.delResize = rm.del, rl = rm.getList();

							function start(){
								cAe( W, "resize", update );
							}

							function end(){
								cDe( W, "resize", update );
							}

							function update( $e ){
								var i = rl.length;
								dkDoc.width = gw(), dkDoc.height = gh();
								while( i-- ) rl[ i ].value( rl[ i ].key );
							}
						})(),

						// wheel
						(function(){
							var wm, wl, we = Detector.wheelEvent;
							wm = cr.adManager( start, end ), dkDoc.addWheel = wm.add, dkDoc.delWheel = wm.del, wl = wm.getList();

							function start(){
								cAe( Doc, we, update );
							}

							function end(){
								cDe( Doc, we, update );
							}

							function update( $e ){
								var i = wl.length, ev = W.event || $e, delta = ev.detail ? ev.detail < 0 ? -1 : 1 : ev.wheelDelta > 0 ? -1 : 1;
								while( i-- ) wl[ i ].value( delta, wl[ i ].key );
							}
						})(),

						// scroll
						(function(){
							var sm, sl;
							sm = cr.adManager( start, end ), dkDoc.addScroll = sm.add, dkDoc.delScroll = sm.del, sl = sm.getList();

							function start(){
								cAe( Doc, "scroll", update );
							}

							function end(){
								cDe( Doc, "scroll", update );
							}

							function update( $e ){
								var i = sl.length, scl = scLeft(), sct = scTop();
								while( i-- ) sl[ i ].value( { scrollLeft : scl, scrollTop : sct }, sl[ i ].key );
							}
						})()
				})(),

				//----------------------------------------------------------------------------------------------------------------------------------------------//
				// callBack
				_callBack ? _callBack() : 0;
		} )
})()