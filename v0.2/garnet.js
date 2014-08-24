"use strict";
(function() {
	var W = window, DOC = document, HEAD = DOC.getElementsByTagName( 'head' )[0];
	var dk, fn, bsSelector, query;
	var trim = /^\s*|\s*$/g;
// 보정패치
	if( !W['JSON'] ) W['JSON'] = { parse: function( v ) {return ( 0, eval )( '(' + v + ')' );}};
	if( !W['console'] ) W['console'] = {log: function() {}};
	W[ 'log' ] ? 0 : W[ 'log' ] = W.console.log,
		Date.now = W[ 'performance' ] ? W[ 'performance' ] : (Date.now || function() {return +new Date }),
		W.requestAnimFrame = (function() {return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function( loop ) {W.setTimeout( loop, 17 )}})();

	function sMethod() {}

	sMethod.prototype = {
		S: function() {
			var i = 0, j = arguments.length, k, v; //루프용 i,j와 키밸류용 k, v
			while( i < j ){
				k = arguments[i++];
				if( i == j ){
					if( k == 'this' ) return this;
					return typeof this[k] == 'function' ? this[k]() : this[k]
				}
				else{
					v = arguments[i++]
					if( v === null ) delete this[k];
					typeof this[k] == 'function' ? this[k]( v ) : this[k] = v
				}
			}
			return this; //TODO 재질은 this로가고 메쉬류는 v로가야하는겐가!!
		}
	}

// core
	W.dk = dk = { info: { name: 'Dk garnet', ver: 'v0.2.0', url: 'https://github.com/ssw3131/garnet' } },
		dk['method'] = fn = function( k, v ) { dk[k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length )] = v},
		dk['class'] = function( k, v ) { k = k.replace( trim, '' ).toLowerCase(), dk[k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length )] = v},
		dk['static'] = function( k, v ) {dk[k.replace( trim, '' ).toUpperCase()] = v},
