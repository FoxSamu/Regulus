( function() {
	
	Regulus.PolygonPolygon = function( poly1, poly2 ) {
		if ( ! poly1.getBox().overlap( poly2.getBox() ) ) {
			return false;
		}
		
		// Polygons are cached and made compatible before any collision detection, so no check for clockwise or globalization
		var verts1 = poly1;
		var verts2 = poly2;
		var axes1 = poly1.getSATAxes();
		var axes2 = poly2.getSATAxes();
		
		var collide = true;
		var normal = null;
		var depth = Infinity;
		
		// Iterate over the SAT axes of polygon 1
		var index;
		for ( index = 0; index < axes1.length; index ++ ) {
			var axis = axes1[ index ];
			
			// Project polygon 1 on axis
			var min1 = Infinity, max1 = - Infinity;
			verts1.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max1 ) max1 = proj;
				if ( proj < min1 ) min1 = proj;
			} );
			
			
			// Project polygon 2 on axis
			var min2 = Infinity, max2 = - Infinity;
			verts2.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max2 ) max2 = proj;
				if ( proj < min2 ) min2 = proj;
			} );
			
			// Check for collisisons
			if ( min1 <= max2 && max1 >= min2 ) {
				var n = axis.clone();
				var d = Math.min( Math.abs( min1 - max2 ), Math.abs( min2 - max1 ) );
				if ( Math.abs( min1 - max2 ) < Math.abs( max1 - min2 ) ) n.Neg();
				if ( d < depth || ! collide ) {
					depth = d;
					normal = n;
					collide = true;
				}
			} else {
				// There is no 1D collision between projections, perpendicular axis can separate polygons
				collide = false;
				break;
			}
		}
		
		if ( ! collide ) return false;
		
		// Iterate over the SAT axes of polygon 2
		for ( index = 0; index < axes2.length; index ++ ) {
			var axis = axes2[ index ];
			
			// Project polygon 1 on axis
			var min1 = Infinity, max1 = - Infinity;
			verts1.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max1 ) max1 = proj;
				if ( proj < min1 ) min1 = proj;
			} );
			
			
			// Project polygon 2 on axis
			var min2 = Infinity, max2 = - Infinity;
			verts2.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max2 ) max2 = proj;
				if ( proj < min2 ) min2 = proj;
			} );
			
			// Check for collisisons
			if ( min1 <= max2 && max1 >= min2 ) {
				var n = axis.clone();
				var d = Math.min( Math.abs( min1 - max2 ), Math.abs( min2 - max1 ) );
				if ( Math.abs( min1 - max2 ) < Math.abs( max1 - min2 ) ) n.Neg();
				if ( d < depth || ! collide ) {
					depth = d;
					normal = n;
					collide = true;
				}
			} else {
				// There is no 1D collision between projections, perpendicular axis can separate polygons
				collide = false;
				break;
			}
		}
		
		if ( ! collide ) return false;
		
		
		// Return false if there is at least one axis that separates the 2 polygons
		if ( ! collide ) return false;

		var edgeData1 = poly1.getBestEdge( normal );
		var edgeData2 = poly2.getBestEdge( normal.neg() );
		var edge1 = edgeData1.edge;
		var edge2 = edgeData2.edge;

		var ref, inc, flip = false;
		if ( Math.abs( edge1.dot( normal ) ) <= Math.abs( edge2.dot( normal ) ) ) {
			ref = edgeData1;
			inc = edgeData2;
		} else {
			ref = edgeData2;
			inc = edgeData1;
			flip = true;
		}

		var pt1 = inc.vtx1, pt2 = inc.vtx2;
		var amount = 2;

		// Clipping plane 1
		var isc1 = Regulus.IntersectionPoint( ref.vtx1, ref.vtx1.add( normal ), pt1, pt2 );
		if ( isc1.u2 >= 0 && isc1.u2 <= 1 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is normalized vector from vtx1 to vtx2
			var n1 = ref.vtx2.sub( ref.vtx1 ).Norm();

			// Find relatives from ref.vtx1 to collision points pt1 and pt2
			var r11 = pt1.sub( ref.vtx1 );
			var r12 = pt2.sub( ref.vtx1 );

			// Project both relatives on n1, which is normal of clipping plane
			var proj1 = r11.rawProject( n1 );
			var proj2 = r12.rawProject( n1 );

			// Either one or none of proj1 and proj2 should be less than or equal to zero
			// No both are less than zero, because the clipping plane is then separating the edges
			if ( proj1 <= 0 ) {
				// pt1 gets into the clipping plane: Now make pt1 the intersection point
				pt1 = isc1.pt;
			} else if ( proj2 <= 0 ) {
				// pt2 gets into the clipping plane: Now make pt2 the intersection point
				pt2 = isc1.pt;
			}
		}
		

		// Clipping plane 2
		var isc2 = Regulus.IntersectionPoint( ref.vtx2, ref.vtx2.add( normal ), pt1, pt2 );
		if ( isc2.seg2 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is normalized vector from vtx2 to vtx1, just opposite of clipping plane 1
			var n2 = ref.vtx1.sub( ref.vtx2 ).Norm();

			// Find relatives from ref.vtx2 to collision points pt1 and pt2
			var r21 = pt1.sub( ref.vtx2 );
			var r22 = pt2.sub( ref.vtx2 );

			// Project both relatives on n2, which is normal of clipping plane
			var proj3 = r21.rawProject( n2 );
			var proj4 = r22.rawProject( n2 );

			// Same as clipping plane 1
			if ( proj3 <= 0 ) {
				// pt1 gets into the clipping plane: Now make pt1 the intersection point
				pt1 = isc2.pt;
			} else if ( proj4 <= 0 ) {
				// pt2 gets into the clipping plane: Now make pt2 the intersection point
				pt2 = isc2.pt;
			}
		}

		// Clipping plane 3
		var isc3 = Regulus.IntersectionPoint( ref.vtx1, ref.vtx2, pt1, pt2 );
		if ( isc3.seg2 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is collision normal, sometimes flipped if the reference and incident edges were not switched
			var n3;
			if ( flip ) n3 = normal;
			else n3 = normal.neg();

			// Find relatives from ref.vtx1 to collision points pt1 and pt2
			var r31 = pt1.sub( ref.vtx1 );
			var r32 = pt2.sub( ref.vtx1 );

			// Project both relatives on n2, which is normal of clipping plane
			var proj5 = r31.rawProject( n3 );
			var proj6 = r32.rawProject( n3 );

			// Same as clipping plane 1, but now remove vertices, instead of moving to the intersection
			// If both projections are in the plane now, the plane separates the polygons ( with exception to concave ones )
			if ( proj5 < 0 ) {
				// pt1 gets into the clipping plane: Make pt1 pt2, and remove pt2
				pt1 = pt2;
				pt2 = null;
				amount = 1;
			} else if ( proj6 < 0 ) {
				// pt2 gets into the clipping plane: Remove pt2
				pt2 = null;
				amount = 1;
			}

		}
		
		var verts = flip ? verts2 : verts1;
		var nrm = flip ? normal.neg() : normal;
		
		
		// Sat thinks the polygon is inside when it is really close, but actually not inside.
		// Collision points are unavailable then so we can prevent that from happening
		if ( ! pt1 ) return false;
		
		// Project the vertices on the other polygon, in the direction of the normal
		var iscs1 = null, iscs2 = null;
		verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( pt1, pt1.add( nrm ), this, next );
			if ( isc.u1 >= 0 && isc.seg2 ) {
				iscs1 = isc.pt;
			}
		} );
		if ( amount > 1 ) verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( pt2, pt2.add( nrm ), this, next );
			if ( isc.u1 >= 0 && isc.seg2 ) {
				iscs2 = isc.pt;
			}
		} );
		
		if ( amount > 1 ) {
			return {
				normal: normal.neg(),
				depth: depth,
				p2: flip ? [ pt1.sub( poly1.position ), pt2.sub( poly1.position ) ] : [ iscs1.sub( poly1.position ), iscs2.sub( poly1.position ) ],
				p1: flip ? [ iscs1.sub( poly2.position ), iscs2.sub( poly2.position ) ] : [ pt1.sub( poly2.position ), pt2.sub( poly2.position ) ]
			};
		} else {
			return {
				normal: normal.neg(),
				depth: depth,
				p2: flip ? [ pt1.sub( poly1.position ) ] : [ iscs1.sub( poly1.position ) ],
				p1: flip ? [ iscs1.sub( poly2.position ) ] : [ pt1.sub( poly2.position ) ]
			};
		}
	};
	
}() );
