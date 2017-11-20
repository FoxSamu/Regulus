( function() {
	
	Regulus.InfiniteBar = function( width, rotation, position ) {
		
		// Infinite bars are the offset of a straight line
		// Width defines the doubled offset
		// Position is a point on the line
		// Rotation is the direction of the perpendicular of the line
		
		this.width = width;
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
	
	Regulus.InfiniteBar.prototype.area = function() {
		return Infinity;
	};

	Regulus.InfiniteBar.prototype.circumference = function() {
		return Infinity;
	};

	// Check using SAT
	Regulus.InfiniteBar.prototype.pointInside = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Math.abs( p ) <= this.width / 2;
	};

	Regulus.InfiniteBar.prototype.pointInPosSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Regulus.Math.onRange( p, 0, this.width / 2 );
	};

	Regulus.InfiniteBar.prototype.pointInNegSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Regulus.Math.inRange( p, - this.width / 2, 0 );
	};

	Regulus.InfiniteBar.prototype.pointAtPosSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p <= this.width / 2;
	};

	Regulus.InfiniteBar.prototype.pointAtNegSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p >= - this.width / 2;
	};

	Regulus.InfiniteBar.prototype.clone = function() {
		return new Regulus.InfiniteBar( this.width, this.rotation, this.position.clone() );
	};

	Regulus.InfiniteBar.prototype.mass = function() {
		return Infinity;
	};

	Regulus.InfiniteBar.prototype.inertia = function() {
		return Infinity;
	};
	
	Regulus.InfiniteBar.prototype.type = "InfiniteBar";
	
}() );