// selector
		bsSelector = function( doc, trim, domData ) {
			var compare = {
					// id // class // Attribute
					'#': function( el, token ) { return token.substr( 1 ) == el.id;},
					'.': function( el, token ) {
						var t0, k;
						return !( t0 = el.className ) ? 0 : ( k = token.substr( 1 ), t0.indexOf( ' ' ) > -1 ? k == t0 : t0.split( ' ' ).indexOf( k ) > -1 );
					},
					'[': (function() {
						var mT0 = {'~': 1, '|': 1, '!': 1, '^': 1, '$': 1, '*': 1};
						return function( el, token ) {
							var t0, t1, i, v;
							if( ( i = token.indexOf( '=' ) ) == -1 ) return el.getAttribute( token.substr( 1 ) ) === null ? 0 : 1;
							if( ( t0 = el.getAttribute( token.substring( 1, i - ( mT0[t1 = token.charAt( i - 1 )] ? 1 : 0 ) ) ) ) === null ) return;
							v = token.substr( i + 1 );
							switch( t1 ){
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
						};
					})(),
					// pseudo
					':': (function( trim, domData ) {
						var mTag = {'first-of-type': 1, 'last-of-type': 1, 'only-of-type': 1},
							nChild = {'first-child': 'firstElementChild', 'last-child': 'lastElementChild'},
							enabled = {INPUT: 1, BUTTON: 1, SELECT: 1, OPTION: 1, TEXTAREA: 1},
							checked = {INPUT: 1, radio: 1, checkbox: 1, OPTION: 2},
							skip = {'target': 1, 'active': 1, 'visited': 1, 'first-line': 1, 'first-letter': 1, 'hover': 1, 'focus': 1, 'after': 1, 'before': 1, 'selection': 1,
								'eq': 1, 'gt': 1, 'lt': 1,
								'valid': 1, 'invalid': 1, 'optional': 1, 'in-range': 1, 'out-of-range': 1, 'read-only': 1, 'read-write': 1, 'required': 1
							};
						return function filters( el, token ) {
							var parent, childs, tag, dir, t0, t1, t2, k, v, i, j, m, dd, tname, ename, lname;
							k = token.substr( 1 ), i = k.indexOf( '(' ), v = i > -1 ? isNaN( t0 = k.substr( i + 1 ) ) ? t0.replace( trim, '' ) : parseFloat( t0 ) : null;
							if( v ) k = k.substring( 0, i );
							if( skip[k] ) return;
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
									return t0 = checked[el.tagName], ( t0 == 1 && el.checked && checked[el.getAttribute( 'type' )] ) || ( t0 == 2 && el.selected );
								case'enabled':
									return enabled[el.tagName] && ( ( t0 = el.getAttribute( 'disabled' ) ) == null || t0 == '' );
								case'disabled':
									return enabled[el.tagName] && ( ( t0 = el.getAttribute( 'disabled' ) ) != null && t0 != '' );
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
									if( isElCld && ( t1 = nChild[k] ) ) return el.parentNode[t1] == el;
									dd = domData( parent = el.parentNode ), tag = el.tagName;
									(t1 = mTag[k]) ? dir ? ( tname = 'DQseqFCT' + tag, ename = 'DQFCTEl' + tag ) : ( tname = 'DQseqLCT' + tag, ename = 'DQLCTEl' + tag ) :
										dir ? ( tname = 'DQseqFC', ename = 'DQFCEl' ) : ( tname = 'DQseqLC', ename = 'DQLCEl' );
									if( !dd[tname] || dd[tname] != bsRseq ){
										if( ( childs = isElCld ? parent.children : parent.childNodes ) && ( i = j = childs.length ) ){
											m = 0;
											while( i-- ){
												t0 = childs[dir ? j - i - 1 : i];
												if( ( isElCld ? 1 : t0.nodeType == 1 ) && ( t1 ? tag == t0.tagName : 1 ) && !m++ ){
													dd[tname] = bsRseq,
														dd[ename] = t0;
													break;
												}
											}
										}
									}
									return dd[ename] == el;
								case'only-of-type':
								case'only-child':
									if( isElCld && k == 'only-child' ) return el.parentNode.children.length == 1;
									dd = domData( parent = el.parentNode ),
										t1 = mTag[k], tag = el.tagName;
									k == 'only-of-type' ? ( tname = 'DQseqOT' + tag, lname = 'DQTChElLen' + tag ) : ( tname = 'DQseqOCH', lname = 'DQChElLen' );
									if( !dd[tname] || dd[tname] != bsRseq ){
										if( ( childs = isElCld ? parent.children : parent.childNodes ) && ( i = childs.length ) ){
											m = 0;
											while( i-- ){
												t0 = childs[i];
												if( ( isElCld ? 1 : t0.nodeType == 1 ) && ( t1 ? tag == t0.tagName : 1 ) && !m++ );
											}
											dd[tname] = bsRseq,
												dd[lname] = m;
										}
									}
									return dd[lname] == 1;
								default:
									if( !( parent = el.parentNode ) || parent.tagName == 'HTML' || !( childs = isElCld ? parent.children : parent.childNodes ) || !( j = i = childs.length ) )
										return;
									if( v == 'n' ) return 1;
									t1 = 1, dd = domData( el );
									switch( k ){
										case'nth-child':
											if( !dd.DQseq || dd.DQseq != bsRseq ){
												for( i = 0; i < j; i++ ){
													t0 = childs[i];
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
													t0 = childs[i];
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
											if( !dd[tname] || dd[tname] != bsRseq ){
												for( i = 0; i < j; i++ ){
													t0 = childs[i];
													if( ( isElCld ? 1 : t0.nodeType == 1 ) && t0.tagName == tag ){
														( t2 = domData( t0 ) )[tname] = bsRseq,
															t2[lname] = t1++;
													}
												}
											}
											return t0 = dd[lname], v == 'even' || v == '2n' ? t0 % 2 == 0 :
													v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
												t0 == v;
										case'nth-last-of-type':
											tag = el.tagName, tname = 'DQseqTL' + tag, lname = 'DQindexTL' + tag;
											if( !dd[tname] || dd[tname] != bsRseq ){
												while( i-- ){
													t0 = childs[i];
													if( ( isElCld ? 1 : t0.nodeType == 1 ) && t0.tagName == tag ){
														( t2 = domData( t0 ) )[tname] = bsRseq,
															t2[lname] = t1++;
													}
												}
											}
											return t0 = dd[lname], v == 'even' || v == '2n' ? t0 % 2 == 0 :
													v == 'odd' || v == '2n+1' ? t0 % 2 == 1 :
												t0 == v;
									}
							}//
						};
					})( trim, domData || (function() {
						var id = 1, data = {};
						return function domData( el, k, v ) {
							var t0;
							if( !( t0 = el['data-bs'] ) ) el['data-bs'] = t0 = id++, data[t0] = {};
							return k == undefined ? data[t0] : v == undefined ? data[t0][k] : v === null ? delete data[t0][k] : ( data[t0][k] = v );
						};
					})() )
				},
				rTag = /^[a-z]+[0-9]*$/i, rAlpha = /[a-z]/i, rClsTagId = /^[.#]?[a-z0-9]+$/i,
				DOC = document, tagName = {}, clsName = {},
				className = (function( tagName, clsName ) {
					var reg = {}, r = [];
					return DOC['getElementsByClassName'] ? function( cls ) {
						return clsName[cls] || ( clsName[cls] = DOC.getElementsByClassName( cls ) );
					} : function( cls ) {
						var t0 = tagName['*'] || ( tagName['*'] = DOC.getElementsByTagName( '*' ) ), t1 = reg[cls] || ( reg[cls] = new RegExp( '\\b' + cls + '\\b', 'g' ) ), i = t0.length;
						r.length = 0;
						while( i-- ) if( t1.test( t0[i].className ) ) r[r.length] = t0[i];
						return r;
					};
				})( tagName, clsName ),
				bsRseq = 0,
				navi,
				chrome = ( navi = window['navigator'].userAgent.toLowerCase() ).indexOf( 'chrome' ) > -1 || navi.indexOf( 'crios' ) ? 1 : 0,
				mQSA = {' ': 1, '+': 1, '~': 1, ':': 1, '[': 1},
				mParent = {' ': 1, '>': 1}, mBracket = {'[': 1, '(': 1, ']': 2, ')': 2},
				mEx = {' ': 1, '*': 1, ']': 1, '>': 1, '+': 1, '~': 1, '^': 1, '$': 1},
				mT0 = {' ': 1, '*': 2, '>': 2, '+': 2, '~': 2, '#': 3, '.': 3, ':': 3, '[': 3}, mT1 = {'>': 1, '+': 1, '~': 1},
				R = [], arrs = {_l: 0},
				aPsibl = ['previousSibling', 'previousElementSibling'],
				tEl = DOC.createElement( 'ul' ), isElCld, isQSA;
			if( !Array.prototype.indexOf ) Array.prototype.indexOf = function( v, I ) {
				var i, j, k, l;
				if( j = this.length ) for( I = I || 0, i = I, k = parseInt( ( j - i ) * .5 ) + i + 1, j--; i < k; i++ ) if( this[l = i] === v || this[l = j - i + I] === v ) return l;
				return -1;
			};
			tEl.innerHTML = '<li>1</li>',
				isElCld = tEl['firstElementChild'] && tEl['lastElementChild'] && tEl['children'] ? 1 : 0,
				isQSA = isElCld && DOC['querySelectorAll'] ? 1 : 0;
			return function selector( query, doc, r ) {
				var sels, sel,
					hasParent, hasQSAErr, hasQS,
					t0, t1, t2, t3, i, j, k, l, m, n,
					el, els, hit, token, tokens;

				if( !r ) r = R;
				r.length = 0, doc ? ( DOC = doc ) : ( doc = DOC );
				if( rClsTagId.test( query ) ) switch( query.charAt( 0 ) ){
					case'#':
						return r[r.length] = doc.getElementById( query.substr( 1 ) ), r;
					case'.':
						return className( query.substr( 1 ) );
					default:
						return tagName[query] || ( tagName[query] = doc.getElementsByTagName( query ) );
				}
				if( chrome && isQSA ){
					if( ( t0 = query.toLowerCase() ).indexOf( ':contains' ) < 0 && t0.indexOf( '!' ) < 0 ){
						return doc.querySelectorAll( query );
					}
				}
				if( isQSA && ( i = query.indexOf( ',' ) ) > -1 && query.indexOf( '!' ) < 0 ) return doc.querySelectorAll( query );
				if( i == -1 ) sels = arrs._l ? arrs[--arrs._l] : [], sels[0] = query, i = 1;
				else sels = query.split( ',' ), i = sels.length;
				while( i-- ){
					t0 = arrs._l ? arrs[--arrs._l] : [], t1 = '', sel = sels[i].replace( trim, '' ), m = 0, j = sel.length;
					while( j-- ){
						k = sel.charAt( j );
						if( hasParent || mParent[k] ) hasParent = 1;
						if( m == 2 && k == '!' ) hasQSAErr = 1;
						if( ( t2 = mBracket[k] ) && ( m = t2 ) == 2 ) continue;
						if( !( t2 = mEx[k] ) ) t1 = k + t1;
						if( t2 && m == 2 ) t1 = k + t1;
						else if( ( t2 = mT0[k] ) == 1 ){
							if( ( t3 = t0[t0.length - 1] ) == ' ' ) continue;
							if( t1 ) t0[t0.length] = t1, t1 = '';
							if( !mT1[t3] ) t0[t0.length] = k;
						} else if( t2 == 2 ){
							if( t1.replace( trim, '' ) ) t0[t0.length] = t1, t1 = '';
							if( t0[t0.length - 1] == ' ' ) t0.pop();
							t0[t0.length] = k;
						} else if( t2 == 3 || !j ){
							if( t1 && m < 2 ) t0[t0.length] = t1, t1 = '';
						} else if( sel.charAt( j - 1 ) == ' ' ) t0[t0.length] = t1, t1 = '';
					}
					j = t0.length;
					while( j-- ){
						if( rTag.test( t0[j] ) ) t0[j] = t0[j].toUpperCase();
						else if( t0[j].charAt( 0 ) == ':' ){
							if( !( t1 = t0[j] ).toLowerCase().indexOf( ':contains(' ) ){
								hasQSAErr = 1;
								continue;
							} else{
								t0[j] = t1;
								if( ( t1 == ':nth-child(n' || t1 == ':nth-last-child(n' ) && t0.length != 1 ){
									hasQSAErr = 1, t0.splice( j, 1 );
									continue;
								}
							}
						}
						if( isQSA && !hasQS && !mQSA[t0[j].charAt( 0 )] ) hasQS = 1;
					}
					sels[i] = t0;
				}
				if( hasQSAErr ) hasQS = 0;
				if( sels.length == 1 ){
					t0 = sels[0][0];
					if( ( k = t0.charAt( 0 ) ) == '#' ) els = arrs._l ? arrs[--arrs._l] : [], els[0] = doc.getElementById( t0.substr( 1 ) ), sels[0].shift();
					else if( k == '.' ){
						els = className( t0.substr( 1 ) ), sels[0].shift();
						if( hasQS && els.length > 100 ) return doc.querySelectorAll( query );
					} else if( k == '[' || k == ':' ){
						if( hasQS ) return doc.querySelectorAll( query );
						if( !hasParent ){
							t0 = sels[0][sels[0].length - 1], k = t0.charAt( 0 );
							if( k == '#' ) sels[0].pop(), els = arrs._l ? arrs[--arrs._l] : [], els[0] = doc.getElementById( t0.substr( 1 ) );
							else if( k == '.' ) sels[0].pop(), els = className( t0.substr( 1 ) );
							else if( rTag.test( t0 ) ) sels[0].pop(), els = tagName[t0] || ( tagName[t0] = doc.getElementsByTagName( t0 ) );
						}
					} else if( rTag.test( t0 ) ){
						sels[0].shift(), els = tagName[t0] || ( tagName[t0] = doc.getElementsByTagName( t0 ) );
						if( hasQS && els.length > 100 ) return doc.querySelectorAll( query );
					}
				}
				if( !els ) els = tagName['*'] || ( tagName['*'] = doc.getElementsByTagName( '*' ) );
				if( !sels[0].length ) return arrs[arrs._l++] = sels[0], sels.length = 0, arrs[arrs._l++] = sels, els;
				bsRseq++;
				for( i = 0, j = els.length; i < j; i++ ){
					l = sels.length;
					while( l-- ){
						el = els[i];
						for( tokens = sels[l], m = 0, n = tokens.length; m < n; m++ ){
							token = tokens[m], hit = 0;
							if( ( k = token.charAt( 0 ) ) == ' ' ){
								m++;
								while( el = el.parentNode )
									if( hit = ( ( t0 = compare[tokens[m].charAt( 0 )] ) ? t0( el, tokens[m] ) : ( tokens[m] == el.tagName || tokens[m] == '*' ) ) ) break;
							} else if( k == '>' )
								hit = ( ( t0 = compare[tokens[++m].charAt( 0 )] ) ? t0( el = el.parentNode, tokens[m] ) :
									( tokens[m] == ( el = el.parentNode ).tagName || tokens[m] == '*' ) );
							else if( k == '+' ){
								while( el = el[aPsibl[isElCld]] ) if( ( isElCld ? 1 : el.nodeType == 1 ) ) break;
								hit = el && ( ( t0 = compare[tokens[++m].charAt( 0 )] ) ? t0( el, tokens[m] ) : ( tokens[m] == el.tagName || tokens[m] == '*' ) );
							} else if( k == '~' ){
								m++;
								while( el = el[aPsibl[isElCld]] ){
									if( ( isElCld ? 1 : el.nodeType == 1 ) && ( ( t0 = compare[tokens[m].charAt( 0 )] ) ? t0( el, tokens[m] ) : ( tokens[m] == el.tagName || tokens[m] == '*' ) ) ){
										hit = 1;
										break;
									}
								}
							} else hit = ( ( t0 = compare[token.charAt( 0 )] ) ? t0( el, token ) : ( token == el.tagName || token == '*' ) );
							if( !hit ) break;
						}
						if( i == j - 1 ) tokens.length = 0, arrs[arrs._l++] = tokens;
						if( hit ) break;
					}
					if( i == j - 1 ) sels.length = 0, arrs[arrs._l++] = sels;
					if( hit ) r[r.length] = els[i];
				}
				return r;
			};
		}, dk.query = query = bsSelector( document, /^\s*|\s*$/g );
// detector
	dk.static( 'DETECTOR', (function() {
		var navi = W.navigator, agent = navi.userAgent.toLowerCase(), platform = navi.platform.toLowerCase(), app = navi.appVersion.toLowerCase(),
			device = 'pc', os, osv, browser, bv, flash,
			prefixCss, prefixStyle, transform3D, keyframe = W['CSSRule'],
			docMode = 0,
			d = DOC.createElement( 'div' ), s = d.style, c = DOC.createElement( 'canvas' ), a = DOC.createElement( 'audio' ), v = DOC.createElement( 'video' ), t0,
			ie = function() {
				if( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
				if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
				return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[1] );
			},
			chrome = function() {
				if( agent.indexOf( t0 = 'chrome' ) < 0 && agent.indexOf( t0 = 'crios' ) < 0 ) return;
				return browser = 'chrome', bv = parseFloat( ( t0 == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[1] );
			},
			firefox = function() { return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[1] ) ); },
			safari = function() { return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /safari\/([\d]+)/.exec( agent )[1] ) ); },
			opera = function() {
				var i;
				return ( agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[1] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[1] ) );
			},
			naver = function() { return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver'; };

		// win
		if( agent.indexOf( 'android' ) > -1 ){
			browser = os = 'android';
			if( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
			else device = 'mobile';
			if( t0 = /android ([\d.]+)/.exec( agent ) ) t0 = t0[1].split( '.' ), osv = parseFloat( t0[0] + '.' + t0[1] );
			else osv = 0;
			if( t0 = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( t0[1] );
			naver() || chrome() || opera() || firefox();
		} else if( agent.indexOf( t0 = 'ipad' ) > -1 || agent.indexOf( t0 = 'iphone' ) > -1 ){
			device = t0 == 'ipad' ? 'tablet' : 'mobile', browser = os = t0;
			if( t0 = /os ([\d_]+)/.exec( agent ) ) t0 = t0[1].split( '_' ), osv = parseFloat( t0[0] + '.' + t0[1] );
			else osv = 0;
			if( t0 = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( t0[1] );
			naver() || chrome() || opera() || firefox();
		} else{
			if( platform.indexOf( 'win' ) > -1 ){
				os = 'win', t0 = 'windows nt ';
				if( agent.indexOf( t0 + '5.1' ) > -1 ) osv = 'xp';
				else if( agent.indexOf( t0 + '6.0' ) > -1 ) osv = 'vista';
				else if( agent.indexOf( t0 + '6.1' ) > -1 ) osv = '7';
				else if( agent.indexOf( t0 + '6.2' ) > -1 ) osv = '8';
				else if( agent.indexOf( t0 + '6.3' ) > -1 ) osv = '8.1';
				ie() || chrome() || firefox() || safari() || opera();
			} else if( platform.indexOf( 'mac' ) > -1 ){
				os = 'mac', t0 = /os x ([\d._]+)/.exec( agent )[1].replace( '_', '.' ).split( '.' ), osv = parseFloat( t0[0] + '.' + t0[1] ),
					safari() || chrome() || firefox() || opera();
			} else{
				os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0,
					chrome() || firefox();
			}
		}
		(function() {
			var plug = navi.plugins, t0;
			if( browser == 'ie' ) try{ t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' ).GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = parseFloat( t0[0] + '.' + t0[1] ); } catch( e ){ }
			else if( ( t0 = plug['Shockwave Flash 2.0'] ) || ( t0 = plug['Shockwave Flash'] ) ) t0 = t0.description.split( ' ' )[2].split( '.' ), flash = parseFloat( t0[0] + '.' + t0[1] );
			else if( agent.indexOf( 'webtv' ) > -1 ) flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf( "webtv/2.5" ) > -1 ? 3 : 2;
		})();
		// dom
		switch( browser ){
			case'ie':
				if( bv == -1 ) bv = !c['getContext'] ? 8 : !( 'msTransition' in s ) && !( 'transition' in s ) ? 9 : c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' ) ? 11 : 10;
				prefixCss = '-ms-', prefixStyle = 'ms', transform3D = bv > 9 ? 1 : 0, docMode = DOC['documentMode'] || 0;
				break;
			case'firefox':
				prefixCss = '-moz-', prefixStyle = 'Moz', transform3D = 1;
				break;
			case'opera':
				prefixCss = '-o-', prefixStyle = 'O', transform3D = 1;
				break;
			default:
				prefixCss = '-webkit-', prefixStyle = 'webkit', transform3D = os == 'android' ? ( osv < 4 ? 0 : 1 ) : 1;
		}
		if( keyframe ){
			if( keyframe.WEBKIT_KEYFRAME_RULE ) keyframe = '-webkit-keyframes';
			else if( keyframe.MOZ_KEYFRAME_RULE ) keyframe = '-moz-keyframes';
			else if( keyframe.KEYFRAME_RULE ) keyframe = 'keyframes';
			else keyframe = null;
		}
		return {
			device: device, browser: browser, browserVer: bv, os: os, osVer: osv,
			mobile: device == 'pc' ? 0 : 1,
			flash: flash,
			prefixCss: prefixCss, prefixStyle: prefixStyle,
			transform3D: transform3D, transform: ( prefixStyle + 'Transform' in s || 'transform' in s ) ? 1 : 0, transition: ( prefixStyle + 'Transition' in s || 'transition' in s ) ? 1 : 0,
			keyframe: keyframe ? 1 : 0,
			canvas: c ? 1 : 0, canvasText: c && c['getContext'] && c.getContext( '2d' ).fillText ? 1 : 0,
			audio: a ? 1 : 0, video: v ? 1 : 0,
			videoPoster: v && 'poster' in v ? 1 : 0,
			videoWebm: v && v['canPlayType'] && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			videoH264: v && v['canPlayType'] && v.canPlayType( 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			videoTeora: v && v['canPlayType'] && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			insertBefore: 'insertBefore' in d ? 1 : 0,
			innerText: 'innerText' in d ? 1 : 0, textContent: 'textContent' in d ? 1 : 0,
			touchBool: 'ontouchstart' in W ? 1 : 0,
			currentTarget: browser == "firefox" ? "target" : "srcElement",
			wheelEvent: browser == "firefox" ? "DOMMouseScroll" : "mousewheel",
			isLocalhost: location.host.indexOf( "localhost" ) < 0 ? 0 : 1
		}
	})() ),

// EVENT :
		fn( 'addEvent', (function() {
			var map = {down: dk.DETECTOR.mobile ? 'touchstart' : 'mousedown', up: dk.DETECTOR.mobile ? 'touchend' : 'mouseup'}
			return function() {
				var arg = arguments, t0, t1 = arg[1];
				(t0 = arg[0].addEventListener) ? t0( (t1 = map[arg[1]] ? map[arg[1]] : arg[1]), arg[2] ) : W.attachEvent( 'on' + t1, arg[2] )
			}
		})() ),
		fn( 'dkEvent', (function() {
			var t = dk.DETECTOR.currentTarget
			return function dkEvent() {
				var e = arguments[0]
				this.nativeEvent = e, this.keyCode = e.keyCode, this.target = e[t]
				//TODO  여기다가 우리 이벤트를 정의합니다.
				//TODO 사실 이건 팩토리가 도입되어 풀링처리를 해야됨
			}
		})() ),
// FNS :
		(function() {
			// TODO 아좍스 이건 주말에 팜... 심도깊게 고민해야겠군 -_-;;
			var checkXMLHttp = (function() {
					var t = "MSXML2.XMLHTTP.5.0,MSXML2.XMLHTTP.4.0,MSXML2.XMLHTTP.3.0,MSXML2.XMLHTTP,Microsoft.XMLHTTP".split( ',' ), i = 0, j = t.length
					if( W['XMLHttpRequest'] ) return function() {return new W['XMLHttpRequest']}
					while( i < j ) if( new ActiveXObject( t[i++] ) ) return function() { new ActiveXObject( t[i] )}
				})(),
				ajax = function( callback, url/*paramK,paramV*/ ) {
					var rq = checkXMLHttp(), pK, pV, params, arg = arguments, i = 2, j = arg.length, k, v
					for( i = 2; i < j; i++ ){
						k = arg[i++], v = arg[i]
						pK = encodeURIComponent( k ), pV = encodeURIComponent( v ),
//                      console.log(pK,pV),
						params ? (params += "&" + pK + "=" + pV) : (params = '?' + pK + "=" + pV)
					}
					rq.open( 'GET', url + (params ? params : ''), true ),
//					console.log( params ),
					rq.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8" ),
					rq.onreadystatechange = function() {if( rq.readyState == 4 ) rq.status == 200 ? (rq.onreadystatechange = null, callback ? (callback( rq.responseText )) : 0) : 0},
					rq.send( null )
				},
				js = function( callBack, url ) {
					var t = DOC.createElement( 'script' ), funcName, t0
					callBack ? (t0 = url.charAt( url.length - 1 ), funcName = /function\s([^(]{1,})\(/.exec( callBack.toString() )[1]) : 0
					t.type = 'text/javascript', t.charset = 'utf-8', t.src = url + (t0 == '=' ? funcName : ''), HEAD.appendChild( t )
					if( t0 != '=' ) t.onreadystatechange = function() {
						if( t.readyState == "loaded" || t.readyState == "complete" ) t.onreadystatechange = null, callBack ? callBack() : 0
					}
				};
			fn( 'get', ajax ), fn( 'js', function( callBack, url ) {
				var i = 1, j = arguments.length, len = j - 1
				while( i < j ) js( i == len ? callBack : 0, arguments[i++] )
			} )
		})(),
		fn( 'sList', (function() {
			function dkList() {
				this.list = {}, this.name = arguments[0]
				this.update = arguments[1] ? function() {
					var k, t = this.list
					for( k in t ) t[k]()
				} : 0
			}
			dkList.prototype = {
				S: function() {
					var i = 0, j = arguments.length, k, v;
					while( i < j ){
						k = arguments[i++];
						if( i == j ){
							if( k == 'this' ) return this;
							else if( k == 'list' ) return this.list;
							return typeof this[k] == 'function' ? this[k]() : this.list[k]
						}
						else{
							v = arguments[i++]
							if( v === null ) delete this[k];
							typeof this[k] == 'function' ? this[k]( v ) : this.list[k] = v
						}
					}
					return v;
				}
			}
			return function( k, update ) { return new dkList( k, update )}
		})() ),
// OBJS :
		// 매니저 관련정의
		dk.static( 'KEY', (function() {
			var r = dk.sList( 'KEY', 0 ), ev = dk.dkEvent, list = r.list, t0 = {}, t3 = {}, t1 = ("BACKSPACE,8,TAB,9,ENTER,13,SHIFT,16,CTRL,17,ALT,18,PAUSE,19,CAPSLOCK,20,ESC,27," + "PAGE_UP,33,PAGE_DOWN,34,END,35,HOME,36,LEFT_ARROW,37,UP_ARROW,38,RIGHT_ARROW,39,DOWN_ARROW,40,INSERT,45,DELETE,46," + "0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57,A,65,B,66,C,67,D,68,E,69,F,70,G,71,H,72,I,73,J,74,K,75,L,76,M,77,N,78,O,79,P,80,Q,81,R,82,S,83,T,84,U,85,V,86,W,87,X,88,Y,89,Z,90," + "NUMPAD_0,96,NUMPAD_1,97,NUMPAD_2,98,NUMPAD_3,99,NUMPAD_4,100,NUMPAD_5,101,NUMPAD_6,102,NUMPAD_7,103,NUMPAD_8,104,NUMPAD_9,105," + "'*',106,'+',107,'-',109,'.',110,'/',111,'=',187,COMA,188,'SLASH',191,'BACKSLASH',220," + "F1,112,F2,113,F3,114,F4,115,F5,116,F6,117,F7,118,F8,119,F9,120,F10,121,F11,122,F12,123").split( "," ), i = t1.length
			while( i-- ) t3[t1[i--]] = t1[i].toLowerCase(), t0[t1[i].toLowerCase()] = 0
			dk.addEvent( W, 'keydown', function() {
					var t = new ev( arguments[0] )
					list[t3[t.keyCode]] ? list[t3[t.keyCode]]( t ) : 0
				}
			)
			return r
		})() ),
		dk.static( 'LOOP', (function() {
			var r = dk.sList( 'LOOP', 1 );
			(function loop() { r['update'](), requestAnimFrame( loop )})();
			return r
		})() ),
		dk.static( 'WIN', (function() {
			return {
				RESIZE: (function() {
					var r = dk.sList( 'RESIZE', 1 )
					dk.addEvent( W, 'resize', function() { r['update'].call( r ) } )
					return r
				})()
			}
		})() )
})();