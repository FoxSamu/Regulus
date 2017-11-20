( function() {
	
	Regulus.CirclePlane = function( circ, plane ) {
		var cpos = circ.position;
		var ppos = plane.position;
		
		var pnorm = Regulus.Vector.fromDirection( plane.rotation );
		
		var relative = cpos.sub( ppos );
		
		var raw = relative.rawProject( pnorm );
		
		var ptang = pnorm.perp();
		
		// Circle doesn't collide
		if ( raw > circ.radius ) {
			return false;
		}
		
		var depth = circ.radius - raw;
		var normal = pnorm;
		var p2 = relative.project( ptang );
		var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );
		
		return {
			normal: normal,
			depth: depth,
			p1: [ p2 ],
			p2: [ p1 ]
		};
		
	};
	
} () );
