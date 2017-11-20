( function() {
	
	Regulus.Body = function( shape, p ) {
		p = p || {};
		this.shape = shape;
		this.position = new Regulus.Vector( p.position );
		this.rotation = p.rotation || 0;
		this.velocity = new Regulus.Vector( p.velocity );
		this.angular = p.angular || 0;
		this.mass = typeof p.mass === "number" ? p.mass : p.density ? shape.mass( p.density ) : shape.mass( 0.001 );
		this.inertia = typeof p.inertia === "number" ? p.inertia : p.density ? shape.inertia( p.density ) : shape.inertia( 0.001 );
		this.restitution = p.restitution || 0;
		this.staticFriction = typeof p.staticFriction === "number" ? p.staticFriction : 0.1;
		this.dynamicFriction = typeof p.dynamicFriction === "number" ? p.dynamicFriction : 0.1;
		this.conveyor = p.conveyor || 0;
		this.static = typeof p.static === "boolean" ? p.static : false;
		this.rotationStatic = typeof p.rotationStatic === "boolean" ? p.rotationStatic : false;
		this.color = typeof p.color === "string" ? p.color : this.static ? Regulus.Colormap.static : Regulus.Colormap[ Math.floor( Math.random() * Regulus.Colormap.length ) ];
		this.positionVel = new Regulus.Vector();
		this.collisionLayers = Array.isArray( p.collisionLayers ) ? p.collisionLayers : [ 0 ];
	};
	
	
		
	Regulus.Body.prototype.getVelo = function( normal, r ) {
		return this.velocity.add( this.positionVel ).Add( normal.mul( this.conveyor ) ).Sub( Regulus.Math.scalarVec( - this.angular, r ) );
	};

	Regulus.Body.prototype.getGlobalizedShape = function( nd ) {
		
		if ( this.shape.type === "Polygon" && ! nd ) {
			var shape = this.shape.globalized( this.shape.rotation + this.rotation, this.shape.position.add( this.position ) );
			if ( shape.isClockwise() ) {
				shape.reverse();
			}
			shape.position.Add( this.position );
			shape.rotation += this.rotation;
			return shape;
		} else {
			var shape = this.shape.clone();
			shape.position.Add( this.position );
			shape.rotation += this.rotation;
			return shape;
		}
		
	};

	Regulus.Body.prototype.getInvMass = function() {
		return this.static ? 0 : 1 / this.mass;
	};
	Regulus.Body.prototype.getInvInertia = function() {
		return this.static || this.rotationStatic ? 0 : 1 / this.inertia;
	};
	
	Regulus.Body.prototype.applyImpulse = function( impulse, contact ) {
		if ( ! this.static ) this.velocity.Add( impulse.mul( this.getInvMass() ) );
		if ( ! this.static && ! this.rotationStatic ) this.angular += contact.cross( impulse ) * this.getInvInertia();
	};
	
}() );
