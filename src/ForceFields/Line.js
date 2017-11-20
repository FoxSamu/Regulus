( function() {
	
	Regulus.LineFF = function( pt1, pt2, p ) {
		p = p || {};
		this.pt1 = pt1;
		this.pt2 = pt2;
		
		this.strength = typeof p.strength === "number" ? p.strength : 1;
		this.radius = typeof p.radius === "number" ? p.radius : 100;
	};
	
	Regulus.LineFF.prototype.applyOnBody = function( body, dt ) {
		
		// Calculate relative
		var dtli = Regulus.DistToLineInfo( body.position, this.pt1, this.pt2 );
		var mag = dtli.distance;
		var n = dtli.normal;
		
		if ( ! dtli.onEdge ) return;
		
		if ( mag <= this.radius ) {
			// Calculate the force
			var F = n.neg().mul( this.strength );
			if ( ! body.static ) body.velocity.Add( F.mul( dt ) );
		}
	};
	
	Regulus.LineFF.prototype.type = "Line";
	
}() );
