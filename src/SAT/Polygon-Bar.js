( function() {
	
	Regulus.PolygonBar = function( poly, bar ) {
		
		var bpos = bar.position;
		var verts = poly;
		
		var axis = Regulus.Vector.fromDirection( bar.rotation );
		
		var min = Infinity, max = - Infinity;
		verts.forEach( function() {
			var rel = this.sub( bpos );
			var raw = rel.rawProject( axis );
			if ( raw < min ) min = raw;
			if ( raw > max ) max = raw;
		} );
		
		var bmin = - bar.width / 2;
		var bmax = bar.width / 2;
		
		// Check if separating axis does exist
		if ( min > bmax || max < bmin ) return false;
		
		var normal = axis;
		var flip = false;
		if ( Math.abs( min - bmax ) > Math.abs( max - bmin ) ) {
			normal.Neg();
			flip = true;
		}
		var depth = Math.min( Math.abs( min - bmax ), Math.abs( bmin - max ) );
		
		
		var edge = poly.getBestEdge( normal.neg() );
		var pt1 = edge.vtx1;
		var pt2 = edge.vtx2;
		
		if ( ! bar.pointAtPosSide( pt1 ) && ! flip ) {
			pt1 = null;
		} else if ( ! bar.pointAtNegSide( pt1 ) && flip ) {
			pt1 = null;
		}
		
		if ( ! bar.pointAtPosSide( pt2 ) && ! flip ) {
			pt2 = null;
		} else if ( ! bar.pointAtNegSide( pt2 ) && flip ) {
			pt2 = null;
		}
		
		if ( ! pt1 ) {
			pt1 = pt2;
			pt2 = null;
		}
		
		var l1 = normal.mul( bar.width / 2 ).Add( bpos );
		var tangent = normal.perp();
		
		var proj1 = pt1.sub( l1 ).Project( tangent ).Add( l1 );
		var proj2 = pt2 ? pt2.sub( l1 ).Project( tangent ).Add( l1 ) : null;
		
		pt1.Sub( poly.position );
		if ( pt2 ) pt2.Sub( poly.position );
		
		proj1.Sub( bar.position );
		if ( pt2 ) proj2.Sub( bar.position );
		
		if ( pt2 ) {
			return {
				normal: normal,
				depth: depth,
				p1: [ proj1, proj2 ],
				p2: [ pt1, pt2 ]
			};
		} else {
			return {
				normal: normal,
				depth: depth,
				p1: [ proj1 ],
				p2: [ pt1 ]
			};
		}
	};
	
} () );
