;
(function(){
    var W = window, DOC = document;
    var log, logArr = [], el, s, toggle;

    el = DOC.createElement( "div" ), s = el.style,
        s.cssText = "left : 700px; top : 10px; width : 800px; height : 90%; position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움; color : #FFF; opacity : 0.8; z-index : 10000000;",

        W.log = log = (function(){
            if( W[ "console" ] !== undefined )
                return function( $log ){
                    logArr.splice( 0, 0, $log, console.log( $log ) ), toggle ? el.innerHTML = logArr[ 0 ] + "<br>" + el.innerHTML : null;
                }
            else
                return function( $log ){
                    logArr.splice( 0, 0, $log ), toggle ? el.innerHTML = logArr[ 0 ] + "<br>" + el.innerHTML : null;
                }
        })(),

        log.show = (function(){
            var jcJoin = Array.prototype.join;
            return function(){
                var body = DOC.body;
                if( body ) el.innerHTML = jcJoin.call( logArr, "<br>" ), body.appendChild( el ), toggle = true;
            }
        })(),

        log.hide = function(){
            var body = DOC.body;
            if( body ) body.removeChild( el ), toggle = false;
        },

        log.position = function( $prop ){
            if( $prop.left !== undefined ) s.left = $prop.left + "px";
            if( $prop.top !== undefined ) s.top = $prop.top + "px";
            if( $prop.width !== undefined ) s.width = $prop.width + "px";
            if( $prop.height !== undefined ) s.height = $prop.height + "px";
        },

        log.show();
})();