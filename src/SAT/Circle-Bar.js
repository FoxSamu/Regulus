( function() {
	
	Regulus.CircleBar = function( circ, bar ) {
		var cpos = circ.position;
		var ppos = bar.position;
		
		var bnorm = Regulus.Vector.fromDirection( bar.rotation );
		
		var relative = cpos.sub( ppos );
		
		var raw = relative.rawProject( bnorm );
		
		var ptang = bnorm.perp();
		
		// Circle doesn't collide
		if ( Math.abs( raw ) > circ.radius + bar.width / 2 ) {
			return false;
		}
		
		if ( raw >= 0 ) {
		
			var depth = circ.radius - raw + bar.width / 2;
			var normal = bnorm;
			var p2 = relative.project( ptang ).Add( bnorm.mul( bar.width / 2 ) );
			var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );

			return {
				normal: normal,
				depth: depth,
				p1: [ p2 ],
				p2: [ p1 ]
			};
		} else {
		
			var depth = circ.radius + raw + bar.width / 2;
			var normal = bnorm.neg();
			var p2 = relative.project( ptang ).Add( bnorm.mul( - bar.width / 2 ) );
			var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );

			return {
				normal: normal,
				depth: depth,
				p1: [ p2 ],
				p2: [ p1 ]
			};
			
		}
		
	};
	
} () );
