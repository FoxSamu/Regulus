( function() {
	
	Regulus.Collision = function( body1, body2 ) {
		this.collide = false;
		this.normal = null;
		this.depth = null;
		this.body1 = body1;
		this.body2 = body2;
		this.collisions = 0;
		this.points1 = [];
		this.points2 = [];
		
		var shape1 = body1.getGlobalizedShape();
		var shape2 = body2.getGlobalizedShape();
		
		var checkCollision = true;
		if ( shape1.getBox && shape2.getBox ) {
			if ( ! shape1.getBox().overlap( shape2.getBox() ) ) {
				checkCollision = false;
			}
		}
		if ( body1.static && body2.static ) {
			checkCollision = false;
		}
		
		
		var collision = false, flip = false;
		if ( checkCollision ) {
			if ( shape1.type === "Circle" && shape2.type === "Circle" ) {
				collision = Regulus.CircleCircle( shape1, shape2 );
			}
			if ( shape1.type === "Circle" && shape2.type === "Polygon" ) {
				collision = Regulus.CirclePolygon( shape1, shape2 );
			}
			if ( shape1.type === "Polygon" && shape2.type === "Circle" ) {
				collision = Regulus.CirclePolygon( shape2, shape1 );
				flip = true;
			}
			if ( shape1.type === "Polygon" && shape2.type === "Polygon" ) {
				collision = Regulus.PolygonPolygon( shape1, shape2 );
			}
			if ( shape1.type === "Circle" && shape2.type === "InfinitePlane" ) {
				collision = Regulus.CirclePlane( shape1, shape2 );
			}
			if ( shape1.type === "InfinitePlane" && shape2.type === "Circle" ) {
				collision = Regulus.CirclePlane( shape2, shape1 );
				flip = true;
			}
			if ( shape1.type === "Polygon" && shape2.type === "InfinitePlane" ) {
				collision = Regulus.PolygonPlane( shape1, shape2 );
			}
			if ( shape1.type === "InfinitePlane" && shape2.type === "Polygon" ) {
				collision = Regulus.PolygonPlane( shape2, shape1 );
				flip = true;
			}
			if ( shape1.type === "Circle" && shape2.type === "InfiniteBar" ) {
				collision = Regulus.CircleBar( shape1, shape2 );
			}
			if ( shape1.type === "InfiniteBar" && shape2.type === "Circle" ) {
				collision = Regulus.CircleBar( shape2, shape1 );
				flip = true;
			}
			if ( shape1.type === "Polygon" && shape2.type === "InfiniteBar" ) {
				collision = Regulus.PolygonBar( shape1, shape2 );
			}
			if ( shape1.type === "InfiniteBar" && shape2.type === "Polygon" ) {
				collision = Regulus.PolygonBar( shape2, shape1 );
				flip = true;
			}
		}
		if ( collision ) {
			this.collide = true;
			this.normal = flip ? collision.normal : collision.normal.neg();
			this.depth = collision.depth;
			this.collisions = collision.p1.length;
			this.points1 = flip ? collision.p1 : collision.p2;
			this.points2 = flip ? collision.p2 : collision.p1;
		}
	};
		
	Regulus.Collision.prototype.solve = function( renderer ) {
		if ( ! this.collide ) return;
		var A = this.body1;
		var B = this.body2;
		var normal = this.normal;
		var p1l = this.points1.length;
		for ( var i = 0; i < p1l; i ++ ) {
			var ra = this.points1[ i ];
			var rb = this.points2[ i ];
			var rv = B.getVelo( normal.perp(), rb ).sub( A.getVelo( normal.negperp(), ra ) );
			var velAlongNormal = rv.dot( normal );
			var raCn = ra.cross( normal );
			var rbCn = rb.cross( normal );
			var invMassSum = A.getInvMass() + B.getInvMass() + raCn * raCn * A.getInvInertia() + rbCn * rbCn * B.getInvInertia();

			if ( velAlongNormal > 0 ) return;

			var e = Math.min( A.restitution, B.restitution );
			var j = - ( 1 + e ) * velAlongNormal;
			j /= invMassSum;
			j /= p1l;

			var impulse = normal.mul( j );
			A.applyImpulse( impulse.neg(), ra );
			B.applyImpulse( impulse, rb );
			
			var tangent = rv.project( normal.perp() );
			tangent.Norm();


			var jt = rv.dot( tangent );
			jt /= invMassSum;
			jt /= p1l;
			jt = Math.round( jt * 100000 ) / 100000;

			var mu = Regulus.Math.pythagoreanSolve( A.staticFriction, B.staticFriction );
			var frictionImpulse;
			if ( Math.abs( jt ) < j * mu ) {
				frictionImpulse = tangent.mul( jt );
			} else {
				var dynamicFriction = Regulus.Math.pythagoreanSolve( A.dynamicFriction, B.dynamicFriction );
				frictionImpulse = tangent.mul( - j ).Mul( dynamicFriction );
			}
			A.applyImpulse( frictionImpulse.neg(), ra );
			B.applyImpulse( frictionImpulse, rb );
		}
	};

	Regulus.Collision.prototype.correction = function() {
		if ( ! this.collide ) return;
		var A = this.body1;
		var B = this.body2;
		var normal = this.normal;
		var depth = this.depth;
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
	
}() );
