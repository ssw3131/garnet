/**
 * Created by ssw on 14. 4. 3.
 */
"use strict";

(function(){
    var W = window, Doc = document, Head = Doc.getElementsByTagName( "head" )[ 0 ], Dk, Detector, _core, _util, _prototype;

    //----------------------------------------------------------------------------------------------------------------------------------------------//
    // Dk
    Dk = W.Dk = { Information : { name : "Dk garnet", version : "v0.1.0", contact : "ssw3131@daum.net" } },

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
            Date.now = Date.now * 1 || function(){ return +new Date; }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Detector
        // todo 외부연동
        (function(){
            var navigator = W.navigator, agent = navigator.userAgent.toLowerCase(), platform = navigator.platform,
                browser , browserVersion, os, osVersion,
                userLanguage = navigator.userLanguage, systemLanguage = platform.systemLanguage,
                cssPrefix , stylePrefix, transform3D, transition,
                flash = 0, flashVersion;

            function regTest( $regExp, $testStr ){
                return  $regExp.test( $testStr )
            }

            checkBrowser(), checkDesktopOs(), checkPrefix()
            function checkBrowser(){
                var finded;

                function isMobile(){
                    if( regTest( /mobile/, agent ) ) return "mobile "
                    else return ""
                }

                function ie(){
                    finded = regTest( /msie/, agent )
                    if( !finded && agent.indexOf( 'trident' ) ) return browser = isMobile() + "ie" , browserVersion = 11, finded
                    else if( finded ) return browser = isMobile() + "ie" , browserVersion = /msie ([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                /*function chrome(){
                 var r2 = regTest( /crios/, agent )
                 finded = regTest( /chrome/, agent )
                 if( finded || r2 ) return browser = isMobile() + "chrome", browserVersion = /chrome\/([\d]+\.[\d]+)/.exec( agent )[1], finded || r2
                 }*/

                function chrome(){
                    var i;
                    if( agent.indexOf( i = 'chrome' ) < 0 && agent.indexOf( i = 'crios' ) < 0 ) return;
                    return browser = 'chrome', browserVersion = parseFloat( ( i == 'chrome' ? /chrome\/([\d]+)/ : /webkit\/([\d]+)/ ).exec( agent )[1] )
                }

                function firefox(){
                    finded = regTest( /firefox/, agent )
                    if( finded ) return    browser = isMobile() + "firefox", browserVersion = /firefox\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                function opera(){
                    finded = regTest( /opr/, agent )
                    if( finded ) return browser = isMobile() + "opera", browserVersion = /opr\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                function safari(){
                    finded = regTest( /safari/, agent )
                    if( finded ) return browser = isMobile() + "safari", browserVersion = /safari\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                return ie() || opera() || chrome() || firefox() || safari();
            }

            function checkDesktopOs(){
                function checkWindow(){
                    var result = regTest( /windows nt/, agent );
                    if( result ){
                        os = "windows";
                        switch( /windows nt ([\d]+\.?[\d]+)/.exec( agent )[1] ){
                            case "6.2" :
                                osVersion = 8;
                                break;
                            case "6.1" :
                                osVersion = 7;
                                break;
                            case "6.2" :
                                osVersion = 5.1;
                                break;
                        }
                    }
                }

                function checkMac(){
                    // test Case - IOS일떄 강제로 박아서 테스트
                    //var platform = "MacIntel".toLowerCase()
                    //var agent = "5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.17 (KHTML, like Gecko) Version/6.0.2 Safari/536.26.17".toLowerCase()
                    if( platform.indexOf( 'mac' ) > -1 ){
                        os = 'mac';
                        var result = /os x ([\d._]+)/.exec( agent )[1].replace( '_', '.' ).split( '.' );
                        osVersion = parseFloat( result[0] + '.' + result[1] );
                    }
                }

                return checkWindow() || checkMac()
            }

            function checkPrefix(){
                switch( browser ){
                    case'ie':
                        cssPrefix = '-ms-', stylePrefix = 'ms', transform3D = browserVersion > 9 ? 1 : 0, transition = browserVersion > 8 ? 1 : 0
                        break;
                    case'firefox':
                        cssPrefix = '-moz-', stylePrefix = 'Moz', transition = transform3D = 1
                        break;
                    case'opera':
                        cssPrefix = '-o-', stylePrefix = 'O', transform3D = 0, transition = 1
                        break;
                    default:
                        cssPrefix = '-webkit-', stylePrefix = 'webkit', transform3D = os == 'android' && osVersion < 4 ? 0 : 1, transition = 1
                }
            }

            checkFlash();
            function checkFlash(){
                var t
                if( browser == "ie" ){
                    t = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' );
                    if( t ) t = t.GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = 1, flashVersion = parseFloat( t[0] + '.' + t[1] );
                } else {
                    t = navigator.plugins;
                    if( t['Shockwave Flash 2.0'] || t['Shockwave Flash'] ){
                        if( t['Shockwave Flash 2.0'] ) t = t['Shockwave Flash 2.0']; else t = t['Shockwave Flash'];
                        t = t.description.split( ' ' )[2].split( '.' ), flash = 1, flashVersion = parseFloat( t[0] + '.' + t[1] );
                    }
                }
            }

            var video = Doc.createElement( "video" ), testDIV = Doc.createElement( "div" )
            Dk.Detector = Detector = {
                agent : agent, navigator : navigator, platform : platform,
                browser : browser, browserVersion : browserVersion,
                os : os, osVersion : osVersion,
                userLanguage : userLanguage, systemLanguage : systemLanguage,
                prefixCss : cssPrefix, prefixStyle : stylePrefix,
                transform3D : transform3D, transition : transition,
                addEventListener : Doc.addEventListener ? 1 : 0,
                attachEvent : Doc.attachEvent ? 1 : 0,
                insertBefore : testDIV.insertBefore ? 1 : 0,
//				XMLHttp          : checkXMLHttp(),
                isMobile : browser.indexOf( "mobile" ) > -1 ? 1 : 0,
                touchBool : W.ontouchstart !== undefined,
                videoOgg : video.canPlayType && video.canPlayType( 'video/ogg' ) ? 1 : 0,
                videoH264 : video.canPlayType && video.canPlayType( 'video/mp4' ) ? 1 : 0,
                videoWebm : video.canPlayType && video.canPlayType( 'video/webm' ) ? 1 : 0,
                flash : flash, flashVersion : flashVersion,
                innerText : browser == "firefox" ? 0 : 1,
                currentTarget : (browser == 'firefox') ? 'target' : 'srcElement',
                wheelEvent : (browser == "firefox") ? "DOMMouseScroll" : "mousewheel"
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // 보정패치 splice
        (function(){
            // todo 기능테스트
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
                replaceEventType : cRet = ( dtt.touchBool ) ? { mousedown : "touchstart", mousemove : "touchmove", mouseup : "touchend" } : {},

                // addEvent
                addEvent : (function(){
                    if( dtt.touchBool ){
                        if( dtt.addEventListener )
                            return function( $e, $et, $cb ){
                                if( $et == "mouseover" || $et == "mouseout" ) return;
                                $et = cRet[ $et ] ? cRet[ $et ] : $et,
                                    $e.addEventListener( $et, $cb );
                            }
                    } else {
                        if( dtt.addEventListener )
                            return function( $e, $et, $cb ){
                                $e.addEventListener( $et, $cb );
                            }
                        else if( dtt.attachEvent )
                            return function( $e, $et, $cb ){
                                $e.attachEvent( "on" + $et, $cb ); // ie8 이하 capture 불가능
                            }
                    }
                })(),

                // delEvent
                delEvent : (function(){
                    if( dtt.touchBool ){
                        if( dtt.addEventListener )
                            return function( $e, $et, $cb ){
                                if( $et == "mouseover" || $et == "mouseout" ) return;
                                $et = cRet[ $et ] ? cRet[ $et ] : $et,
                                    $e.removeEventListener( $et, $cb );
                            }
                    } else {
                        if( dtt.addEventListener )
                            return function( $e, $et, $cb ){
                                $e.removeEventListener( $et, $cb );
                            }
                        else if( dtt.attachEvent )
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
                                $d.element.complete ? clearInterval( t0 ) : null, $cb( $d );
                            }, 16 );
                        }
                    else
                        return function( $d, $cb ){
                            $d.element.onload = function(){ $cb( $d ); }
                        }
                })(),

                // ad manager
                adManager : function( $sF, $eF ){
                    return (function(){
                        var list = [], total = 0;

                        return {
                            add : function( $k, $v ){
                                if( list[ $k ] == undefined )
                                    return list[ list[ $k ] = list.length ] = { key : $k, value : $v },
                                            ++total == 1 ? $sF() : null,
                                        true;
                                else return false; //trace( "Dk : list에 이미 " + $k + "값이 존재합니다." )
                            },

                            del : function( $k ){
                                // if( list[ $k ] == undefined ) return trace( "Dk : list에 " + $k + "값이 존재하지 않습니다." );
                                if( list[ $k ] == undefined ) return;
                                var t0 = list[ $k ], k;
                                list.splice( t0, 1 ), delete list[ $k ];
                                for( k in list ) list[ k ] >= t0 ? list[ k ] -= 1 : null;
                                --total ? null : $eF();
                            },

                            getList : function(){ return list; }
                        }
                    })()
                },

                // 객체의 타입이 맞는지 체크
                // todo is 확장
                is : (function(){
                    var t0 = { "array" : "[object Array]", "function" : "[object Function]", "string" : "[object String]", "number" : "[object Number]", "object" : "[object Object]" };
                    return function( $t, $o ){ return $o !== undefined && $o !== null && t0[ $t ] === cTs.call( $o ); }
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
                    var t0 = uRir, rd = function(){ return t0( 256 ) };
                    return function(){
                        return "rgb(" + rd() + ", " + rd() + ", " + rd() + ")";
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
        // log
        (function(){
            var log, logArr = [], cr = _core, cJoin = cr.join, cTe = cr.throwError, t0, t1, t2;
            if( W.log ) return cTe( "log가 이미 존재합니다." );

            t0 = Doc.createElement( "div" ),
                t0.style.cssText = "left : 710px; top : 32px; width : 800px; height : 90%; " +
                    "position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
                t1 = Doc.createElement( "div" ),
                t1.style.cssText = "left : 710px; top : 10px; width : 810px; height : 20px; " +
                    "position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
                t1.innerHTML = "Keyboard F8 key press : toggle",

                W.log = log = (function(){
                    if( (W["console"]) )
                        return function(){
                            var a = arguments, str;
                            if( a.length > 1 )
                                str = cJoin.call( a, ',' ), logArr.splice( 0, 0, str ), console.log( str );
                            else
                                logArr.splice( 0, 0, a[ 0 ] ), console.log( a[ 0 ] );
                            t2 ? t0.innerHTML = logArr[ 0 ] + "<br>" + t0.innerHTML : null;
                        }
                    else
                        return function(){
                            var a = arguments, str;
                            if( a.length > 1 )
                                str = cJoin.call( a, ',' ), logArr.splice( 0, 0, str );
                            else
                                logArr.splice( 0, 0, a[ 0 ] );
                            t2 ? t0.innerHTML = logArr[ 0 ] + "<br>" + t0.innerHTML : null;
                        }
                })(),

                cr.addEvent( Doc, "keydown", function( $e ){ $e.keyCode == 119 ? t2 ? log.hide() : log.show() : null; } ),// F8

                log.show = function(){
                    var body = Doc.body;
                    t0.innerHTML = cJoin.call( logArr, "<br>" ), body.appendChild( t0 ), body.appendChild( t1 ), t2 = true;
                },

                log.hide = function(){
                    var body = Doc.body;
                    body.removeChild( t0 ), body.removeChild( t1 ), t2 = false;
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
                i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                while( i-- )
                    v = a[ i-- ], k = a[ i ],
                        Dk[ k ] ? cTe( "Dk : 제공된 " + k + "가 기존에 존재합니다." ) : Dk[ k ] = v;
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // init
        (function(){
            Dk.init = Detector.addEventListener ? function( $callBack ){
                _core.addEvent( Doc, "DOMContentLoaded", function(){
                    $callBack();
                } );
            } : function( $callBack ){
                var t0;
                t0 = function(){
                    switch( Doc.readyState ){
                        case"complete":
                        case"interactive":
                        case"loaded":
                            if( Doc && Doc.getElementsByTagName && Doc.getElementById && Doc.body ) $callBack();
                            break;
                        default:
                            setTimeout( t0, 10 );
                    }
                }, t0();
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
                    ++cc == nc ? $callBack() : null;
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
            var property, tree, event, dtt = Detector, cr = _core, cIs = cr.is, cRet = cr.replaceEventType, cAe = cr.addEvent, cDe = cr.delEvent, cOl = cr.onload, cTe = cr.throwError,
                pc = dtt.prefixCss, npx = { opacity : true, zIndex : true, "z-index" : true };

            // property
            (function(){
                property = {
                    scrollWidth : function(){ return this.element.scrollWidth; },
                    scrollHeight : function(){ return this.element.scrollHeight; }
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
                            if( self.parent == body )
                                $parent.tr( "addChild", self );
                            else
                                self.parent ? self.parent.tr( "removeChild", self ) : null,
                                    self.parent = $parent,
                                        $parent == body ? $parent.appendChild( self.element ) : $parent.tr( "addChild", self );
                            return self;
                        },

                        // 부모객체에 자식객체 제거
                        removeParent : function( $parent ){
                            var self = this, body = Doc.body;
                            self.parent == $parent ? null : cTe( "Dk : 제공된 parent는 호출자의 부모이어야 합니다." );
                            if( $parent == body )
                                self.parent = null, $parent.removeChild( self.element );
                            else
                                $parent.tr( "removeChild", self );
                            return self;
                        },

                        // 자식객체 추가
                        addChild : function( $child ){
                            var self = this;
                            $child.parent ? $child.parent.tr( "removeChild", $child ) : null,
                                $child.parent = self, self.children.push( $child ),
                                self.element.appendChild( $child.element );
                            return self;
                        },

                        // 자식객체 해당 인덱스에 추가
                        addChildAt : function( $child, $index ){
                            var self = this, e = self.element, t0 = self.children, i = t0.length, t1 = $child.element, t2;
                            $index < 0 ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : $index = $index > i ? i : $index,
                                $child.parent ? $child.parent.tr( "removeChild", $child ) : null,
                                $child.parent = self,
                                t2 = t0.splice( $index ), t0.push( $child ), t0 = self.children = t0.concat( t2 ),
                                ( $index >= i ) ? e.appendChild( t1 ) : e.insertBefore( t1, t0[ ++$index ].element );
                            return self;
                        },

                        // 해당 인덱스의 객체 반환
                        getChildAt : function( $index ){
                            var self = this, t0 = self.children, i = t0.length;
                            $index < 0 || $index >= i ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : null;
                            return t0[ $index ];
                        },

                        // 해당 객체의 인덱스 반환
                        getChildIndex : function( $child ){
                            $child ? null : cTe( "Dk : 제공된 파라미터 값이 존재하지 않습니다." );
                            var self = this, t0 = self.children, i = t0.length;
                            while( i-- ) if( $child == t0[ i ] ) return i;
                            cTe( "Dk : 제공된 child는 호출자의 자식이어야 합니다." );
                        },

                        // 자식객체 제거
                        removeChild : function( $child ){
                            var self = this, t0 = self.children, i = t0.length;
                            $child.parent == self ? null : cTe( "Dk : 제공된 child는 호출자의 자식이어야 합니다." );
                            while( i-- ){
                                if( t0[ i ] == $child ){
                                    $child.parent = null, t0.splice( i, 1 ),
                                        self.element.removeChild( $child.element );
                                    break;
                                }
                            }
                            return self;
                        },

                        // 해당 인덱스의 객체 제거
                        removeChildAt : function( $index ){
                            var self = this, t0 = self.children, i = t0.length, t1;
                            $index < 0 || $index >= i ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : null,
                                t1 = t0.splice( $index, 1 ),
                                t1[ 0 ].parent = null,
                                self.element.removeChild( t1[ 0 ].element );
                            return self;
                        },

                        // 자식객체 모두 제거 or 해당 인덱스 범위 제거 (slice 개념)
                        removeChildren : function( $bIndex, $eIndex ){
                            var self = this, e = self.element, i, t0 = self.children, t1 = t0.length, t2;
                            ( $bIndex < 0 || $eIndex < 0 || $bIndex >= $eIndex || $bIndex >= t1 ) ? cTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : null,
                                ( $bIndex == undefined ) ? $bIndex = 0 : null,
                                ( $eIndex == undefined ) ? $eIndex = t1 : null,
                                t2 = t0.splice( $bIndex, $eIndex - $bIndex ),
                                i = t2.length;
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
                            et = $e.type, et == "mousedown" || et == "mouseup" || et == "mousemove" ? null : cancelBubbling( $e ),
                                r = localPosition( self ),
                                r.type = et,
                                r.currentTarget = self,
                                cb( r );
                        }
                    }

                    // 버블링 캔슬
                    function cancelBubbling( $e ){
                        if( $e.stopPropagation )
                            cancelBubbling = function( $e ){ $e.stopPropagation(); }, cancelBubbling( $e );
                        else if( W.event )
                            cancelBubbling = function(){ W.event.cancelBubble = true; }, cancelBubbling();
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
                            self.___eventList[ $k ] = cb,
                                cAe( e, $k, cb );
                        },
                        del : function( $d, $k ){
                            var self = $d, e = self.element, el = self.___eventList;
                            cDe( e, $k, el[ $k ] ),
                                delete el[ $k ];
                        }
                    }
                })(),

                Dk.prototype = _prototype = {
                    // property
                    pp : function(){
                        var self = this, pp = property, a = arguments, i = a.length, k0 = a[ 0 ];
                        if( i == 1 )
                            return pp[ k0 ] ? pp[ k0 ].call( self ) : self[ k0 ];
                        i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            self[ a[ i - 1 ] ] = a[ i-- ];
                        return self;
                    },

                    // attribute
                    atr : function(){
                        var self = this, e = self.element, a = arguments, i = a.length, k0 = a[ 0 ];
                        if( i == 1 )
                            return e[ k0 ];
                        i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            e[ a[ i - 1 ] ] = a[ i-- ];
                        return self;
                    },

                    // inline style
                    css : function(){
                        var self = this, e = self.element, s = e.style, a = arguments, i = a.length, k, v, r, t0;
                        if( i == 1 )
                            return k = a[ 0 ], r = s[ k ], t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0;
                        i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            v = a[ i-- ], k = a[ i ],
                                v = typeof v == "number" ? npx[ k ] ? v : v + "px" : v,
                                s[ pc + k ] = v, s[ k ] = v;
                        return self;
                    },

                    // styleSheet
                    st : function(){
                        var self = this, s = self.rules[ self.styleId ].style, a = arguments, i = a.length, k, v, r, t0;
                        if( i == 1 )
                            return k = a[ 0 ], r = s[ k ], t0 = parseFloat( r ), r = isNaN( t0 ) ? r : t0;
                        i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            v = a[ i-- ], k = a[ i ],
                                v = typeof v == "number" ? npx[ k ] ? v : v + "px" : v,
                                s[ pc + k ] = v, s[ k ] = v;
                        return self;
                    },

                    // tree
                    tr : function(){
                        var self = this, tr = tree, a = arguments, i = a.length, k, v, r, t0 = cIs;
                        if( i == 1 )
                            return tr[ a[ 0 ] ].call( self );
                        i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            v = a[ i-- ], k = a[ i ],
                                r = t0( "array", v ) ? tr[ k ].apply( self, v ) : tr[ k ].call( self, v );
                        return r;
                    },

                    // event
                    ev : (function(){
                        var ev = event, t0 = cOl, t1 = cRet;
                        if( dtt.touchBool )
                            return function(){
                                var self = this, a = arguments, i = a.length, k, v;
                                i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 짝수여야 합니다" ) : null;
                                while( i-- )
                                    v = a[ i-- ], k = t1[ k = a[ i ] ] ? t1[ k ] : k,
                                            k == "onload" ? t0( self, v ) : v ? ev.add( self, k, v ) : ev.del( self, k );
                                return self;
                            }
                        else
                            return function(){
                                var self = this, a = arguments, i = a.length, k, v;
                                i % 2 > 0 ? cTe( "DK : 파라미터 갯수는 짝수여야 합니다" ) : null;
                                while( i-- ){
                                    v = a[ i-- ], k = a[ i ],
                                            k == "onload" ? t0( self, v ) : v ? ev.add( self, k, v ) : ev.del( self, k );
                                }
                                return self;
                            }
                    })()
                }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // dom, style
        (function(){
            // prototype id
            (function(){
                var list, adManager, cr = _core, cTe = cr.throwError;
                list = ( adManager = cr.adManager( function(){}, function(){} ) ).getList(),

                    _prototype.id = function( $id ){
                        var self = this;
                        Doc.getElementById( $id ) ? cTe( "Dk : 제공된 id가 기존에 존재합니다." ) : adManager.add( $id, self ) ? self.element.id = $id : null;
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

                        Dom.prototype = { id : pt.id, pp : pt.pp, atr : pt.atr, css : pt.css, tr : pt.tr, ev : pt.ev },

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
            var list, timer, stats, raf, caf, update;
            list = ( Dk.Loop = _core.adManager( start, end ) ).getList(),

                raf = (function(){ return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || W.oRequestAnimationFrame || function( $loop ){ return W.setTimeout( $loop, 16 ) }; })(),
                caf = (function(){ return W.cancelAnimationFrame || W.webkitCancelAnimationFrame || W.mozCancelAnimationFrame || W.oCancelAnimationFrame || function( $id ){ W.clearTimeout( $id ); }; })()

            // function start(){ timer = setInterval( update, 16 ); }
            // function end(){ clearInterval( timer ); }

            function start(){ timer = raf( update ); }

            function end(){ caf( timer ); }

            // stats
            if( W.Stats )
                stats = new Stats(), stats.setMode( 0 ), stats.domElement.style.cssText = "position : fixed; z-index : 2; left : 0px", Doc.body.appendChild( stats.domElement ),
                    update = function(){
                        stats ? stats.begin() : null;

                        var i = list.length;
                        while( i-- ) list[ i ].value( list[ i ].key );

                        timer = raf( update );
                        stats ? stats.end() : null;
                    }
            else
                update = function(){
                    var i = list.length;
                    while( i-- ) list[ i ].value( list[ i ].key );

                    timer = raf( update );
                }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Keyboard
        (function(){
            var list, cr = _core, cAe = cr.addEvent, cDe = cr.delEvent, kco = {}, i, k, v, t0;
            i = (t0 = "a,65,b,66,c,67,d,68,e,69,f,70,g,71,h,72,i,73,j,74,k,75,l,76,m,77,n,78,o,79,p,80,q,81,r,82,s,83,t,84,u,85,v,86,w,87,x,88,y,89,z,90,back,8,tab,9,enter,13,shift,16,control,17,alt,18,pause,19,caps,20,esc,27,space,32,pageup,33,pagedown,34,end,35,home,36,left,37,up,38,right,39,down,40,insert,45,delete,46,numlock,144,scrolllock,145,0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57".split( "," )).length;
            while( i-- ) kco[ t0[ i ] ] = t0[ --i ];
            list = ( Dk.Keyboard = cr.adManager( start, end ) ).getList();

            function start(){ cAe( Doc, "keydown", update ), cAe( Doc, "keyup", update ); }

            function end(){ cDe( Doc, "keydown", update ), cDe( Doc, "keyup", update ); }

            function update( $e ){
                var i = list.length;
                while( i-- ) list[ i ].value( $e.type, kco[$e.keyCode], list[ i ].key );
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Doc
        (function(){
            var dkDoc, dtt = Detector, cr = _core, cAe = cr.addEvent, cDe = cr.delEvent, gw, gh, rm, rl, wm, wl, we = Detector.wheelEvent, oldX = 0, oldY = 0;
            Dk.Doc = dkDoc = {},

                // 도큐먼트 이벤트 리스너
                cAe( Doc, "mousedown", mouseFunc ),
                cAe( Doc, "mouseup", mouseFunc ),
                cAe( Doc, "mousemove", mouseFunc );

            // 도큐먼트 이벤트 핸들러
            function mouseFunc( $e ){
                var sl = function(){ return Doc.documentElement.scrollLeft ? Doc.documentElement.scrollLeft : Doc.body.scrollLeft },
                    st = function(){ return Doc.documentElement.scrollTop ? Doc.documentElement.scrollTop : Doc.body.scrollTop };
                if( !dtt.touchBool )
                    mouseFunc = function( $e ){
                        var mx, my, touchList = [], eTouches = $e.touches, i = eTouches.length, sl = sl(), st = st();
                        mx = eTouches[ 0 ].x, my = eTouches[ 0 ].y,
                            dkDoc.mouseX = mx, dkDoc.mouseY = my,
                            dkDoc.pageX = mx + sl, dkDoc.pageY = my + st,
                            dkDoc.moveX = mx - oldX, dkDoc.moveY = my - oldY,
                            oldX = mx, oldY = my;
                        while( i-- ) touchList[ i ] = { pageX : eTouches[ i ].x + sl, pageY : eTouches[ i ].y + st };
                        mouse.touchList = touchList;
                    }
                else
                    mouseFunc = function( $e ){
                        var mx, my;
                        mx = $e.clientX, my = $e.clientY,
                            dkDoc.mouseX = mx, dkDoc.mouseY = my,
                            dkDoc.pageX = mx + sl(), dkDoc.pageY = my + st(),
                            dkDoc.moveX = mx - oldX, dkDoc.moveY = my - oldY,
                            oldX = mx, oldY = my;
                    }
                mouseFunc( $e );
            }

            // resize
            gw = (function(){
                if( W.innerWidth )
                    return function(){ return W.innerWidth };
                else
                    return function(){ return Doc.documentElement.clientWidth };
            })(),

                gh = (function(){
                    if( W.innerHeight )
                        return function(){ return W.innerHeight };
                    else
                        return function(){ return Doc.documentElement.clientHeight };
                })(),

                dkDoc.width = gw(), dkDoc.height = gh(), rm = cr.adManager( rStart, rEnd ), dkDoc.addResize = rm.add, dkDoc.delResize = rm.del, rl = rm.getList();

            function rStart(){ cAe( W, "resize", rUpdate ); }

            function rEnd(){ cDe( W, "resize", rUpdate ); }

            function rUpdate( $e ){
                var i = rl.length;
                dkDoc.width = gw(), dkDoc.height = gh();
                while( i-- ) rl[ i ].value( rl[ i ].key );
            }

            // wheel
            wm = cr.adManager( wStart, wEnd ), dkDoc.addWheel = wm.add, dkDoc.delWheel = wm.del, wl = wm.getList();

            function wStart(){ cAe( Doc, we, wUpdate ); }

            function wEnd(){ cDe( Doc, we, wUpdate ); }

            function wUpdate( $e ){
                var i = wl.length, ev = W.event || $e, delta = ev.detail ? ev.detail < 0 ? 1 : -1 : ev.wheelDelta > 0 ? 1 : -1;
                while( i-- ) wl[ i ].value( delta, wl[ i ].key );
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // loader
        (function(){
            // XMLHttpRequest
            function getXHR(){
                var req;
                try {
                    req = new XMLHttpRequest(); // ie7 이후, 그외
                    return getXHR = function(){ return new XMLHttpRequest(); }, req;
                } catch( $e ) {
                    try {
                        req = new ActiveXObject( "Msxml2.XMLHTTP" ); // ie6
                        return getXHR = function(){ return new ActiveXObject( "Msxml2.XMLHTTP" ); }, req;
                    } catch( $e ) {
                        req = new ActiveXObject( "Microsoft.XMLHTTP" ); // ie5.5 이하
                        return getXHR = function(){ return new ActiveXObject( "Microsoft.XMLHTTP" ); }, req;
                    }
                }
            }

            // TODO json parser
            // ajax
            function ajax( $url, $cb, $dataType, $obj ){
                var url = $url, cb = $cb, dt = $dataType, t0 = $obj.type || "GET", t1 = $obj.cache == undefined ? true : $obj.cache, t2 = $obj.postParam, req = getXHR();

                // XMLHttpRequest 상태변화
                req.onreadystatechange = function(){
                    req.readyState == 4 ? req.status == 200 ?
                        cb( dt == "xml" ? req.responseXML : dt == "json" ? eval( "(" + req.responseText + ")" ) : dt == "text" ? req.responseText : null )
                        : null : null;
                }

                req.open( t0, url, true ), // XMLHttpRequest 연결
                    t1 ? null : req.setRequestHeader( "If-Modified-Since", new Date( 1970, 0, 1 ).toGMTString() ); // 캐시 사용여부

                if( t0 == "GET" )
                    req.send( null );
                else if( t0 == "POST" )
                    req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded; charset=UTF-8" ), req.send( t2 ); // TODO post 서버 405
            }

            // TODO xml parser
            function xmlParser( $data, $cb ){
                var result = { $search : function( $tag ){ return $data.getElementsByTagName( $tag ) } };

                function _parseNode( $result, $nodes ){
                    var node, name, i = $nodes.length, idx = 0, t0;
                    while( i-- ){
                        node = $nodes[idx];
                        if( node.nodeType == 1 ){
                            $result[ name = node.nodeName ] ? $result[ name ].push( {} ) : $result[ name ] = [
                                {}
                            ],
                                _parseAtt( node, $result[ name ][ $result[ name ].length - 1 ] ), _parseNode( $result[ name ][ $result[ name ].length - 1 ], $nodes[ idx ].childNodes );
                        } else if( node.nodeType == 3 || node.nodeType == 4 ){
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

            Dk.loader = {
                // text 로드
                text : function( $url, $cb, $obj ){
                    ajax( $url, $cb, "text", $obj ? $obj : {} );
                },

                // json 로드
                json : function( $url, $cb, $obj ){
                    ajax( $url, $cb, "json", $obj ? $obj : {} );
                },

                // xml 로드
                xml : function( $url, $cb, $obj ){
                    ajax( $url, function( $data ){
                        xmlParser( $data, $cb )
                    }, "xml", $obj ? $obj : {} );
                },

                // js 로드
                js : function( $arr, $callBack ){
                    var dtt = Detector, load, hd = Head, count = 0, i = $arr.length;
                    if( i == 0 ) return $callBack ? $callBack() : null, undefined;

                    load = (function(){
                        if( dtt.addEventListener )
                            return function( $url, $cb ){
                                var scr = Doc.createElement( "script" );
                                scr.type = "text/javascript", scr.charset = "utf-8", scr.src = $url, scr.onload = $cb,
                                    hd.appendChild( scr );
                            };
                        else
                            return function( $url, $cb ){
                                var scr = Doc.createElement( "script" );
                                scr.type = "text/javascript", scr.charset = "utf-8", scr.src = $url, scr.onreadystatechange = function(){
                                    if( this.readyState == "loaded" || this.readyState == "complete" ) this.onreadystatechange = null, $cb();
                                },
                                    hd.appendChild( scr );
                            };
                    })(),

                        load( $arr[ count ], complete );

                    function complete(){
                        ++count == i ? $callBack ? $callBack() : null : load( $arr[ count ], complete );
                    };
                }
            }
        })()
})();