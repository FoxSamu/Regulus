( function() {
	
	Regulus.Vertices = {};
	
	Regulus.Vertices.fromBox = function( width, height ) {
		
		var x = width / 2;
		var y = height / 2;
		
		return [
			[ - x, - y ],
			[ - x, y ],
			[ x, y ],
			[ x, - y ]
		];
		
	};
	
	Regulus.Vertices.fromSquare = function( width ) {
		
		var x = width / 2;
		var y = width / 2;
		
		return [
			[ - x, - y ],
			[ - x, y ],
			[ x, y ],
			[ x, - y ]
		];
		
	};
	
	Regulus.Vertices.fromRegularPolygon = function( radius, edges ) {
		
		var arr = [];
		
		var size = Math.PI / ( edges / 2 );
		
		for ( var i = 0; i < edges; i ++ ) {
			arr.push( [ Math.sin( size * i ) * radius, Math.cos( size * i ) * radius ] );
		}
		
		return arr;
		
	};
	
}() );
