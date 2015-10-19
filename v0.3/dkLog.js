(function(){
    var W = window, DOC = document;
    var log, logArr = [], e0, e1, es0, es1, toggle, x = 710, y = 10, w = 800;

    e0 = DOC.createElement( "div" ), es0 = e0.style,
        es0.cssText = "left : " + x + "px; top : " + ( y + 22 ) + "px; width : " + w + "px; height : 90%; position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
        e1 = DOC.createElement( "div" ), es1 = e1.style,
        es1.cssText = "left : " + x + "px; top : " + y + "px; width : " + ( w + 10 ) + "px; height : 20px; position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",

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
                e0.innerHTML = jcJoin.call( logArr, "<br>" ), body.appendChild( e0 ), body.appendChild( e1 ), toggle = true;
            }
        })(),

        log.hide = function(){
            var body = DOC.body;
            body.removeChild( e0 ), body.removeChild( e1 ), toggle = false;
        },

        log.position = function( $prop ){
            if( $prop.left !== undefined ) es0.left = $prop.left + "px", es1.left = $prop.left + "px";
            if( $prop.top !== undefined ) es0.top = $prop.top + 22 + "px", es1.top = $prop.top + "px";
            if( $prop.width !== undefined ) es0.width = $prop.width + "px", es1.width = $prop.width + 10 + "px";
        },

		log.show();
})();