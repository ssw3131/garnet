/**
 * Created by sewon on 2014-08-21.
 */
"use strict";
(function () {
	var W = window, DOC = document
	var dk, fn
	var trim = /^\s*|\s*$/g;

	if ( !W['console'] ) W['console'] = {log: function () {}}
	W.requestAnimFrame = (function () {return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function ( loop ) {W.setTimeout( loop, 17 )}})();

// core
	W.dk = dk = { info: { name: 'Dk garnet', ver: 'v0.2.0', url: 'https://github.com/ssw3131/garnet' } },
	fn = dk['fn'] = function ( k, v ) { dk[k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length )] = v},
	fn['cls'] = function ( k, v ) { k = k.replace( trim, '' ).toLowerCase(), dk[k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length )] = v},
	fn['obj'] = function ( k, v ) {dk[k.replace( trim, '' ).toUpperCase()] = v},

// detector
	fn.obj( 'DETECTOR', (function () {
		var navi = W.navigator, agent = navi.userAgent.toLowerCase(), platform = navi.platform.toLowerCase(), app = navi.appVersion.toLowerCase(),
			device = 'pc', os, osv, browser, bv, flash,
			prefixCss, prefixStyle, transform3D, keyframe = W['CSSRule'],
			docMode = 0,
			d = DOC.createElement( 'div' ), s = d.style,
			c = DOC.createElement( 'canvas' ), a = DOC.createElement( 'audio' ), v = DOC.createElement( 'video' ), t0,
			ie = function () {
				if ( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
				if ( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
				return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[1] );
			},
			chrome = function () {
				if ( agent.indexOf( t0 = 'chrome' ) < 0 && agent.indexOf( t0 = 'crios' ) < 0 ) return;
				return browser = 'chrome', bv = parseFloat( ( t0 == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[1] );
			},
			firefox = function () { return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[1] ) ); },
			safari = function () { return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /safari\/([\d]+)/.exec( agent )[1] ) ); },
			opera = function () {
				var i;
				return ( agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[1] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[1] ) );
			},
			naver = function () { return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver'; };

		// win
		if ( agent.indexOf( 'android' ) > -1 ) {
			browser = os = 'android';
			if ( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
			else device = 'mobile';
			if ( t0 = /android ([\d.]+)/.exec( agent ) ) t0 = t0[1].split( '.' ), osv = parseFloat( t0[0] + '.' + t0[1] );
			else osv = 0;
			if ( t0 = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( t0[1] );
			naver() || chrome() || opera() || firefox();
		} else if ( agent.indexOf( t0 = 'ipad' ) > -1 || agent.indexOf( t0 = 'iphone' ) > -1 ) {
			device = t0 == 'ipad' ? 'tablet' : 'mobile', browser = os = t0;
			if ( t0 = /os ([\d_]+)/.exec( agent ) ) t0 = t0[1].split( '_' ), osv = parseFloat( t0[0] + '.' + t0[1] );
			else osv = 0;
			if ( t0 = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( t0[1] );
			naver() || chrome() || opera() || firefox();
		} else {
			if ( platform.indexOf( 'win' ) > -1 ) {
				os = 'win', t0 = 'windows nt ';
				if ( agent.indexOf( t0 + '5.1' ) > -1 ) osv = 'xp';
				else if ( agent.indexOf( t0 + '6.0' ) > -1 ) osv = 'vista';
				else if ( agent.indexOf( t0 + '6.1' ) > -1 ) osv = '7';
				else if ( agent.indexOf( t0 + '6.2' ) > -1 ) osv = '8';
				else if ( agent.indexOf( t0 + '6.3' ) > -1 ) osv = '8.1';
				ie() || chrome() || firefox() || safari() || opera();
			} else if ( platform.indexOf( 'mac' ) > -1 ) {
				os = 'mac',
					t0 = /os x ([\d._]+)/.exec( agent )[1].replace( '_', '.' ).split( '.' ),
					osv = parseFloat( t0[0] + '.' + t0[1] ),
					safari() || chrome() || firefox() || opera();
			} else {
				os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0,
					chrome() || firefox();
			}
		}
		(function () {
			var plug = navi.plugins, t0;
			if ( browser == 'ie' ) try{
				t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' ).GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = parseFloat( t0[0] + '.' + t0[1] );
			} catch ( e ){
			}
			else if ( ( t0 = plug['Shockwave Flash 2.0'] ) || ( t0 = plug['Shockwave Flash'] ) ) t0 = t0.description.split( ' ' )[2].split( '.' ), flash = parseFloat( t0[0] + '.' + t0[1] );
			else if ( agent.indexOf( 'webtv' ) > -1 ) flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf( "webtv/2.5" ) > -1 ? 3 : 2;
		})();

		// dom
		switch ( browser ){
			case'ie':
				if ( bv == -1 ) bv = !c['getContext'] ? 8 : !( 'msTransition' in s ) && !( 'transition' in s ) ? 9 : c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' ) ? 11 : 10;
				prefixCss = '-ms-', prefixStyle = 'ms';
				transform3D = bv > 9 ? 1 : 0;
				docMode = DOC['documentMode'] || 0;
				break;
			case'firefox':
				prefixCss = '-moz-', prefixStyle = 'Moz';
				transform3D = 1;
				break;
			case'opera':
				prefixCss = '-o-', prefixStyle = 'O';
				transform3D = 1;
				break;
			default:
				prefixCss = '-webkit-', prefixStyle = 'webkit';
				transform3D = os == 'android' ? ( osv < 4 ? 0 : 1 ) : 1;
		}
		if ( keyframe ) {
			if ( keyframe.WEBKIT_KEYFRAME_RULE ) keyframe = '-webkit-keyframes';
			else if ( keyframe.MOZ_KEYFRAME_RULE ) keyframe = '-moz-keyframes';
			else if ( keyframe.KEYFRAME_RULE ) keyframe = 'keyframes';
			else keyframe = null;
		}
		return {
			device: device,
			browser: browser, browserVer: bv,
			os: os, osVer: osv,
			flash: flash,
			prefixCss: prefixCss, prefixStyle: prefixStyle,
			transform3D: transform3D, transform: ( prefixStyle + 'Transform' in s || 'transform' in s ) ? 1 : 0,
			transition: ( prefixStyle + 'Transition' in s || 'transition' in s ) ? 1 : 0, keyframe: keyframe ? 1 : 0,
			canvas: c ? 1 : 0, canvasText: c && c['getContext'] && c.getContext( '2d' ).fillText ? 1 : 0,
			audio: a ? 1 : 0,
			video: v ? 1 : 0,
			videoPoster: v && 'poster' in v ? 1 : 0,
			videoWebm: v && v['canPlayType'] && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			videoH264: v && v['canPlayType'] && v.canPlayType( 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			videoTeora: v && v['canPlayType'] && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			insertBefore: 'insertBefore' in d ? 1 : 0,

			// todo touchBool
			touchBool: W.ontouchstart !== undefined,
			innerText: 'innerText' in d ? 'innerText' : 'textContent',
			currentTarget: browser == "firefox" ? "target" : "srcElement",
			wheelEvent: browser == "firefox" ? "DOMMouseScroll" : "mousewheel",
			isLocalhost: location.host.indexOf( "localhost" ) < 0 ? false : true
		}
	})() )

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