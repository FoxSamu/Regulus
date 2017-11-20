( function() {
	
	Regulus.CircleCircle = function( circ1, circ2 ) {
		var pos1 = circ1.position;
		var pos2 = circ2.position;
		
		if ( ! circ1.getBox().overlap( circ2.getBox() ) ) {
			return false;
		}
		
		var relative = pos2.sub( pos1 );
		
		var dist = relative.mag();
		
		var radius = circ1.radius + circ2.radius;
		if ( dist <= radius ) {
			var depth, normal, p1, p2;
			if ( dist === 0 ) {
				
				depth = radius;
				
				normal = new Regulus.Vector( 1, 0 );
				
				p1 = normal.neg().Mul( circ1.radius - depth );
				p2 = normal.mul( circ2.radius - depth );
				
				return {
					normal: normal,
					depth: depth,
					p1: [ p2 ],
					p2: [ p1 ]
				};
				
			} else {
				
				depth = radius - dist;
				
				normal = relative.norm().Neg();
				
				p1 = normal.neg().Mul( circ1.radius - depth );
				p2 = normal.mul( circ2.radius - depth );
				
				return {
					normal: normal,
					depth: depth,
					p1: [ p2 ],
					p2: [ p1 ]
				};
				
			}
		}
		
		return false;
		
	};
	
}() );
