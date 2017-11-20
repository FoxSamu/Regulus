( function() {
	
	/**
	 * Elastics are like springs, except that they have a maximum lenght instead of a fixed length.
	 * @constructor ElasticConstraint
	 * @param { Body }   body1 - The first body that is connected to the elastic.
	 * @param { Vector } pt1   - The point where the first body is connected, relative to it's position.
	 * @param { Body }   body2 - The second body that is connected to the elastic.
	 * @param { Vector } pt2   - The point where the second body is connected, relative to it's position.
	 * @param { Object } p     - Properties of the constraint
	 */
	Regulus.ElasticConstraint = function( body1, pt1, body2, pt2, p ) {
		
		p = p || {};
		this.body1 = body1;
		this.body2 = body2;
		this.pt1 = pt1;
		this.pt2 = pt2;
		
		this.length = typeof p.length === "number" ? p.length : 100;
		this.springConstant = typeof p.springConstant === "number" ? p.springConstant : 0.005;
		this.damping = typeof p.damping === "number" ? p.damping : 0.001;
		this.disableCollision = typeof p.disableCollision === "boolean" ? p.disableCollision : true;
		this.enabled = typeof p.enabled === "boolean" ? p.enabled : true;
		
	};
	
	Regulus.ElasticConstraint.prototype.getCorrectionData = function() {
		var rp1 = this.pt1.rotate( this.body1.rotation );
		var rp2 = this.pt2.rotate( this.body2.rotation );
		var gp1 = rp1.add( this.body1.position );
		var gp2 = rp2.add( this.body2.position );
		var rel = gp2.sub( gp1 );
		var mag = rel.mag();
		var solve = true;
		var depth = 0;
		var normal = rel.neg().norm();
		if ( mag < this.length ) {
			solve = false;
		} else {
			depth = mag - this.length;
		}
		return {
			rp1: rp1,
			rp2: rp2,
			gp1: gp1,
			gp2: gp2,
			rel: rel,
			mag: mag,
			depth: depth,
			normal: normal,
			solve: solve
		};
	};
	
	
	Regulus.ElasticConstraint.prototype.solve = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		if ( ! cd.solve ) return;
		
		var A = this.body1;
		var B = this.body2;
		
		var ra = cd.rp1;
		var rb = cd.rp2;
		
		var rv = B.getVelo( cd.normal.perp(), rb ).sub( A.getVelo( cd.normal.perp(), ra ) );
		
		var velAlongNormal = rv.dot( cd.normal );
		
//		if ( velAlongNormal > 0 ) {
//			return;
//		}
		
		var raCn = ra.cross( cd.normal );
		var rbCn = rb.cross( cd.normal );
		var invMassSum = A.getInvMass() + B.getInvMass() + raCn * raCn * A.getInvInertia() + rbCn * rbCn * B.getInvInertia();
		
		var k = this.springConstant;
		var x = cd.depth;
		var b = this.damping;
		var v = velAlongNormal;
		
		var j = k * x - b * v;
		
		var impulse = cd.normal.mul( j );
		A.applyImpulse( impulse.neg(), ra );
		B.applyImpulse( impulse, rb );
		
	};

	Regulus.ElasticConstraint.prototype.correction = function() {
		// TODO: Correction
	};
	
	Regulus.ElasticConstraint.prototype.type = "Elastic";
	
}() );
