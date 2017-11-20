( function() {
	
	Regulus.Math = {
		clamp: function( val, min, max ) {
			if ( val < min ) return min;
			if ( val > max ) return max;
			return val;
		},
		inRange: function( val, min, max ) {
			return val > min && val < max;
		},
		onRange: function( val, min, max ) {
			return val >= min && val <= max;
		},
		vecScalar: function( vec, s ) {
			var a = new Regulus.Vector( vec );
			return new Regulus.Vector( s * a.y, - s * a.x );
		},
		scalarVec: function( s, vec ) {
			var a = new Regulus.Vector( vec );
			return new Regulus.Vector( - s * a.y, s * a.x );
		},
		pythagoreanSolve: function( a, b ) {
			return Math.sqrt( a * a + b * b );
		}
	};
	
}() );
