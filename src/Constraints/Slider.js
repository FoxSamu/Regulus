( function() {
	
	/**
	 * A slider clamps a point of a body to a line segment. The point can still move along that segment.
	 * @constructor SliderConstraint
	 * @param { Body }   body1 - The body that is connected to the slider.
	 * @param { Vector } pt1   - The point where the body is connected, relative to it's position.
	 * @param { Vector } pt2   - The first point of the line.
	 * @param { Vector } pt3   - The second point of the line.
	 * @param { Object } p     - Properties of the constraint.
	 */
	Regulus.SliderConstraint = function( body, pt1, pt2, pt3, p ) {
		
		p = p || {};
		this.body = body;
		this.pt1 = pt1;
		this.pt2 = pt2;
		this.pt3 = pt3;
		
		this.enabled = typeof p.enabled === "boolean" ? p.enabled : true;
		
	};
	
	Regulus.SliderConstraint.prototype.getCorrectionData = function() {
		var rp = this.pt1.rotate( this.body.rotation );
		var gp = rp.add( this.body.position );
		var dist = Regulus.DistToLineInfo( gp, this.pt2, this.pt3 );
		var depth = dist.distance;
		var normal = dist.normal;
		return {
			rp: rp,
			gp: gp,
			depth: depth,
			normal: normal.neg()
		};
	};
	
	
	Regulus.SliderConstraint.prototype.solve = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
		var A = this.body;
		
		var ra = cd.rp;
		
		var rv = A.getVelo( cd.normal.neg().perp(), ra );
		
		var velAlongNormal = rv.dot( cd.normal.neg() );
		
		if ( velAlongNormal > 0 ) {
			return;
		}
		
		var raCn = ra.cross( cd.normal );
		var invMassSum = A.getInvMass() + raCn * raCn * A.getInvInertia();
		
		var j = - velAlongNormal;
		j /= invMassSum;
		
		var impulse = cd.normal.mul( j );
		A.applyImpulse( impulse.neg(), ra );
		
	};

	Regulus.SliderConstraint.prototype.correction = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
		var A = this.body;
		
		var depth = cd.depth;
		var normal = cd.normal;
		
		var percent = 0.2;
		var slop = 0;
		var correction = normal.mul( Math.max( depth - slop, 0 ) / A.getInvMass() * percent );
		A.positionVel.Sub( normal.mul( depth ) );
	};
	
	Regulus.SliderConstraint.prototype.type = "Slider";
	
}() );
