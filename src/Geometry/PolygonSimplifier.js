( function () {
	
	function simplifyPolygon( poly ) {
		
		var verts = poly.clone();
		var selfIscs = poly.getSelfIntersections();
		
		var isc = selfIscs[ 0 ];
		
		var points1 = [], points2 = [];
		
		var idx1 = isc.index1;
		var idx2 = isc.index2;
		var iscp = isc.point;
		
		if ( idx2 < idx1 ) {
			var flip = idx2;
			idx2 = idx1;
			idx1 = flip;
		}
		
		
		verts.forEach( function( n, p, idx ) {
			
			if ( idx < idx1 ) {
				points1.push( this );
			}
			if ( idx === idx1 ) {
				points1.push( this );
				points1.push( iscp );
				points2.push( iscp );
			}
			if ( idx > idx1 && idx < idx2 ) {
				points2.push( this );
			}
			if ( idx === idx2 ) {
				points2.push( this );
				points1.push( iscp );
				points2.push( iscp );
			}
			if ( idx > idx2 ) {
				points1.push( this );
			}
			
		} );
		
		var verts1 = new Regulus.Vertices( points1 );
		var verts2 = new Regulus.Vertices( points2 );
		
		var poly1 = new Regulus.Polygon( verts1 );
		var poly2 = new Regulus.Polygon( verts2 );
		
		poly1.removeDoubles();
		poly2.removeDoubles();
		
		return [
			poly1,
			poly2
		];
	}
	
	function simplifyPolygons( list ) {
		
		var polygons = [];
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var poly = list[ i ];
			
			if ( poly.isComplex() ) {
				var ps = simplifyPolygon( poly );
				polygons.push( ps[ 0 ] );
				polygons.push( ps[ 1 ] );
			} else {
				polygons.push( poly );
			}
			
		}
		
		return polygons;
		
	}
	
	function areAllSimple( list ) {
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var poly = list[ i ];
			
			if ( poly.isComplex() ) {
				return false;
			}
			
		}
		
		return true;
		
	}
	
	Regulus.SimplifyPolygon = function ( poly ) {
		
		var polygons = [ poly ];
		while ( ! areAllSimple( polygons ) ) {
			
			polygons = simplifyPolygons( polygons );
			
		}
		
		return polygons;
		
	};
	
}() );
