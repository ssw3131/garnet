/**
 * Created by ssw on 2014-06-17.
 */
(function(){
    var W = window, DOC = document;
//    if( W.log ) return W.log( "Dk : log가 이미 존재합니다." );
    var log, logArr = [], jcJoin = Array.prototype.join, e0, e1, es0, es1, toggle, x = 710, y = 10, w = 800;

    e0 = DOC.createElement( "div" ), es0 = e0.style,
        es0.cssText = "left : " + x + "px; top : " + ( y + 22 ) + "px; width : " + w + "px; height : 90%; position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
        e1 = DOC.createElement( "div" ), es1 = e1.style,
        es1.cssText = "left : " + x + "px; top : " + y + "px; width : " + ( w + 10 ) + "px; height : 20px; position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",

        W.log = log = (function(){
            if( ( W[ "console" ] ) )
                return function( $log ){
                    //logArr.splice( 0, 0, $log, console.log( $log ) ), toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                    e0.innerHTML = $log
                }
            else
                return function( $log ){
                    logArr.splice( 0, 0, $log ), toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                }
        })(),

        log.show = function(){
            var body = DOC.body;
            e0.innerHTML = jcJoin.call( logArr, "<br>" ), body.appendChild( e0 ), body.appendChild( e1 ), toggle = true;
        },

        log.hide = function(){
            var body = DOC.body;
            body.removeChild( e0 ), body.removeChild( e1 ), toggle = false;
        },

        log.position = function( $left, $top, $width ){
            if( $left !== undefined ) es0.left = $left + "px", es1.left = $left + "px";
            if( $top !== undefined ) es0.top = $top + 22 + "px", es1.top = $top + "px";
            if( $width !== undefined ) es0.width = $width + "px", es1.width = $width + 10 + "px";
        },

		log.show()
})()