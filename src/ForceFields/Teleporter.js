( function() {
	
	Regulus.TeleporterFF = function( pt, shape, p ) {
		p = p || {};
		this.pt = pt;
		this.shape = shape;
	};
	
	Regulus.TeleporterFF.prototype.applyOnBody = function( body ) {
		if ( this.shape.pointInside( body.position ) ) {
			if ( ! body.static ) body.position.set( this.pt );
		}
	};
	
	Regulus.TeleporterFF.prototype.type = "Teleporter";
	
}() );
