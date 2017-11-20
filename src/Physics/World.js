( function() {
	
	Regulus.World = function() {
		
		this.gravity = new Regulus.Vector( 0, 0.1 );
		this.air = 0;
		
		this.bodies = [];
		this.constraints = [];
		this.forcefields = [];
		this.sensors = [];
		
		this.collisions = [];
		
		this.timeScale = 0.5;
		this.iterations = 6;
		this.time = 0;
		
		this.air = 0.001;
		this.wind = new Regulus.Vector( 0, 0 );
		
		// Define some body properties so constraints can be applied on the background by using the world as a body.
		this.static = true;
		this.velocity = new Regulus.Vector();
		this.angular = 0;
		this.position = new Regulus.Vector();
		this.rotation = 0;
		this.positionVel = new Regulus.Vector();
	};
	
	Regulus.World.prototype.getVelo = function() {
		return new Regulus.Vector();
	};
	
	Regulus.World.prototype.getInvMass = function() {
		return 0;
	};
	
	Regulus.World.prototype.getInvInertia = function() {
		return 0;
	};
	
	Regulus.World.prototype.applyImpulse = function() {
		// Do nothing, the background is a static body
	};
	
	Regulus.World.prototype.physics = function( renderer ) {
		
		this.static = true;
		this.velocity.set();
		this.position.set();
		this.positionVel.set();
		this.angular = 0;
		this.rotation = 0;
		
		this.time += this.timeScale;

		this.collisions = [];
		var dt = this.timeScale / this.iterations;
		for ( var it = 0; it < this.iterations; it ++ ) {
			for ( var i = 0; i < this.bodies.length; i ++ ) {
				var body = this.bodies[ i ];
				
				// Store duplicated forces so forcefields can change them
				var data = {
					gravity: this.gravity.clone(),
					air: this.air,
					wind: this.wind.clone()
				};
				
				for ( var j = 0; j < this.forcefields.length; j ++ ) {
					var FF = this.forcefields[ j ];
					FF.applyOnBody( body, dt, data );
				}
				
				if ( ! body.static ) body.velocity.Add( data.gravity.mul( dt ) );
				if ( ! body.static ) body.velocity.Add( body.velocity.sub( data.wind ).neg().mul( data.air * body.getInvMass() ) );
				if ( ! body.static ) body.angular -= body.angular * data.air;

				for ( var j = i + 1; j < this.bodies.length; j ++ ) {
					var body2 = this.bodies[ j ];
					if ( this.bodiesCanCollide( body, body2 ) ) {
						var coll = new Regulus.Collision( body, body2 );
						if ( coll.collide ) {
							this.collisions.push( coll );
						}
					}
				}
			}

			for ( var i = 0; i < this.collisions.length; i ++ ) {
				var collision = this.collisions[ i ];
				collision.solve( renderer.renderer );
				collision.correction();
			}
			
			for ( var i = 0; i < this.constraints.length; i ++ ) {
				var constraint = this.constraints[ i ];
				constraint.solve();
				constraint.correction();
			}

			for ( var i = 0; i < this.bodies.length; i ++ ) {
				var body = this.bodies[ i ];
				if ( ! body.static ) body.position.Add( body.velocity.mul( dt ) );
				if ( ! body.rotationStatic && ! body.static ) body.rotation += body.angular * dt;
				if ( ! body.static ) body.position.Add( body.positionVel );
				body.positionVel.set( 0 );
			}
		}

	};
	
	Regulus.World.prototype.bodiesCanCollide = function( body1, body2 ) {
		
		// First check if bodies have an equal collision layer.
		
		if ( body1.collisionLayers.length < 1 ) return false;
		if ( body2.collisionLayers.length < 1 ) return false;
		
		var b = false;
		for ( var i = 0; i < body1.collisionLayers.length; i ++ ) {
			
			for ( var j = 0; j < body2.collisionLayers.length; j ++ ) {
				
				if ( body1.collisionLayers[ i ] === body2.collisionLayers[ j ] ) {
					
					b = true;
					
				}
				
			}
			
		}
		
		if ( ! b ) return false;
		
		var constr = this.findConstraintWithBodies( body1, body2 );
		
		if ( constr ) {
			if ( constr.type === "Disable" && constr.enabled ) {
				return false;
			}
			if ( constr.disableCollision ) {
				return false;
			}
		}
		
		return true;
	};
	
	Regulus.World.prototype.findConstraintWithBodies = function( body1, body2 ) {
		
		for ( var i = 0; i < this.constraints.length; i ++ ) {
			
			var constraint = this.constraints[ i ];
			
			if ( constraint.type === "Slider" ) {
				continue;
			}
			
			if ( constraint.type === "Disable" ) {
				var a, b;
				for ( var x = 0; x < constraint.bodies.length; x ++ ) {
					var c = constraint.bodies[ x ];
					if ( c === body1 ) a = true;
					if ( c === body2 ) b = true;
					if ( a && b ) return constraint;
				}
				continue;
			}
			
			if ( constraint.body1 === body1 && constraint.body2 === body2 || constraint.body2 === body1 && constraint.body1 === body2 ) {
				
				return constraint;
				
			}
			
		}
		
		return null;
		
	};
	
}() );
