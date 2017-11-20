( function() {
	
	/**
	 * Clamps the distance between two points to a min and a max.
	 * @constructor SpringConstraint
	 * @param { Body }   body1 - The first body that is connected to the constraint.
	 * @param { Vector } pt1   - The point where the first body is connected, relative to it's position.
	 * @param { Body }   body2 - The second body that is connected to the constraint.
	 * @param { Vector } pt2   - The point where the second body is connected, relative to it's position.
	 * @param { Object } p     - Properties of the constraint.
	 */
	Regulus.DistanceConstraint = function( body1, pt1, body2, pt2, p ) {
		
		p = p || {};
		this.body1 = body1;
		this.body2 = body2;
		this.pt1 = pt1;
		this.pt2 = pt2;
		
		this.mindistance = typeof p.mindistance === "number" ? p.mindistance : 100;
		this.maxdistance = typeof p.maxdistance === "number" ? p.maxdistance : 100;
		this.disableCollision = typeof p.disableCollision === "boolean" ? p.disableCollision : true;
		this.enabled = typeof p.enabled === "boolean" ? p.enabled : true;
	};
	
	Regulus.DistanceConstraint.prototype.getCorrectionData = function() {
		var rp1 = this.pt1.rotate( this.body1.rotation );
		var rp2 = this.pt2.rotate( this.body2.rotation );
		var gp1 = rp1.add( this.body1.position );
		var gp2 = rp2.add( this.body2.position );
		var rel = gp2.sub( gp1 );
		var solve = false;
		var mag = rel.mag();
		var depth = 0;
		var normal = rel.neg().norm();
		if ( mag > this.maxdistance ) {
			depth = mag - this.maxdistance;
			solve = true;
		}
		if ( mag < this.mindistance ) {
			depth = this.mindistance - mag;
			solve = true;
			normal.Neg();
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
	
	
	Regulus.DistanceConstraint.prototype.solve = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
		if ( ! cd.solve ) return;
		
		var A = this.body1;
		var B = this.body2;
		
		var ra = cd.rp1;
		var rb = cd.rp2;
		
		var rv = B.getVelo( cd.normal.perp(), rb ).sub( A.getVelo( cd.normal.perp(), ra ) );
		
		var velAlongNormal = rv.dot( cd.normal );
		
		if ( velAlongNormal > 0 ) {
			return;
		}
		
		var raCn = ra.cross( cd.normal );
		var rbCn = rb.cross( cd.normal );
		var invMassSum = A.getInvMass() + B.getInvMass() + raCn * raCn * A.getInvInertia() + rbCn * rbCn * B.getInvInertia();
		
		var j = - velAlongNormal;
		j /= invMassSum;
		
		var impulse = cd.normal.mul( j );
		A.applyImpulse( impulse.neg(), ra );
		B.applyImpulse( impulse, rb );
		
	};

	Regulus.DistanceConstraint.prototype.correction = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		if ( ! cd.solve ) return;
		
		var A = this.body1;
		var B = this.body2;
		
		var depth = cd.depth;
		var normal = cd.normal;
		
		var percent = 0.2;
		var slop = 0;
		var correction = normal.mul( Math.max( depth - slop, 0 ) / ( A.getInvMass() + B.getInvMass() ) * percent );
		if ( A.static ) {
			B.positionVel.Add( correction.mul( B.getInvMass() ) );
		} else if ( B.static ) {
			A.positionVel.Sub( correction.mul( A.getInvMass() ) );
		} else {
			A.positionVel.Sub( correction.mul( A.getInvMass() ) );
			B.positionVel.Add( correction.mul( B.getInvMass() ) );
		}
	};
	
	Regulus.DistanceConstraint.prototype.type = "Distance";
	
}() );
