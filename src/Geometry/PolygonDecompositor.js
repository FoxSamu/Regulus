// NOTE: This code is not expirimental and should not be published.

( function() {
	
	function distance( poly, point ) {
		var verts = poly.clone();
		var mindist = Infinity;
		verts.forEach( function( next ) {
			var dist = Regulus.DistanceToLine( point, this, next );
			if ( dist < mindist ) mindist = dist;
		} );
		return mindist;
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

		return inside || distance( poly, point ) < 0.00001;
	}
	
	function numberOfIntersections( poly, p1, p2 ) {
		var verts = poly;
		var iscscounter = 0;
		verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( this, next, p1, p2 );
			if ( isc.between1 && isc.between2 ) {
				iscscounter ++;
			}
		} );
		
		return iscscounter;
	}
	
	function stepDecompositePolygon( poly ) {
		
		poly.removeDoubles();
		
		var verts = poly.clone();
		var complexes = poly.getComplexAngles();
		
		for ( var cpx = 0; cpx < complexes.length; cpx ++ ) {
			
			var complex = complexes[ cpx ];

			// Get the closest point
			var distance = Infinity;
			var closest = null;

			verts.forEach( function( next, prev, idx, n, p ) {
				if ( idx === complex.index || n === complex.index || p === complex.index ) {
					return;
				}
				var dist = complex.vertex.dist( this );
				if (
					dist < distance &&
					numberOfIntersections( poly, complex.vertex, this ) < 1 &&
					inside( this.add( complex.vertex ).div( 2 ), poly )
				) {
					distance = dist;
					closest = {
						vertex: this,
						index: idx
					};
				}
			} );
			if ( closest ) {
				var idx1 = complex.index;
				var idx2 = closest.index;
				if ( idx1 > idx2 ) {
					var flip = idx1;
					idx1 = idx2;
					idx2 = flip;
				}

				var p1 = [];
				var p2 = [];

				verts.forEach( function( next, prev, idx ) {
					if ( idx < idx1 ) {
						p1.push( this );
					} else if ( idx === idx1 || idx === idx2 ) {
						p1.push( this );
						p2.push( this );
					} else if ( idx > idx1 && idx < idx2 ) {
						p2.push( this );
					} else {
						p1.push( this );
					}
				} );

				var v1 = new Regulus.Polygon( p1 );
				var v2 = new Regulus.Polygon( p2 );

				return [
					v1,
					v2
				];
			}
		}
	}
	
	function stepDecomposite( list ) {
		
		var newpolygons = [];
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var po = list[ i ];
			
			if ( po.isConcave() ) {
				var ps = stepDecompositePolygon( po );
				newpolygons.push( ps[ 0 ] );
				newpolygons.push( ps[ 1 ] );
			} else {
				newpolygons.push( po );
			}
			
		}
		
		return newpolygons;
		
	}
	
	function areAllConvex( list ) {
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var po = list[ i ];
			
			if ( po.isConcave() ) {
				return false;
			}
			
		}
		
		return true;
		
	}
	
	
	Regulus.DecompositePolygon = function( poly, renderer ) {
		var polygons = Regulus.SimplifyPolygon( poly, renderer );
		
		while ( ! areAllConvex( polygons ) ) {
			polygons = stepDecomposite( polygons );
		}
		
		return polygons;
	};
	
} () );
