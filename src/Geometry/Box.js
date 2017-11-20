( function() {
	
	Regulus.Box = function( pos, size ) {
		this.pos = new Regulus.Vector( pos );
		this.size = new Regulus.Vector( size );
	};
	
	Regulus.Box.prototype.getMin = function() {
		return this.pos.sub( this.size.x / 2, this.size.y / 2 );
	};

	Regulus.Box.prototype.getMax = function() {
		return this.pos.add( this.size.x / 2, this.size.y / 2 );
	};

	Regulus.Box.prototype.setMin = function( min ) {
		var max = this.getMax();
		var size = max.sub( min );
		var pos = min.add( size.div( 2 ) );
		this.pos = pos;
		this.size = size;
	};

	Regulus.Box.prototype.setMax = function( max ) {
		var min = this.getMin();
		var size = max.sub( min );
		var pos = min.add( size.div( 2 ) );
		this.pos = pos;
		this.size = size;
	};

	Regulus.Box.prototype.area = function() {
		return this.size.x * this.size.y;
	};

	Regulus.Box.prototype.circumference = function() {
		return this.size.x * 2 + this.size.y * 2;
	};

	Regulus.Box.prototype.inside = function( pt ) {
		var min = this.getMin();
		var max = this.getMax();
		return pt.x >= min.x && pt.x <= max.x && pt.y >= min.y && pt.y <= max.y;
	};

	Regulus.Box.prototype.overlap = function( box ) {
		var tmin = this.getMin();
		var tmax = this.getMax();
		var bmin = box.getMin();
		var bmax = box.getMax();

		return tmin.x <= bmax.x && tmax.x >= bmin.x && tmin.y <= bmax.y && tmax.y >= bmin.y;
	};
	
	Regulus.Box.fromMinMax = function( min, max ) {
		min = new Regulus.Vector( min );
		max = new Regulus.Vector( max );
		var center = min.add( max ).Div( 2 );
		var size = max.sub( min );
		return new Regulus.Box( center, size );
	};
	
}() );
