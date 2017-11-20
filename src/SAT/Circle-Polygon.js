( function() {
	
	function distance( verts, point ) {
		var mindist = Infinity;
		var info = null;
		var pt = null;
		verts.forEach( function( next ) {
			var dist = Regulus.DistToLineInfo( point, this, next );
			if ( dist.distance < mindist ) {
				mindist = dist.distance;
				info = dist.normal;
				pt = dist.closest;
			}
		} );
		return {
			norm: info,
			dist: mindist,
			pt: pt
		};
	}
	
	function inside( point, poly ) {
		var x = point.x, y = point.y;
		
		var vs = poly.vertices;

		var inside = false;
		for ( var i = 0, j = vs.length - 1; i < vs.length; j = i ++ ) {
			var xi = vs[ i ].x, yi = vs[ i ].y;
			var xj = vs[ j ].x, yj = vs[ j ].y;

			var intersect = yi > y !== yj > y && x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi;
			if ( intersect ) inside = ! inside;
		}

		return inside;
	}
	
	Regulus.CirclePolygon = function( circ, poly ) {
		
		if ( ! circ.getBox().overlap( poly.getBox() ) ) {
			return false;
		}
		
		var pos = circ.position;
		var verts = poly;
		
		var dist = distance( verts, pos );
		
		if ( inside( pos, poly ) ) {
			// Circle is inside anyway
			var depth = dist.dist + circ.radius;
			
			var normal = dist.norm.norm();
			
			var pt1 = normal.neg().Mul( circ.radius );
			var pt2 = dist.pt.sub( poly.position );
			
			return {
				normal: normal,
				depth: depth,
				p1: [ pt2 ],
				p2: [ pt1 ]
			};
		} else {
			// Circle can be inside
			if ( dist.dist <= circ.radius ) {
				// Circle is inside
				var d = circ.radius - dist.dist;
				
				// Normal is negative, but don't flip it until needed
				var n = dist.norm.norm();
				
				var p1 = n.mul( circ.radius );
				var p2 = dist.pt.sub( poly.position );
				
				// Flip normal
				n.Neg();
				
				return {
					normal: n,
					depth: d,
					p1: [ p2 ],
					p2: [ p1 ]
				};
			} else {
				// Circle is not inside
				return false;
			}
		}
		
	};
	
}() );
