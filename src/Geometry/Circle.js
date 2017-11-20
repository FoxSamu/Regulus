( function() {
	
	Regulus.Circle = function( radius, rotation, position ) {
		
		this.radius = radius;
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
	
		
	Regulus.Circle.prototype.center = function() {
		return this.position;
	};

	Regulus.Circle.prototype.alignCenter = function() {
		this.position.set( 0, 0 );
	};

	Regulus.Circle.prototype.area = function() {
		return this.radius * this.radius * Math.PI;
	};

	Regulus.Circle.prototype.circumference = function() {
		return 2 * this.radius * Math.PI;
	};

	Regulus.Circle.prototype.getBox = function() {
		return new Regulus.Box( this.position, this.radius * 2 );
	};

	Regulus.Circle.prototype.clone = function() {
		return new Regulus.Circle( this.radius, this.rotation, this.position );
	};
	
	Regulus.Circle.prototype.mass = function( density ) {
		return this.area() * density;
	};
	
	Regulus.Circle.prototype.inertia = function( density ) {
		return this.mass( density ) * this.radius * this.radius;
	};
	
	Regulus.Circle.prototype.pointInside = function( point ) {
		return this.position.dist( point ) <= this.radius;
	};

	Regulus.Circle.prototype.type = "Circle";
	
}() );
