( function() {
	
	Regulus.DistanceToLine = function( point, p1, p2 ) {
		
		// Vector from p1 to p2
		var edge = p2.sub( p1 );
		
		// Vector from p1 to point
		var relative = point.sub( p1 );
		
		// Projection magnitude in relation to the edge vector
		var projLen = relative.dot( edge.norm() ) / edge.mag();
		
		// If projection is on edge
		if ( projLen > 0 && projLen < 1 ) {
			
			// Calculate projection vector
			var proj = edge.mul( projLen );
			
			// Vector between proj and relative
			var norm = relative.sub( proj );
			
			// Magnitude of norm is distance to line, return magnitude of norm
			return norm.mag();
		} else if ( projLen <= 0 ) {
			
			// Closer to p1, return distance to p1
			return point.dist( p1 );
		} else {
			
			// Closer to p2, return distance to p2
			return point.dist( p2 );
		}
	};
	
	Regulus.DistToLineInfo = function( point, p1, p2 ) {
		
		// Vector from p1 to p2
		var edge = p2.sub( p1 );
		
		// Vector from p1 to point
		var relative = point.sub( p1 );
		
		// Projection magnitude in relation to the edge vector
		var projLen = relative.dot( edge.norm() ) / edge.mag();
		
		// If projection is on edge
		if ( projLen > 0 && projLen < 1 ) {
			
			// Calculate projection vector
			var proj = edge.mul( projLen );
			
			// Vector between proj and relative
			var norm = relative.sub( proj );
			
			// Magnitude of norm is distance to line, return magnitude of norm
			return {
				distance: norm.mag(),
				onEdge: true,
				p1: false,
				p2: false,
				normal: norm.norm().neg(),
				closest: p1.add( proj )
			};
		} else if ( projLen <= 0 ) {
			
			// Closer to p1, return distance to p1
			return {
				distance: point.dist( p1 ),
				onEdge: false,
				p1: true,
				p2: false,
				normal: p1.sub( point ).norm(),
				closest: p1
			};
		} else {
			
			// Closer to p2, return distance to p2
			return {
				distance: point.dist( p2 ),
				onEdge: false,
				p1: false,
				p2: true,
				normal: p2.sub( point ).norm(),
				closest: p2
			};
		}
	};
	
}() );
