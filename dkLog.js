/**
 * Created by ssw on 2014-06-17.
 */
(function(){
    var W = window, Doc = document;
    if( W.log ) return W.log( "DkGl : log가 이미 존재합니다." );
    var log, logArr = [], jcJoin = Array.prototype.join, e0, e1, es0, es1, toggle, x = 710, y = 10, w = 800;

    e0 = Doc.createElement( "div" ), es0 = e0.style,
        es0.cssText = "left : " + x + "px; top : " + ( y + 22 ) + "px; width : " + w + "px; height : 90%; position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
        e1 = Doc.createElement( "div" ), es1 = e1.style,
        es1.cssText = "left : " + x + "px; top : " + y + "px; width : " + ( w + 10 ) + "px; height : 20px; position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",

        W.log = log = (function(){
            if( ( W[ "console" ] ) )
                return function(){
                    var a = arguments, str;
                    a.length > 1 ? ( str = jcJoin.call( a, ',' ), logArr.splice( 0, 0, str ), console.log( str ) ) : ( logArr.splice( 0, 0, a[ 0 ] ), console.log( a[ 0 ] ) ),
                        toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                }
            else
                return function(){
                    var a = arguments, str;
                    a.length > 1 ? ( str = jcJoin.call( a, ',' ), logArr.splice( 0, 0, str )) : logArr.splice( 0, 0, a[ 0 ] ),
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
            if( $left ) es0.left = $left + "px", es1.left = $left + "px";
            if( $top ) es0.top = $top + 22 + "px", es1.top = $top + "px";
            if( $width ) es0.width = $width + "px", es1.width = $width + 10 + "px";
        }
})()

'httsdfgndklglskg~~~~~.' + 'garnet.js'