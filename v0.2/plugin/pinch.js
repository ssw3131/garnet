/*
 dk.PINCH.S( 'test', function( $e ){
 log( 'site pinch ---------------------------------' );
 log( 'type : ' + $e.type );
 log( 'scale : ' + $e.scale );
 log( 'distance : ' + $e.distance );
 log( 'move : ' + $e.moveX + ' , ' + $e.moveY );
 log( 'center : ' + $e.centerX + ' , ' + $e.centerY );
 } )
 $e.type
 oneStart, one, oneEnd, pinchStart, pinch, pinchEnd
 */
dk.obj( 'PINCH', (function( $sList, $dkMouse, $dkEvent ){
	var r, func, start, end, mPow = Math.pow, mSqrt = Math.sqrt, mMax = Math.max, mMin = Math.min, mAbs = Math.abs,
		getDistance, reset, initFlag = false, oldScale, initD, init, pinchFlag = false, initOne = {}, initPinch = {}, count = 0;

	getDistance = function( $p0, $p1 ){ return ~~mSqrt( mPow( $p0.x - $p1.x, 2 ) + mPow( $p0.y - $p1.y, 2 ) ); },
		reset = function( $ev ){ $ev.distance = 0, $ev.moveX = 0, $ev.moveY = 0, $ev.scale = 1, oldScale = 1, $ev.centerX = 0, $ev.centerY = 0; },
		init = function( $ev ){ $ev.type = 'oneStart', initFlag = true, reset( $ev ); },

		func = function( $e ){
			var ev = $dkEvent( $e.nativeEvent ), touchList = $dkMouse.touches, leng = touchList.length, point0, point1;
			if( initFlag ) $e.nativeEvent.stopPropagation(), $e.nativeEvent.preventDefault();

			point0 = { x : touchList[ 0 ].pageX, y : touchList[ 0 ].pageY };

			if( leng == 0 ){
				ev.type = 'oneEnd', initFlag = false, reset( ev ), r[ 'update' ]( ev ); // oneEnd
			}else if( leng == 1 ){
				if( $e.type == 'move' ){
					if( initFlag ) ev.type = 'one', ev.scale = oldScale, ev.moveX = point0.x - initOne.x, ev.moveY = point0.y - initOne.y, r[ 'update' ]( ev ); // one
					else init( ev ), initOne = point0, r[ 'update' ]( ev ); // oneStart one
				}else if( $e.type == 'up' ){
					if( pinchFlag ) ev.type = 'pinchEnd', initOne = point0, ev.moveX = 0, ev.moveY = 0, r[ 'update' ]( ev ); // pinchEnd
					else ev.type = 'oneEnd', initFlag = false, reset( ev ), r[ 'update' ]( ev ); // oneEnd
				}
				pinchFlag = false;
			}else if( leng > 1 ){
				if( initFlag ){
					point1 = { x : touchList[ 1 ].pageX, y : touchList[ 1 ].pageY },
						ev.distance = getDistance( point0, point1 ), ev.centerX = mMin( point0.x, point1.x ) + mAbs( point1.x - point0.x ) / 2, ev.centerY = mMin( point0.y, point1.y ) + mAbs( point1.y - point0.y ) / 2;
					if( pinchFlag ){
						ev.type = 'pinch', ev.moveX = ev.centerX - initPinch.x, ev.moveY = ev.centerY - initPinch.y, ev.scale = oldScale = ev.distance / initD; // pinch
					}else{
						ev.type = 'pinchStart', pinchFlag = true, initPinch = { x : ev.centerX, y : ev.centerY }, ev.moveX = 0, ev.moveY = 0, initD = ev.distance, ev.scale = 1; // pinchStart
					}
					r[ 'update' ]( ev );
				}else{
					init( ev ), initOne = point0, r[ 'update' ]( ev ); // oneStart ( safari 동시 투터치 시작 )
				}
			}
		},
		start = function(){ $dkMouse.S( 'dkPinch', func ) },
		end = function(){ $dkMouse.S( 'dkPinch', null ) },
		r = $sList( 'PINCH', 1, start, end )
	return r;
})( dk.sList, dk.MOUSE, dk.dkEvent ) );