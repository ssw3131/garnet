/**
 * Created by sewon on 2014-08-21.
 */
"use strict";
(function(){
	var w = window, doc = document,
		Dk, fn,
		trim = /^\s*|\s*$/g;

	w.Dk = Dk = { info : { name : 'Dk garnet', version : 'v0.2.0', url : 'https://github.com/ssw3131/garnet' } },
		fn = Dk[ 'fn' ] = function( $k, $v ){
			$k = $k.replace( trim, '' ),
				Dk[ $k.charAt( 0 ).toLowerCase() + $k.substring( 1, $k.length ) ] = $v;
		},
		fn[ 'cls' ] = function( $k, $v ){
			$k = $k.replace( trim, '' ).toLowerCase(),
				Dk[ $k.charAt( 0 ).toUpperCase() + $k.substring( 1, $k.length ) ] = $v;
		},
		fn[ 'obj' ] = function( $k, $v ){
			Dk[ $k = $k.replace( trim, '' ).toUpperCase() ] = $v;
		},


	fn( 'test1', 'test' ),
	fn( 'test2', 'testTest' ),
	fn( 'test3', 'TestTest' ),
	fn.cls( 'class', 'test' ),
	fn.obj( 'obj', 'test' );
})();