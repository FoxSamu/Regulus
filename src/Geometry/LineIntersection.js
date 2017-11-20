( function() {
	// Implementation of Paul Bourke
	Regulus.IntersectionPoint = function( p1, p2, p3, p4 ) {
		var x1 = p1.x;
		var x2 = p2.x;
		var x3 = p3.x;
		var x4 = p4.x;
		var y1 = p1.y;
		var y2 = p2.y;
		var y3 = p3.y;
		var y4 = p4.y;
		var ua, ub, denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );
		ua = ( ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 ) ) / denom;
		ub = ( ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 ) ) / denom;
		return {
			pt: new Regulus.Vector( x1 + ua * ( x2 - x1 ), y1 + ua * ( y2 - y1 ) ),
			seg1: ua >= - 0.0001 && ua <= 1.0001,
			seg2: ub >= - 0.0001 && ub <= 1.0001,
			between1: ua - 0.0001 > 0 && ua + 0.0001 < 1,
			between2: ub - 0.0001 > 0 && ub + 0.0001 < 1,
			u1: ua,
			u2: ub
		};
	};
}() );
