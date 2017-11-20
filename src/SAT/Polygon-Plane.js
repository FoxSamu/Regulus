( function() {
	
	Regulus.PolygonPlane = function( poly, plane ) {
		
		// Polygons are cached and made compatible before any collision detection, so no check for clockwise or globalization
		var ppos = plane.position;
		var verts = poly;
		
		// One benefit with planes is that we already have the normal and tangent
		var normal = Regulus.Vector.fromDirection( plane.rotation );
		var tangent = normal.perp();
		var depth = - Infinity;
		var lastdepth = - Infinity;
		var p1 = null;
		var p2 = null;
		var pt1 = null;
		var pt2 = null;
		var collide = false;
		verts.forEach( function() {
			var rel = this.sub( ppos );
			var raw = rel.rawProject( normal );
			if ( raw <= 0 && - raw > depth ) {
				depth = - raw;
				p1 = this.sub( poly.position );
				pt1 = rel.project( tangent );
				collide = true;
			}
		} );
		verts.forEach( function() {
			var rel = this.sub( ppos );
			var raw = rel.rawProject( normal );
			if ( raw <= 0 && - raw > lastdepth && - raw < depth ) {
				lastdepth = - raw;
				p2 = this.sub( poly.position );
				pt2 = rel.project( tangent );
				collide = true;
			}
		} );
		
		if ( ! collide ) {
			return false;
		}
		
		if ( ! p2 ) {
			return {
				normal: normal,
				depth: depth,
				p1: [ pt1 ],
				p2: [ p1 ]
			};
		} else {
			return {
				normal: normal,
				depth: depth,
				p1: [ pt1, pt2 ],
				p2: [ p1, p2 ]
			};
		}
		
	};
	
} () );
