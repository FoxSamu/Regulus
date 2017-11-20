( function() {
	
	
	Regulus.InfinitePlane = function( rotation, position ) {
		
		// Infinite planes are like a circle across three points on the same line,
		// but define it with a normal direction and a point where it goes across.
		
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
		
	Regulus.InfinitePlane.prototype.area = function() {
		// I'ts an INFINITE plane, with an INFINITE area.
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.circumference = function() {
		// I'ts an INFINITE plane, with an INFINITE circumference.
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.pointInside = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p <= 0;
	};

	Regulus.InfinitePlane.prototype.clone = function() {
		return new Regulus.InfinitePlane( this.rotation, this.position.clone() );
	};

	Regulus.InfinitePlane.prototype.mass = function() {
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.inertia = function() {
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.type = "InfinitePlane";
	
}() );
