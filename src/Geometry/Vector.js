( function() {
	
	function validate( x, y ) {
		
		// Handle ()
		var vx = 0, vy = 0;
		if ( typeof x === "number" || typeof x === "object" ) {
			// Handle ( num, num )
			if ( typeof x === "number" && typeof y === "number" ) {
				vx = x;
				vy = y;

			// Handle ( num )
			} else if ( typeof x === "number" && typeof y !== "number" ) {
				vx = x;
				vy = x;
				
			// Handle ( arr )
			} else if ( typeof x[ 0 ] === "number"  ) {
				vx = x[ 0 ];
				var x1 = x[ 1 ];
				vy = typeof x1 === "number" ? x1 : vx;

			// Handle ( obj )
			} else if ( typeof x.x === "number" ) {
				vx = x.x;
				vy = typeof x.y === "number" ? x.y : x.x;
			}
		}
		
		return { x: vx, y: vy };
	}
	
	Regulus.Vector = function( x, y ) {
		
		var v = validate( x, y );
		this.x = v.x;
		this.y = v.y;
		
	};

	Regulus.Vector.prototype.add = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x + vec.x;
		var my = this.y + vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.sub = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x - vec.x;
		var my = this.y - vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.mul = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x * vec.x;
		var my = this.y * vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.div = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x / vec.x;
		var my = this.y / vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.addsub = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x + vec.x;
		var my = this.y - vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.subadd = function( x, y ) {
		var vec = validate( x, y );
		var mx = this.x - vec.x;
		var my = this.y + vec.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.mag = this.len = function() {
		return Math.sqrt( this.magsq() );
	};

	Regulus.Vector.prototype.magsq = this.lensq = function() {
		return this.x * this.x + this.y * this.y;
	};

	Regulus.Vector.prototype.dir = function() {
		if ( this.x > 0 && this.y === 0 ) {
			return Math.PI / 2;
		}
		if ( this.x < 0 && this.y === 0 ) {
			return Math.PI / 2 + Math.PI;
		}
		if ( this.x === 0 && this.y === 0 ) {
			return 0;
		}
		if ( this.x === 0 && this.y > 0 ) {
			return 0;
		}
		if ( this.x === 0 && this.y < 0 ) {
			return Math.PI;
		}
		if ( this.x > 0 ) {
			return Math.atan2( this.x, this.y );
		}
		return Math.atan2( this.x, this.y ) + 2 * Math.PI;
	};

	Regulus.Vector.prototype.dist = function( x, y ) {
		return Math.sqrt( this.distsq( x, y ) );
	};

	Regulus.Vector.prototype.distsq = function( x, y ) {
		var vec = validate( x, y );
		var vx = this.x - vec.x, vy = this.y - vec.y;
		return vx * vx + vy * vy;
	};

	Regulus.Vector.prototype.dot = function( x, y ) {
		var vec = validate( x, y );
		return this.x * vec.x + this.y * vec.y;
	};

	Regulus.Vector.prototype.cross = function( x, y ) {
		var vec = validate( x, y );
		return this.x * vec.y - this.y * vec.x;
	};

	Regulus.Vector.prototype.neg = function() {
		var mx = - this.x;
		var my = - this.y;
		return new Regulus.Vector( mx, my );
	};

	Regulus.Vector.prototype.perp = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return new Regulus.Vector( 0, - 1 );
		}
		return new Regulus.Vector( this.y, - this.x );
	};

	Regulus.Vector.prototype.norm = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return new Regulus.Vector( 1, 0 );
		}
		return this.div( mag );
	};

	Regulus.Vector.prototype.negperp = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return new Regulus.Vector( 0, 1 );
		}
		return new Regulus.Vector( - this.y, this.x );
	};

	Regulus.Vector.prototype.rotate = function( angle ) {
		var cos = Math.cos( angle );
		var sin = Math.sin( angle );
		return new Regulus.Vector( this.x * cos - this.y * sin, this.x * sin + this.y * cos );
	};

	Regulus.Vector.prototype.rotateSinCos = function( sin, cos ) {
		return new Regulus.Vector( this.x * cos - this.y * sin, this.x * sin + this.y * cos );
	};

	Regulus.Vector.prototype.set = function( x, y ) {
		var vec = validate( x, y );
		this.x = vec.x;
		this.y = vec.y;
		return this;
	};

	Regulus.Vector.prototype.setpolar = function( r, t ) {
		var x = Math.sin( t ) * r;
		var y = Math.cos( t ) * r;
		this.x = x;
		this.y = y;
		return this;
	};

	Regulus.Vector.prototype.project = function( x, y ) {
		var vec = new Regulus.Vector( x, y );
		var proj = vec.norm().mul( this.dot( vec.norm() ) );
		return proj;
	};

	Regulus.Vector.prototype.rawProject = function( x, y ) {
		var vec = new Regulus.Vector( x, y );
		return this.dot( vec.norm() );
	};

	Regulus.Vector.prototype.clone = function() {
		return new Regulus.Vector( this.x, this.y );
	};

	Regulus.Vector.prototype.parallelTo = function( x, y ) {
		return Math.abs( this.cross( x, y ) ) < 0.0000001;
	};

	Regulus.Vector.prototype.Add = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x + vec.x, this.y + vec.y );
	};

	Regulus.Vector.prototype.Sub = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x - vec.x, this.y - vec.y );
	};

	Regulus.Vector.prototype.Mul = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x * vec.x, this.y * vec.y );
	};

	Regulus.Vector.prototype.Div = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x / vec.x, this.y / vec.y );
	};

	Regulus.Vector.prototype.Addsub = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x + vec.x, this.y - vec.y );
	};

	Regulus.Vector.prototype.Subadd = function( x, y ) {
		var vec = validate( x, y );
		return this.set( this.x - vec.x, this.y + vec.y );
	};

	Regulus.Vector.prototype.Neg = function() {
		return this.set( - this.x, - this.y );
	};

	Regulus.Vector.prototype.Perp = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return this.set( 0, - 1 );
		}
		return this.set( this.y, - this.x );
	};

	Regulus.Vector.prototype.Norm = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return this.set( 1, 0 );
		}
		return this.set( this.x / mag, this.y / mag );
	};

	Regulus.Vector.prototype.Negperp = function() {
		var mag = this.mag();
		if ( mag === 0 ) {
			return this.set( 0, 1 );
		}
		return this.set( - this.y, this.x );
	};

	Regulus.Vector.prototype.Rotate = function( angle ) {
		var cos = Math.cos( angle );
		var sin = Math.sin( angle );
		var x = this.x * cos - this.y * sin;
		var y = this.x * sin + this.y * cos;
		this.x = x;
		this.y = y;
		return this;
	};

	Regulus.Vector.prototype.RotateSinCos = function( sin, cos ) {
		var x = this.x * cos - this.y * sin;
		var y = this.x * sin + this.y * cos;
		this.x = x;
		this.y = y;
		return this;
	};

	Regulus.Vector.prototype.Project = function( x, y ) {
		return this.set( this.project( x, y ) );
	};
		
	// | Average
	Regulus.Vector.average = function( arr ) {
		var x = 0;
		var y = 0;
		if ( arr.length === 1 ) {
			return arr[ 0 ];
		}
		for ( var i = 0; i < arr.length; i ++ ) {
			x += arr[ i ].x;
			y += arr[ i ].y;
		}
		return new Regulus.Vector( x / arr.length, y / arr.length );
	};
	
	// | FromPolar
	Regulus.Vector.fromPolar = function( r, t ) {
		return new Regulus.Vector().setpolar( r, t );
	};
	
	// | FromDirection
	Regulus.Vector.fromDirection = function( t ) {
		return new Regulus.Vector().setpolar( 1, t );
	};
	
}() );
