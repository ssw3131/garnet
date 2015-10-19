(function(){
    var W = window, DOC = document;
    var log, logArr = [], e0, es0, toggle;

    e0 = DOC.createElement( "div" ), es0 = e0.style,
        es0.cssText = "left : 700px; top : 10px; width : 800px; height : 90%; position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움; color : #FFF; opacity : 0.8; z-index : 10000000;",

        W.log = log = (function(){
            if( W[ "console" ] !== undefined )
                return function( $log ){
                    logArr.splice( 0, 0, $log, console.log( $log ) ), toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                }
            else
                return function( $log ){
                    logArr.splice( 0, 0, $log ), toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                }
        })(),

        log.show = (function(){
            var jcJoin = Array.prototype.join;
            return function(){
                var body = DOC.body;
                if( body ) e0.innerHTML = jcJoin.call( logArr, "<br>" ), body.appendChild( e0 ), toggle = true;
            }
        })(),

        log.hide = function(){
            var body = DOC.body;
            if( body ) body.removeChild( e0 ), toggle = false;
        },

        log.position = function( $prop ){
            if( $prop.left !== undefined ) es0.left = $prop.left + "px";
            if( $prop.top !== undefined ) es0.top = $prop.top + "px";
            if( $prop.width !== undefined ) es0.width = $prop.width + "px";
            if( $prop.height !== undefined ) es0.height = $prop.height + "px";
        },

        log.show();
})();