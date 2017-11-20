( function() {
	
	Regulus.PointFF = function( pt, p ) {
		p = p || {};
		this.pt = pt;
		
		this.strength = typeof p.strength === "number" ? p.strength : 1;
		this.radius = typeof p.radius === "number" ? p.radius : 100;
	};
	
	Regulus.PointFF.prototype.applyOnBody = function( body, dt ) {
		
		// Calculate relative
		var rel = this.pt.sub( body.position );
		var mag = rel.mag();
		var n = rel.norm();
		
		if ( mag <= this.radius ) {
			// Calculate the force
			var F = n.neg().mul( this.strength );
			if ( ! body.static ) body.velocity.Add( F.mul( dt ) );
		}
	};
	
	Regulus.PointFF.prototype.type = "Point";
	
}() );
