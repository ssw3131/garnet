/**
 * Created by ssw on 2014-06-17.
 */
(function(){
    var W = window, Doc = document;
    if( W.log ) return W.log( "DkGl : log가 이미 존재합니다." );
    var log, logArr = [], jcJoin = Array.prototype.join, e0, e1, toggle, x = 710, y = 10, w = 800;

    e0 = Doc.createElement( "div" ),
        e0.style.cssText = "left : " + x + "px; top : " + ( y + 22 ) + "px; width : " + w + "px; height : 90%; " +
            "position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
        e1 = Doc.createElement( "div" ),
        e1.style.cssText = "left : " + x + "px; top : " + y + "px; width : " + ( w + 10 ) + "px; height : 20px; " +
            "position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",

        W.log = log = (function(){
            return function(){
                var a = arguments, str;
                if( a.length > 1 )
                    str = jcJoin.call( a, ',' ), logArr.splice( 0, 0, str ), console.log( str );
                else
                    logArr.splice( 0, 0, a[ 0 ] ), console.log( a[ 0 ] );
                toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
            }
        })(),

        log.show = function(){
            var body = Doc.body;
            e0.innerHTML = jcJoin.call( logArr, "<br>" ), body.appendChild( e0 ), body.appendChild( e1 ), toggle = true;
        },

        log.hide = function(){
            var body = Doc.body;
            body.removeChild( e0 ), body.removeChild( e1 ), toggle = false;
        },

        log.position = function( $left, $top, $width ){
            if( $left ) e0.style.left = $left + "px", e1.style.left = $left + "px";
            if( $top ) e0.style.top = $top + 22 + "px", e1.style.top = $top + "px";
            if( $width ) e0.style.width = $width + "px", e1.style.width = $width + 10 + "px";
        }
})()