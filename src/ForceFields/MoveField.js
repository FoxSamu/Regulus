( function() {
	
	Regulus.MoveFF = function( shape, p ) {
		p = p || {};
		this.shape = shape;
		
		this.move = new Regulus.Vector( p.move );
		this.wind = new Regulus.Vector( p.wind );
		this.disableGravity = typeof p.disableGravity === "boolean" ? p.disableGravity : false;
		this.disableWind = typeof p.disableWind === "boolean" ? p.disableWind : false;
		
		// -1 to use world value, 0 to turn air off here
		this.air = typeof p.air === "number" ? p.air : - 1;
	};
	
	Regulus.MoveFF.prototype.applyOnBody = function( body, dt, data ) {
		if ( this.shape.pointInside( body.position ) ) {
			if ( body.static ) return;
			
			if ( this.disableWind ) data.wind.set( 0 );
			data.wind.Sub( this.wind );
			
			if ( this.air > - 1 ) {
				data.air = this.air;
			}
			
			if ( this.disableGravity ) data.gravity.set( 0 );
			
			body.velocity.Add( this.move.mul( dt ) );
		}
	};
	
	Regulus.MoveFF.prototype.type = "Move";
	
}() );
