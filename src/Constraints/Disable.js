( function() {
	
	/**
	 * Disables collision between a list of bodies
	 * @constructor ElasticConstraint
	 * @param { Array } bodies - The bodies that are prevented to collide.
	 */
	Regulus.DisableConstraint = function( bodies, p ) {
		
		p = p || {};
		this.bodies = bodies;
		
		this.enabled = typeof p.enabled === "boolean" ? p.enabled : true;
		
	};
	
	Regulus.DisableConstraint.prototype.getCorrectionData = function() {
		// No correction data
	};
	
	Regulus.DisableConstraint.prototype.solve = function() {
		// No solve
	};

	Regulus.DisableConstraint.prototype.correction = function() {
		// No correction
	};
	
	Regulus.DisableConstraint.prototype.type = "Disable";
	
}() );
