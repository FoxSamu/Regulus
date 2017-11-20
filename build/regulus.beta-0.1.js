( function() {
	
	var Regulus = {};
	
	Regulus.Colormap = {
		static: "#303045",
		elements: "#222222",
		"0": "#1078f1",
		"1": "#d12110",
		"2": "#10b121",
		"3": "#107131",
		"4": "#f1b120",
		"5": "#1020f1",
		"6": "#f18120",
		"7": "#6710f1",
		rope: "#888",
		length: 8
	};
	
	window.Regulus = Regulus;
	
}() );

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

( function() {
	
	Regulus.Box = function( pos, size ) {
		this.pos = new Regulus.Vector( pos );
		this.size = new Regulus.Vector( size );
	};
	
	Regulus.Box.prototype.getMin = function() {
		return this.pos.sub( this.size.x / 2, this.size.y / 2 );
	};

	Regulus.Box.prototype.getMax = function() {
		return this.pos.add( this.size.x / 2, this.size.y / 2 );
	};

	Regulus.Box.prototype.setMin = function( min ) {
		var max = this.getMax();
		var size = max.sub( min );
		var pos = min.add( size.div( 2 ) );
		this.pos = pos;
		this.size = size;
	};

	Regulus.Box.prototype.setMax = function( max ) {
		var min = this.getMin();
		var size = max.sub( min );
		var pos = min.add( size.div( 2 ) );
		this.pos = pos;
		this.size = size;
	};

	Regulus.Box.prototype.area = function() {
		return this.size.x * this.size.y;
	};

	Regulus.Box.prototype.circumference = function() {
		return this.size.x * 2 + this.size.y * 2;
	};

	Regulus.Box.prototype.inside = function( pt ) {
		var min = this.getMin();
		var max = this.getMax();
		return pt.x >= min.x && pt.x <= max.x && pt.y >= min.y && pt.y <= max.y;
	};

	Regulus.Box.prototype.overlap = function( box ) {
		var tmin = this.getMin();
		var tmax = this.getMax();
		var bmin = box.getMin();
		var bmax = box.getMax();

		return tmin.x <= bmax.x && tmax.x >= bmin.x && tmin.y <= bmax.y && tmax.y >= bmin.y;
	};
	
	Regulus.Box.fromMinMax = function( min, max ) {
		min = new Regulus.Vector( min );
		max = new Regulus.Vector( max );
		var center = min.add( max ).Div( 2 );
		var size = max.sub( min );
		return new Regulus.Box( center, size );
	};
	
}() );

( function() {
	
	Regulus.DistanceToLine = function( point, p1, p2 ) {
		
		// Vector from p1 to p2
		var edge = p2.sub( p1 );
		
		// Vector from p1 to point
		var relative = point.sub( p1 );
		
		// Projection magnitude in relation to the edge vector
		var projLen = relative.dot( edge.norm() ) / edge.mag();
		
		// If projection is on edge
		if ( projLen > 0 && projLen < 1 ) {
			
			// Calculate projection vector
			var proj = edge.mul( projLen );
			
			// Vector between proj and relative
			var norm = relative.sub( proj );
			
			// Magnitude of norm is distance to line, return magnitude of norm
			return norm.mag();
		} else if ( projLen <= 0 ) {
			
			// Closer to p1, return distance to p1
			return point.dist( p1 );
		} else {
			
			// Closer to p2, return distance to p2
			return point.dist( p2 );
		}
	};
	
	Regulus.DistToLineInfo = function( point, p1, p2 ) {
		
		// Vector from p1 to p2
		var edge = p2.sub( p1 );
		
		// Vector from p1 to point
		var relative = point.sub( p1 );
		
		// Projection magnitude in relation to the edge vector
		var projLen = relative.dot( edge.norm() ) / edge.mag();
		
		// If projection is on edge
		if ( projLen > 0 && projLen < 1 ) {
			
			// Calculate projection vector
			var proj = edge.mul( projLen );
			
			// Vector between proj and relative
			var norm = relative.sub( proj );
			
			// Magnitude of norm is distance to line, return magnitude of norm
			return {
				distance: norm.mag(),
				onEdge: true,
				p1: false,
				p2: false,
				normal: norm.norm().neg(),
				closest: p1.add( proj )
			};
		} else if ( projLen <= 0 ) {
			
			// Closer to p1, return distance to p1
			return {
				distance: point.dist( p1 ),
				onEdge: false,
				p1: true,
				p2: false,
				normal: p1.sub( point ).norm(),
				closest: p1
			};
		} else {
			
			// Closer to p2, return distance to p2
			return {
				distance: point.dist( p2 ),
				onEdge: false,
				p1: false,
				p2: true,
				normal: p2.sub( point ).norm(),
				closest: p2
			};
		}
	};
	
}() );

( function() {
	// Implementation of Paul Bourke
	Regulus.IntersectionPoint = function( p1, p2, p3, p4 ) {
		var x1 = p1.x;
		var x2 = p2.x;
		var x3 = p3.x;
		var x4 = p4.x;
		var y1 = p1.y;
		var y2 = p2.y;
		var y3 = p3.y;
		var y4 = p4.y;
		var ua, ub, denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );
		ua = ( ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 ) ) / denom;
		ub = ( ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 ) ) / denom;
		return {
			pt: new Regulus.Vector( x1 + ua * ( x2 - x1 ), y1 + ua * ( y2 - y1 ) ),
			seg1: ua >= - 0.0001 && ua <= 1.0001,
			seg2: ub >= - 0.0001 && ub <= 1.0001,
			between1: ua - 0.0001 > 0 && ua + 0.0001 < 1,
			between2: ub - 0.0001 > 0 && ub + 0.0001 < 1,
			u1: ua,
			u2: ub
		};
	};
}() );

( function() {
	
	Regulus.Math = {
		clamp: function( val, min, max ) {
			if ( val < min ) return min;
			if ( val > max ) return max;
			return val;
		},
		inRange: function( val, min, max ) {
			return val > min && val < max;
		},
		onRange: function( val, min, max ) {
			return val >= min && val <= max;
		},
		vecScalar: function( vec, s ) {
			var a = new Regulus.Vector( vec );
			return new Regulus.Vector( s * a.y, - s * a.x );
		},
		scalarVec: function( s, vec ) {
			var a = new Regulus.Vector( vec );
			return new Regulus.Vector( - s * a.y, s * a.x );
		},
		pythagoreanSolve: function( a, b ) {
			return Math.sqrt( a * a + b * b );
		}
	};
	
}() );

( function() {
	
	Regulus.Vertices = {};
	
	Regulus.Vertices.fromBox = function( width, height ) {
		
		var x = width / 2;
		var y = height / 2;
		
		return [
			[ - x, - y ],
			[ - x, y ],
			[ x, y ],
			[ x, - y ]
		];
		
	};
	
	Regulus.Vertices.fromSquare = function( width ) {
		
		var x = width / 2;
		var y = width / 2;
		
		return [
			[ - x, - y ],
			[ - x, y ],
			[ x, y ],
			[ x, - y ]
		];
		
	};
	
	Regulus.Vertices.fromRegularPolygon = function( radius, edges ) {
		
		var arr = [];
		
		var size = Math.PI / ( edges / 2 );
		
		for ( var i = 0; i < edges; i ++ ) {
			arr.push( [ Math.sin( size * i ) * radius, Math.cos( size * i ) * radius ] );
		}
		
		return arr;
		
	};
	
}() );

( function() {
	
	Regulus.Circle = function( radius, rotation, position ) {
		
		this.radius = radius;
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
	
		
	Regulus.Circle.prototype.center = function() {
		return this.position;
	};

	Regulus.Circle.prototype.alignCenter = function() {
		this.position.set( 0, 0 );
	};

	Regulus.Circle.prototype.area = function() {
		return this.radius * this.radius * Math.PI;
	};

	Regulus.Circle.prototype.circumference = function() {
		return 2 * this.radius * Math.PI;
	};

	Regulus.Circle.prototype.getBox = function() {
		return new Regulus.Box( this.position, this.radius * 2 );
	};

	Regulus.Circle.prototype.clone = function() {
		return new Regulus.Circle( this.radius, this.rotation, this.position );
	};
	
	Regulus.Circle.prototype.mass = function( density ) {
		return this.area() * density;
	};
	
	Regulus.Circle.prototype.inertia = function( density ) {
		return this.mass( density ) * this.radius * this.radius;
	};
	
	Regulus.Circle.prototype.pointInside = function( point ) {
		return this.position.dist( point ) <= this.radius;
	};

	Regulus.Circle.prototype.type = "Circle";
	
}() );

( function() {
	
	Regulus.Polygon = function( vertices, rotation, position ) {
		
		this.vertices = [];
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
		var i, l = vertices.length;
		for ( i = 0; i < l; i ++ ) {
			this.vertices.push( new Regulus.Vector( vertices[ i ] ) );
		}
		
	};
	
	// Calculates the raw area
	function area( that ) {
		var total = 0;
		that.forEach( function( next ) {
			total += this.x * next.y;
			total -= this.y * next.x;
		} );
		return total / 2;
	}

	// Calculates the absolute area
	Regulus.Polygon.prototype.area = function() {
		return Math.abs( area( this ) );
	};

	Regulus.Polygon.prototype.isCounterClockwise = this.isAntiClockwise = function() {
		return area( this ) < 0;
	};

	Regulus.Polygon.prototype.isClockwise = function() {
		return area( this ) > 0;
	};

	Regulus.Polygon.prototype.isLineOrPoint = function() {
		return area( this ) === 0;
	};

	// Returns angles that have an inner angle of 180 deg ( PI rad ) or more
	Regulus.Polygon.prototype.getComplexAngles = function() {
		var vertices = [];
		var ccw = this.isClockwise();
		this.forEach( function( next, prev, i ) {
			var nextEdge = next.sub( this );
			var prevEdge = this.sub( prev );

			var angle = ( Math.atan2( nextEdge.x, nextEdge.y ) - Math.atan2( prevEdge.x, prevEdge.y ) + Math.PI * 2 ) % ( Math.PI * 2 ) - Math.PI;

			if ( angle <= 0 && ccw ) {
				vertices.push( {
					vertex: this,
					index: i
				} );
			}
			if ( angle >= 0 && ! ccw ) {
				vertices.push( {
					vertex: this,
					index: i
				} );
			}
		} );
		return vertices;
	};

	Regulus.Polygon.prototype.isConvex = function() {
		if ( this.vertices.length < 4 ) {
			return true;
		}
		return this.getComplexAngles().length < 1;
	};

	Regulus.Polygon.prototype.isConcave = function() {
		if ( this.vertices.length < 4 ) {
			return false;
		}
		return this.getComplexAngles().length > 0;
	};

	Regulus.Polygon.prototype.getSelfIntersections = function() {
		// Store the vertices in a variable because this leads to the current vertex in the foreach callback
		var verts = this;

		var selfIntersections = [];
		verts.forEach( function( next1, prev1, idx1, ni1 ) {
			var this1 = this;
			verts.forEach( function( next2, prev2, idx2, ni2 ) {
				if ( idx2 <= idx1 ) {
					return;
				}
				if ( ni1 === idx2 ) {
					return;
				}
				if ( ni2 === idx1 ) {
					return;
				}
				var isc = Regulus.IntersectionPoint( this1, next1, this, next2 );
				if ( isc.seg1 && isc.seg2 ) {
					selfIntersections.push( {
						index1: idx1,
						index2: idx2,
						point: isc.pt,
						iscObject: isc
					} );
				}
			} );
		} );

		return selfIntersections;
	};

	Regulus.Polygon.prototype.isSimple = function() {
		if ( this.vertices.length < 4 ) {
			return true;
		}
		return this.getSelfIntersections().length < 1;
	};

	Regulus.Polygon.prototype.isComplex = this.isSelfIntersecting = function() {
		if ( this.vertices.length < 4 ) {
			return false;
		}
		return this.getSelfIntersections().length > 0;
	};

	Regulus.Polygon.prototype.isSATCompatible = function() {
		return this.isSimple() && this.isConvex();
	};

	Regulus.Polygon.prototype.isSATIncompatible = function() {
		return this.isComplex() || this.isConcave();
	};

	Regulus.Polygon.prototype.removeDoubles = function() {
		var newpoly = [];
		this.forEach( function( next ) {

			if ( this.dist( next ) > 0.0001 ) {
				newpoly.push( this );
			}

		} );

		this.vertices = newpoly;
	};

	Regulus.Polygon.prototype.clone = function() {
		var poly = new Regulus.Polygon( [] );
		this.forEach( function() {
			poly.pushVertex( this.clone() );
		} );
		poly.rotation = this.rotation + 0;
		poly.position = this.position.clone();
		return poly;
	};

	Regulus.Polygon.prototype.pointInside = function( pt1 ) {
		var pt2 = pt1.add( new Regulus.Vector( 1, 0 ) );
		var inside = false;

		var verts = this.clone();
		verts.globalizeToRotation( this.rotation );
		verts.globalizeToPoint( this.position );

		verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( pt1, pt2, this, next );

			if ( isc.u1 >= 0 && isc.seg2 ) {
				inside = ! inside;
			}
		} );

		return inside;
	};

	Regulus.Polygon.prototype.getBox = function() {
		var minx = Infinity;
		var maxx = - Infinity;
		var miny = Infinity;
		var maxy = - Infinity;

		for ( var i = 0; i < this.vertices.length; i ++ ) {
			var x = this.vertices[ i ].x;
			var y = this.vertices[ i ].y;

			if ( x > maxx ) maxx = x;
			if ( x < minx ) minx = x;
			if ( y > maxy ) maxy = y;
			if ( y < miny ) miny = y;
		}

		return Regulus.Box.fromMinMax( [ minx, miny ], [ maxx, maxy ] );
	};

	Regulus.Polygon.prototype.getSATAxes = function( axes, flip ) {
		axes = axes || [];

		var verts = this;

		if ( this.isClockwise() ) {
			verts.reverse();
		}

		verts.forEach( function( next ) {
			var edge = next.sub( this );
			var axis = edge.perp().norm();
			var push = true;
			var i, l = axes.length;
			for ( i = 0; i < l; i ++ ) {
				if ( axis.parallelTo( axes[ i ] ) ) {
					push = false;
				}
			}
			if ( push ) {
				axes.push( flip ? axis : axis.neg() );
			}
		} );

		return axes;
	};

	Regulus.Polygon.prototype.getBestEdge = function( normal ) {

		// Find vertex with farthest distance along normal
		var verts = this;

		var max = - Infinity;
		var that, next, prev, index;
		verts.forEach( function( nxt, prv, i ) {
			var proj = normal.dot( this );
			if ( proj > max ) {
				max = proj;
				that = this;
				next = nxt;
				prev = prv;
				index = i;
			}
		} );

		// Notice that the winding in this case is in anticlockwise direction, even if the polygon doesn't
		var left = that.sub( next ).Norm();
		var right = that.sub( prev ).Norm();

		if ( right.dot( normal ) <= left.dot( normal ) ) {
			return {
				index: index,
				vertex: that,
				edge: prev.sub( that ),
				vtx1: prev,
				vtx2: that
			};
		} else {
			return {
				index: index,
				vertex: that,
				edge: that.sub( next ),
				vtx1: that,
				vtx2: next
			};
		}
	};

	Regulus.Polygon.prototype.getEdge = function( index ) {
		var index2 = index + 1;
		index2 = index2 >= this.vertices.length ? 0 : index2;
		return this.vertices[ index2 ].sub( this.vertices[ index ] );
	};

	Regulus.Polygon.prototype.globalizeToPoint = function( point ) {
		var l = this.vertices.length;
		for ( var i = 0; i < l; i ++ ) {
			this.vertices[ i ].Add( point );
		}
	};

	Regulus.Polygon.prototype.deglobalizeFromPoint = function( point ) {
		var l = this.vertices.length;
		for ( var i = 0; i < l; i ++ ) {
			this.vertices[ i ].Sub( point );
		}
	};

	Regulus.Polygon.prototype.removeVertex = function( index ) {
		return this.vertices.splice( index, 1 );
	};

	Regulus.Polygon.prototype.addVertex = function( index, x, y ) {
		return this.vertices.splice( index, 0, new Regulus.Vector( x, y ) );
	};

	Regulus.Polygon.prototype.pushVertex = function( x, y ) {
		return this.vertices.push( new Regulus.Vector( x, y ) );
	};

	Regulus.Polygon.prototype.globalizeToRotation = function( rotation ) {
		var l = this.vertices.length;
		// Calculate sin and cos outside the loop, to improve speed
		var sin = Math.sin( rotation );
		var cos = Math.cos( rotation );
		for ( var i = 0; i < l; i ++ ) {
			this.vertices[ i ].RotateSinCos( sin, cos );
		}
	};

	Regulus.Polygon.prototype.globalized = function( rotation, position ) {
		var l = this.vertices.length;
		var poly = new Regulus.Polygon( [] );
		// Calculate sin and cos outside the loop, to improve speed
		var sin = Math.sin( rotation );
		var cos = Math.cos( rotation );
		for ( var i = 0; i < l; i ++ ) {
			poly.pushVertex( this.vertices[ i ].rotateSinCos( sin, cos ).Add( position ) );
		}
		return poly;
	};

	Regulus.Polygon.prototype.forEach = function( func, extr ) {
		var l = this.vertices.length;
		extr = extr || 0;
		for ( var i = 0; i < l + extr; i ++ ) {
			var n = i + 1;
			n = n >= l ? 0 : n;
			var p = i - 1;
			p = p < 0 ? l - 1 : p;
			func.call( this.vertices[ i ], this.vertices[ n ], this.vertices[ p ], i, n, p, function( n ) {
				n = n || 1;
				i += n;
			} );
		}
	};

	Regulus.Polygon.prototype.deglobalizeFromRotation = function( rotation ) {
		var l = this.vertices.length;
		// Calculate sin and cos outside the loop, to improve speed
		var sin = Math.sin( - rotation );
		var cos = Math.cos( - rotation );
		for ( var i = 0; i < l; i ++ ) {
			this.vertices[ i ].RotateSinCos( sin, cos );
		}
	};

	Regulus.Polygon.prototype.deglobalize = function( rotation, position ) {
		var l = this.vertices.length;
		// Calculate sin and cos outside the loop, to improve speed
		var sin = Math.sin( - rotation );
		var cos = Math.cos( - rotation );
		for ( var i = 0; i < l; i ++ ) {
			this.vertices[ i ].RotateSinCos( sin, cos ).Sub( position );
		}
	};

	Regulus.Polygon.prototype.reverse = function() {
		var verts = [];
		var l = this.vertices.length;
		for ( var i = 0; i < l; i ++ ) {
			verts.unshift( this.vertices[ i ] );
		}
		this.vertices = verts;
	};

	Regulus.Polygon.prototype.chamfer = function( radius, quality, qualityMin, qualityMax ) {
		// Implementation by Matter.js, thanks to Liabru for that

		radius = radius || [ 8 ];

		if ( ! radius.length ) {
			radius = [ radius ];
		}

		// Quality defaults to -1, which is auto
		quality = typeof quality !== 'undefined' ? quality : - 1;
		qualityMin = qualityMin || 2;
		qualityMax = qualityMax || 14;

		var newVertices = [];

		if ( this.isClockwise() ) {
			this.reverse();
		}

		var l = this.vertices.length;
		for ( var i = 0; i < l; i ++ ) {
			var prevVertex = this.vertices[ i - 1 >= 0 ? i - 1 : l - 1 ],
				vertex = this.vertices[ i ],
				nextVertex = this.vertices[ ( i + 1 ) % l ],
				currentRadius = radius[ i < radius.length ? i : radius.length - 1 ];

			if ( currentRadius === 0 ) {
				newVertices.push( vertex );
				continue;
			}

			var prevNormal = new Regulus.Vector( vertex.y - prevVertex.y, prevVertex.x - vertex.x ).norm().neg();

			var nextNormal = new Regulus.Vector( nextVertex.y - vertex.y, vertex.x - nextVertex.x ).norm().neg();


			var diagonalRadius = Math.sqrt( 2 * Math.pow( currentRadius, 2 ) ),
				radiusVector = prevNormal.mul( currentRadius ),
				midNormal = prevNormal.add( nextNormal ).mul( 0.5 ).norm(),
				scaledVertex = vertex.sub( midNormal.mul( diagonalRadius ) );

			var precision = quality;

			if ( quality === - 1 ) {
				// Automatically decide precision
				precision = Math.pow( currentRadius, 0.32 ) * 1.75;
			}

			precision = Regulus.Math.clamp( precision, qualityMin, qualityMax );

			// Use an even value for precision, more likely to reduce axes by using symmetry
			if ( precision % 2 === 1 )
				precision += 1;

			var alpha = Math.acos( prevNormal.dot( nextNormal ) ),
				theta = alpha / precision;

			for ( var j = 0; j < precision; j ++ ) {
				newVertices.push( radiusVector.rotate( - theta * j ).add( scaledVertex ) );
			}
		}


		this.vertices = newVertices;
	};
	
	Regulus.Polygon.prototype.mass = function( density ) {
		return this.area() * density;
	};
	
	Regulus.Polygon.prototype.inertia = function( density ) {
		var ix = 0, iy = 0;
		this.forEach( function( next ) {
			var a = this.x * next.y - this.y * next.x;
			iy += ( this.x * this.x + this.x * next.x + next.x * next.x ) * a //( this.x * next.y - this.y * next.x );
			ix += ( this.y * this.y + this.y * next.y + next.y * next.y ) * a //( next.x * this.y - next.y * this.x );
		} );
		ix *= density / 12;
		iy *= density / 12;
		return Math.abs( ix + iy );
	};

	Regulus.Polygon.prototype.type = "Polygon";

	
}() );

( function() {
	
	Regulus.InfiniteBar = function( width, rotation, position ) {
		
		// Infinite bars are the offset of a straight line
		// Width defines the doubled offset
		// Position is a point on the line
		// Rotation is the direction of the perpendicular of the line
		
		this.width = width;
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
	
	Regulus.InfiniteBar.prototype.area = function() {
		return Infinity;
	};

	Regulus.InfiniteBar.prototype.circumference = function() {
		return Infinity;
	};

	// Check using SAT
	Regulus.InfiniteBar.prototype.pointInside = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Math.abs( p ) <= this.width / 2;
	};

	Regulus.InfiniteBar.prototype.pointInPosSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Regulus.Math.onRange( p, 0, this.width / 2 );
	};

	Regulus.InfiniteBar.prototype.pointInNegSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return Regulus.Math.inRange( p, - this.width / 2, 0 );
	};

	Regulus.InfiniteBar.prototype.pointAtPosSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p <= this.width / 2;
	};

	Regulus.InfiniteBar.prototype.pointAtNegSide = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p >= - this.width / 2;
	};

	Regulus.InfiniteBar.prototype.clone = function() {
		return new Regulus.InfiniteBar( this.width, this.rotation, this.position.clone() );
	};

	Regulus.InfiniteBar.prototype.mass = function() {
		return Infinity;
	};

	Regulus.InfiniteBar.prototype.inertia = function() {
		return Infinity;
	};
	
	Regulus.InfiniteBar.prototype.type = "InfiniteBar";
	
}() );

( function() {
	
	
	Regulus.InfinitePlane = function( rotation, position ) {
		
		// Infinite planes are like a circle across three points on the same line,
		// but define it with a normal direction and a point where it goes across.
		
		this.rotation = rotation || 0;
		this.position = new Regulus.Vector( position );
		
	};
		
	Regulus.InfinitePlane.prototype.area = function() {
		// I'ts an INFINITE plane, with an INFINITE area.
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.circumference = function() {
		// I'ts an INFINITE plane, with an INFINITE circumference.
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.pointInside = function( pt ) {
		var n = Regulus.Vector.fromDirection( this.rotation );
		var r = pt.sub( this.position );
		var p = r.rawProject( n );
		return p <= 0;
	};

	Regulus.InfinitePlane.prototype.clone = function() {
		return new Regulus.InfinitePlane( this.rotation, this.position.clone() );
	};

	Regulus.InfinitePlane.prototype.mass = function() {
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.inertia = function() {
		return Infinity;
	};

	Regulus.InfinitePlane.prototype.type = "InfinitePlane";
	
}() );

// NOTE: This code is not expirimental and should not be published.

( function() {
	
	function distance( poly, point ) {
		var verts = poly.clone();
		var mindist = Infinity;
		verts.forEach( function( next ) {
			var dist = Regulus.DistanceToLine( point, this, next );
			if ( dist < mindist ) mindist = dist;
		} );
		return mindist;
	}
	
	function inside( point, poly ) {
		var x = point.x, y = point.y;
		
		var vs = poly.vertices;

		var inside = false;
		for ( var i = 0, j = vs.length - 1; i < vs.length; j = i ++ ) {
			var xi = vs[ i ].x, yi = vs[ i ].y;
			var xj = vs[ j ].x, yj = vs[ j ].y;

			var intersect = yi > y !== yj > y && x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi;
			if ( intersect ) inside = ! inside;
		}

		return inside || distance( poly, point ) < 0.00001;
	}
	
	function numberOfIntersections( poly, p1, p2 ) {
		var verts = poly;
		var iscscounter = 0;
		verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( this, next, p1, p2 );
			if ( isc.between1 && isc.between2 ) {
				iscscounter ++;
			}
		} );
		
		return iscscounter;
	}
	
	function stepDecompositePolygon( poly ) {
		
		poly.removeDoubles();
		
		var verts = poly.clone();
		var complexes = poly.getComplexAngles();
		
		for ( var cpx = 0; cpx < complexes.length; cpx ++ ) {
			
			var complex = complexes[ cpx ];

			// Get the closest point
			var distance = Infinity;
			var closest = null;

			verts.forEach( function( next, prev, idx, n, p ) {
				if ( idx === complex.index || n === complex.index || p === complex.index ) {
					return;
				}
				var dist = complex.vertex.dist( this );
				if (
					dist < distance &&
					numberOfIntersections( poly, complex.vertex, this ) < 1 &&
					inside( this.add( complex.vertex ).div( 2 ), poly )
				) {
					distance = dist;
					closest = {
						vertex: this,
						index: idx
					};
				}
			} );
			if ( closest ) {
				var idx1 = complex.index;
				var idx2 = closest.index;
				if ( idx1 > idx2 ) {
					var flip = idx1;
					idx1 = idx2;
					idx2 = flip;
				}

				var p1 = [];
				var p2 = [];

				verts.forEach( function( next, prev, idx ) {
					if ( idx < idx1 ) {
						p1.push( this );
					} else if ( idx === idx1 || idx === idx2 ) {
						p1.push( this );
						p2.push( this );
					} else if ( idx > idx1 && idx < idx2 ) {
						p2.push( this );
					} else {
						p1.push( this );
					}
				} );

				var v1 = new Regulus.Polygon( p1 );
				var v2 = new Regulus.Polygon( p2 );

				return [
					v1,
					v2
				];
			}
		}
	}
	
	function stepDecomposite( list ) {
		
		var newpolygons = [];
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var po = list[ i ];
			
			if ( po.isConcave() ) {
				var ps = stepDecompositePolygon( po );
				newpolygons.push( ps[ 0 ] );
				newpolygons.push( ps[ 1 ] );
			} else {
				newpolygons.push( po );
			}
			
		}
		
		return newpolygons;
		
	}
	
	function areAllConvex( list ) {
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var po = list[ i ];
			
			if ( po.isConcave() ) {
				return false;
			}
			
		}
		
		return true;
		
	}
	
	
	Regulus.DecompositePolygon = function( poly, renderer ) {
		var polygons = Regulus.SimplifyPolygon( poly, renderer );
		
		while ( ! areAllConvex( polygons ) ) {
			polygons = stepDecomposite( polygons );
		}
		
		return polygons;
	};
	
} () );

( function () {
	
	function simplifyPolygon( poly ) {
		
		var verts = poly.clone();
		var selfIscs = poly.getSelfIntersections();
		
		var isc = selfIscs[ 0 ];
		
		var points1 = [], points2 = [];
		
		var idx1 = isc.index1;
		var idx2 = isc.index2;
		var iscp = isc.point;
		
		if ( idx2 < idx1 ) {
			var flip = idx2;
			idx2 = idx1;
			idx1 = flip;
		}
		
		
		verts.forEach( function( n, p, idx ) {
			
			if ( idx < idx1 ) {
				points1.push( this );
			}
			if ( idx === idx1 ) {
				points1.push( this );
				points1.push( iscp );
				points2.push( iscp );
			}
			if ( idx > idx1 && idx < idx2 ) {
				points2.push( this );
			}
			if ( idx === idx2 ) {
				points2.push( this );
				points1.push( iscp );
				points2.push( iscp );
			}
			if ( idx > idx2 ) {
				points1.push( this );
			}
			
		} );
		
		var verts1 = new Regulus.Vertices( points1 );
		var verts2 = new Regulus.Vertices( points2 );
		
		var poly1 = new Regulus.Polygon( verts1 );
		var poly2 = new Regulus.Polygon( verts2 );
		
		poly1.removeDoubles();
		poly2.removeDoubles();
		
		return [
			poly1,
			poly2
		];
	}
	
	function simplifyPolygons( list ) {
		
		var polygons = [];
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var poly = list[ i ];
			
			if ( poly.isComplex() ) {
				var ps = simplifyPolygon( poly );
				polygons.push( ps[ 0 ] );
				polygons.push( ps[ 1 ] );
			} else {
				polygons.push( poly );
			}
			
		}
		
		return polygons;
		
	}
	
	function areAllSimple( list ) {
		
		for ( var i = 0; i < list.length; i ++ ) {
			
			var poly = list[ i ];
			
			if ( poly.isComplex() ) {
				return false;
			}
			
		}
		
		return true;
		
	}
	
	Regulus.SimplifyPolygon = function ( poly ) {
		
		var polygons = [ poly ];
		while ( ! areAllSimple( polygons ) ) {
			
			polygons = simplifyPolygons( polygons );
			
		}
		
		return polygons;
		
	};
	
}() );

( function() {
	
	Regulus.Renderer = function( canvas ) {
		var ctx = canvas.getContext( "2d" );
		
		this.fill = "red";
		this.border = "";
		this.borderWidth = 2;
		this.zoom = 1;
		this.translate = new Regulus.Vector( - canvas.width / 2, - canvas.height / 2 );
		this.font = "15px Helvetica";
		
		this.worldToCanvas = function( vec ) {
			return vec.sub( this.translate ).mul( this.zoom );
		};
		
		this.canvasToWorld = function( vec ) {
			return vec.div( this.zoom ).add( this.translate );
		};
		
		this.wipe = function() {
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
		};
		
		this.drawPoint = function( pos, d ) {
			pos = this.worldToCanvas( pos );
			d = d || 4;
			var r = d / 2;
			ctx.beginPath();
			ctx.arc( pos.x, pos.y, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
		};
		
		this.drawSquarePoint = function( pos, d ) {
			pos = this.worldToCanvas( pos );
			d = d || 4;
			var r = d / 2;
			var p1 = pos.sub( r );
			ctx.fillStyle = this.fill;
			ctx.fillRect( p1.x, p1.y, d, d );
		};
		
		this.drawCrossPoint = function( pos, d, w ) {
			pos = this.worldToCanvas( pos );
			d = d || 8;
			var r = d / 2;
			var p1 = pos.sub( r, 0 );
			var p2 = pos.add( r, 0 );
			var p3 = pos.sub( 0, r );
			var p4 = pos.add( 0, r );
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = w || 2;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.moveTo( p3.x, p3.y );
			ctx.lineTo( p4.x, p4.y );
			ctx.stroke();
		};
		
		this.drawXPoint = function( pos, d, w ) {
			pos = this.worldToCanvas( pos );
			d = d || 6;
			// Multiply with sin(PI/4) fits it in the radius,
			// so the lines are back to the original diameter
			var r = d / 2 * Math.sin( Math.PI / 4 );
			var p1 = pos.sub( r, r );
			var p2 = pos.add( r, r );
			var p3 = pos.subadd( r, r );
			var p4 = pos.addsub( r, r );
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = w || 2;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.moveTo( p3.x, p3.y );
			ctx.lineTo( p4.x, p4.y );
			ctx.stroke();
		};
		
		this.drawDiamondPoint = function( pos, d ) {
			pos = this.worldToCanvas( pos );
			d = d || 6;
			var r = d / 2;
			var p1 = pos.sub( r, 0 );
			var p2 = pos.add( r, 0 );
			var p3 = pos.sub( 0, r );
			var p4 = pos.add( 0, r );
			ctx.fillStyle = this.fill;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p3.x, p3.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.lineTo( p4.x, p4.y );
			ctx.fill();
		};
		
		this.drawCircPoint = function( pos, d, w ) {
			pos = this.worldToCanvas( pos );
			d = d || 6;
			w = w || 2;
			d -= w;
			var r = d / 2;
			ctx.beginPath();
			ctx.arc( pos.x, pos.y, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = w;
			ctx.stroke();
		};
		
		this.drawPointHighlight = function( pos, d ) {
			pos = this.worldToCanvas( pos );
			d = d || 10;
			var r = d / 2;
			ctx.beginPath();
			ctx.arc( pos.x, pos.y, r, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.globalAlpha = 0.3;
			ctx.fill();
			ctx.globalAlpha = 1;
		};
		
		this.drawVector = function( vec, to, w, l, mul ) {
			mul = mul || 1;
			w = w || 16;
			l = l || 8;
			vec.mul( this.zoom ).mul( mul );
			to = this.worldToCanvas( to );
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( to.x, to.y );
			var n = to.add( vec );
			ctx.lineTo( n.x, n.y );
			ctx.stroke();
			var v0 = vec.perp().norm().mul( w / 2 );
			var v1 = v0.neg();
			var mag = vec.mag() - l;
			var nv = vec.norm().mul( mag );
			var p0 = nv.add( v0 ).add( to );
			var p1 = nv.add( v1 ).add( to );
			ctx.beginPath();
			ctx.moveTo( p0.x, p0.y );
			ctx.lineTo( n.x, n.y );
			ctx.lineTo( p1.x, p1.y );
			ctx.stroke();
		};
		
		this.drawLineVector = function( vec, to, mul ) {
			mul = mul || 1;
			vec.mul( this.zoom ).mul( mul );
			to = this.worldToCanvas( to );
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( to.x, to.y );
			var n = to.add( vec );
			ctx.lineTo( n.x, n.y );
			ctx.stroke();
		};
		
		this.drawNormal = function( vec, to, len, w, l ) {
			len = len || 20;
			this.drawVector( vec.norm(), to, w, l, len );
		};
		
		this.drawLineNormal = function( vec, to, len ) {
			len = len || 20;
			this.drawLineVector( vec.norm(), to, len );
		};
		
		this.drawAngleIndicators = true;
		
		this.drawCircle = function( circle ) {
			
			var pos = this.worldToCanvas( circle.position );
			
			ctx.beginPath();
			ctx.arc( pos.x, pos.y, circle.radius * this.zoom, circle.rotation, Math.PI * 2 + circle.rotation );
			if ( this.drawAngleIndicators ) ctx.lineTo( pos.x, pos.y );
			
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.border;
			ctx.lineWidth = this.borderWidth;
			
			ctx.fill();
			ctx.stroke();
		};
		
		this.drawPolygon = function( polygon ) {
			ctx.beginPath();
			var verts = polygon.clone();
			var that = this;
			var move = true;
			verts.globalizeToRotation( polygon.rotation );
			verts.globalizeToPoint( polygon.position );
			verts.forEach( function() {
				var pos = that.worldToCanvas( this );
				if ( move ) {
					ctx.moveTo( pos.x, pos.y );
					move = false;
				} else {
					ctx.lineTo( pos.x, pos.y );
				}
			} );
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.border;
			ctx.lineWidth = this.borderWidth;
			ctx.fill();
			ctx.stroke();
		};
		
		this.drawPlane = function( plane ) {

			// Some renderering predefinitions
			ctx.strokeStyle = this.border;
			ctx.fillStyle = this.fill;
			ctx.lineWidth = this.borderWidth;

			// Get the planes tangent and normal
			var dir = Regulus.Vector.fromDirection( plane.rotation ).perp();

			// Two points the plane goes through
			var pos1 = plane.position;
			var pos2 = pos1.add( dir );

			// Convert the corners of the screen to world coordinates
			var s1 = this.canvasToWorld( new Regulus.Vector( 0, 0 ) );
			var s3 = this.canvasToWorld( new Regulus.Vector( ctx.canvas.width, ctx.canvas.height ) );
			var s2 = new Regulus.Vector( s3.x, s1.y );
			var s4 = new Regulus.Vector( s1.x, s3.y );

			// Calculate intersection points with edges of screen
			var isc12 = Regulus.IntersectionPoint( s1, s2, pos1, pos2 );
			var isc23 = Regulus.IntersectionPoint( s2, s3, pos1, pos2 );
			var isc34 = Regulus.IntersectionPoint( s3, s4, pos1, pos2 );
			var isc41 = Regulus.IntersectionPoint( s4, s1, pos1, pos2 );
			var pt12 = isc12.pt;
			var pt23 = isc23.pt;
			var pt34 = isc34.pt;
			var pt41 = isc41.pt;

			// Check for present intersections
			var present = [];
			if ( isc12.seg1 ) present.push( pt12 );
			if ( isc23.seg1 ) present.push( pt23 );
			if ( isc34.seg1 ) present.push( pt34 );
			if ( isc41.seg1 ) present.push( pt41 );

			// Make the path that is visible
			var path = [];

			if ( plane.pointInside( s1 ) ) {
				path.push( this.worldToCanvas( s1 ) );
			}
			if ( present[ 0 ] === pt12 || present[ 1 ] === pt12 ) {
				path.push( this.worldToCanvas( pt12 ) );
			}
			if ( plane.pointInside( s2 ) ) {
				path.push( this.worldToCanvas( s2 ) );
			}
			if ( present[ 0 ] === pt23 || present[ 1 ] === pt23 ) {
				path.push( this.worldToCanvas( pt23 ) );
			}
			if ( plane.pointInside( s3 ) ) {
				path.push( this.worldToCanvas( s3 ) );
			}
			if ( present[ 0 ] === pt34 || present[ 1 ] === pt34 ) {
				path.push( this.worldToCanvas( pt34 ) );
			}
			if ( plane.pointInside( s4 ) ) {
				path.push( this.worldToCanvas( s4 ) );
			}
			if ( present[ 0 ] === pt41 || present[ 1 ] === pt41 ) {
				path.push( this.worldToCanvas( pt41 ) );
			}

			// If the path exists, fill it
			if ( path.length > 0 ) {
				ctx.beginPath();
				ctx.moveTo( path[ 0 ].x, path[ 0 ].y );
				for ( var i = 1; i < path.length; i ++ ) {
					ctx.lineTo( path[ i ].x, path[ i ].y );
				}
				ctx.closePath();
				ctx.fill();
			}

			// Draw a line through the intersections with the screen, which will form a border
			if ( present.length === 2 ) {
				var p1 = this.worldToCanvas( present[ 0 ] );
				var p2 = this.worldToCanvas( present[ 1 ] );
				ctx.beginPath();
				ctx.moveTo( p1.x, p1.y );
				ctx.lineTo( p2.x, p2.y );
				ctx.stroke();
			}
		};
		
		this.drawBar = function( bar ) {
			
			var normal = Regulus.Vector.fromDirection( bar.rotation );
			var p1 = normal.mul( bar.width / 2 ).add( bar.position );
			var p3 = normal.neg().mul( bar.width / 2 ).add( bar.position );
			var tangent = normal.perp();
			var p2 = p1.add( tangent );
			var p4 = p3.add( tangent );

			var topLeft = this.canvasToWorld( new Regulus.Vector( 0, 0 ) );
			var topRight = this.canvasToWorld( new Regulus.Vector( canvas.width, 0 ) );
			var bottomRight = this.canvasToWorld( new Regulus.Vector( canvas.width, canvas.height ) );
			var bottomLeft = this.canvasToWorld( new Regulus.Vector( 0, canvas.height ) );
			
			var path = [];
			var posIscs = [];
			var negIscs = [];
			
			if ( bar.pointInside( topLeft ) ) {
				path.push( topLeft );
			}
			
			var posTopIsc = Regulus.IntersectionPoint( p1, p2, topLeft, topRight );
			var negTopIsc = Regulus.IntersectionPoint( p3, p4, topLeft, topRight );
			
			if ( negTopIsc.seg2 && ! posTopIsc.seg2 ) {
				path.push( negTopIsc.pt );
				negIscs.push( negTopIsc.pt );
			}
			
			if ( ! negTopIsc.seg2 && posTopIsc.seg2 ) {
				path.push( posTopIsc.pt );
				posIscs.push( posTopIsc.pt );
			}
			
			if ( negTopIsc.seg2 && posTopIsc.seg2 ) {
				if ( negTopIsc.u2 < posTopIsc.u2 ) {
					path.push( negTopIsc.pt );
					path.push( posTopIsc.pt );
				} else {
					path.push( posTopIsc.pt );
					path.push( negTopIsc.pt );
				}
				negIscs.push( negTopIsc.pt );
				posIscs.push( posTopIsc.pt );
			}
			
			if ( bar.pointInside( topRight ) ) {
				path.push( topRight );
			}
			
			var posRightIsc = Regulus.IntersectionPoint( p1, p2, topRight, bottomRight );
			var negRightIsc = Regulus.IntersectionPoint( p3, p4, topRight, bottomRight );
			
			if ( negRightIsc.seg2 && ! posRightIsc.seg2 ) {
				path.push( negRightIsc.pt );
				negIscs.push( negRightIsc.pt );
			}
			
			if ( ! negRightIsc.seg2 && posRightIsc.seg2 ) {
				path.push( posRightIsc.pt );
				posIscs.push( posRightIsc.pt );
			}
			
			if ( negRightIsc.seg2 && posRightIsc.seg2 ) {
				if ( negRightIsc.u2 < posRightIsc.u2 ) {
					path.push( negRightIsc.pt );
					path.push( posRightIsc.pt );
				} else {
					path.push( posRightIsc.pt );
					path.push( negRightIsc.pt );
				}
				negIscs.push( negRightIsc.pt );
				posIscs.push( posRightIsc.pt );
			}
			
			if ( bar.pointInside( bottomRight ) ) {
				path.push( bottomRight );
			}
			
			var posBottomIsc = Regulus.IntersectionPoint( p1, p2, bottomRight, bottomLeft );
			var negBottomIsc = Regulus.IntersectionPoint( p3, p4, bottomRight, bottomLeft );
			
			if ( negBottomIsc.seg2 && ! posBottomIsc.seg2 ) {
				path.push( negBottomIsc.pt );
				negIscs.push( negBottomIsc.pt );
			}
			
			if ( ! negBottomIsc.seg2 && posBottomIsc.seg2 ) {
				path.push( posBottomIsc.pt );
				posIscs.push( posBottomIsc.pt );
			}
			
			if ( negBottomIsc.seg2 && posBottomIsc.seg2 ) {
				if ( negBottomIsc.u2 < posBottomIsc.u2 ) {
					path.push( negBottomIsc.pt );
					path.push( posBottomIsc.pt );
				} else {
					path.push( posBottomIsc.pt );
					path.push( negBottomIsc.pt );
				}
				negIscs.push( negBottomIsc.pt );
				posIscs.push( posBottomIsc.pt );
			}
			
			if ( bar.pointInside( bottomLeft ) ) {
				path.push( bottomLeft );
			}
			
			var posLeftIsc = Regulus.IntersectionPoint( p1, p2, bottomLeft, topLeft );
			var negLeftIsc = Regulus.IntersectionPoint( p3, p4, bottomLeft, topLeft );
			
			if ( negLeftIsc.seg2 && ! posLeftIsc.seg2 ) {
				path.push( negLeftIsc.pt );
				negIscs.push( negLeftIsc.pt );
			}
			
			if ( ! negLeftIsc.seg2 && posLeftIsc.seg2 ) {
				path.push( posLeftIsc.pt );
				posIscs.push( posLeftIsc.pt );
			}
			
			if ( negLeftIsc.seg2 && posLeftIsc.seg2 ) {
				if ( negLeftIsc.u2 < posLeftIsc.u2 ) {
					path.push( negLeftIsc.pt );
					path.push( posLeftIsc.pt );
				} else {
					path.push( posLeftIsc.pt );
					path.push( negLeftIsc.pt );
				}
				negIscs.push( negLeftIsc.pt );
				posIscs.push( posLeftIsc.pt );
			}
			
			var move = true;
			ctx.beginPath();
			for ( var i = 0; i < path.length; i ++ ) {
				var pt = this.worldToCanvas( path[ i ] );
				if ( move ) {
					ctx.moveTo( pt.x, pt.y );
					move = false;
				} else {
					ctx.lineTo( pt.x, pt.y );
				}
			}
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.strokeStyle = this.border;
			ctx.lineWidth = this.borderWidth;
			
			if ( negIscs.length === 2 ) {
				var pt0 = this.worldToCanvas( negIscs[ 0 ] );
				var pt1 = this.worldToCanvas( negIscs[ 1 ] );
				ctx.beginPath();
				ctx.moveTo( pt0.x, pt0.y );
				ctx.lineTo( pt1.x, pt1.y );
				ctx.stroke();
			}
			
			if ( posIscs.length === 2 ) {
				var pt2 = this.worldToCanvas( posIscs[ 0 ] );
				var pt3 = this.worldToCanvas( posIscs[ 1 ] );
				ctx.beginPath();
				ctx.moveTo( pt2.x, pt2.y );
				ctx.lineTo( pt3.x, pt3.y );
				ctx.stroke();
			}
			
		};
		
		this.drawBox = function( box ) {
			var min = box.getMin();
			var max = box.getMax();
			
			var pt0 = this.worldToCanvas( new Regulus.Vector( min ) );
			var pt1 = this.worldToCanvas( new Regulus.Vector( max.x, min.y ) );
			var pt2 = this.worldToCanvas( new Regulus.Vector( max ) );
			var pt3 = this.worldToCanvas( new Regulus.Vector( min.x, max.y ) );
			
			ctx.globalAlpha = 0.3;
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( pt0.x, pt0.y );
			ctx.lineTo( pt1.x, pt1.y );
			ctx.lineTo( pt2.x, pt2.y );
			ctx.lineTo( pt3.x, pt3.y );
			ctx.closePath();
			
			ctx.stroke();
			ctx.globalAlpha = 1;
		};
		
		this.drawLabelToPoint = function( text, pt, offset, xalign, yalign ) {
			var p = this.worldToCanvas( pt );
			var o = new Regulus.Vector( offset );
			ctx.fillStyle = this.fill;
			ctx.font = this.font;
			ctx.textAlign = ( xalign || "left" ).toLowerCase();
			ctx.textBaseline = ( yalign || "top" ).toLowerCase();
			ctx.fillText( text, p.x + o.x, p.y + o.y );
		};
		
		this.drawLabelToVector = function( text, vec, to, offset, xalign, yalign, t ) {
			t = typeof t === "undefined" ? 0.5 : t;
			var pt = vec.mul( t ).add( to );
			this.drawLabelToPoint( text, pt, offset, xalign, yalign );
		};
		
		this.drawLabelToBox = function( text, box, offset, xalign, yalign, t ) {
			t = new Regulus.Vector( t );
			var size = box.size.mul( t );
			var pt = box.getMin().add( size );
			this.drawLabelToPoint( text, pt, offset, xalign, yalign );
		};
		
		this.drawLineSegment = function( pt1, pt2 ) {
			var p1 = this.worldToCanvas( pt1 );
			var p2 = this.worldToCanvas( pt2 );
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.stroke();
		};
		
		this.drawRay = function( pt1, pt2 ) {
			var topLeft = this.canvasToWorld( new Regulus.Vector( 0, 0 ) );
			var topRight = this.canvasToWorld( new Regulus.Vector( canvas.width, 0 ) );
			var bottomRight = this.canvasToWorld( new Regulus.Vector( canvas.width, canvas.height ) );
			var bottomLeft = this.canvasToWorld( new Regulus.Vector( 0, canvas.height ) );
			
			var iscs = [];
			
			var topIsc = Regulus.IntersectionPoint( topLeft, topRight, pt1, pt2 );
			if ( topIsc.u2 > 0 && topIsc.seg1 ) iscs.push( topIsc.pt );
			
			var rightIsc = Regulus.IntersectionPoint( topRight, bottomRight, pt1, pt2 );
			if ( rightIsc.u2 > 0 && rightIsc.between1 ) iscs.push( rightIsc.pt );
			
			var bottomIsc = Regulus.IntersectionPoint( bottomLeft, bottomRight, pt1, pt2 );
			if ( bottomIsc.u2 > 0 && bottomIsc.seg1 ) iscs.push( bottomIsc.pt );
			
			var leftIsc = Regulus.IntersectionPoint( topLeft, bottomLeft, pt1, pt2 );
			if ( leftIsc.u2 > 0 && leftIsc.between1 ) iscs.push( leftIsc.pt );
			
			
			if ( iscs.length < 1 ) {
				return;
			}
			
			if ( iscs.length === 1 ) {
				iscs.unshift( pt1 );
			}
			
			var p1 = this.worldToCanvas( iscs[ 0 ] );
			var p2 = this.worldToCanvas( iscs[ 1 ] );
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.stroke();
		};
		
		this.drawInfiniteLine = function( pt1, pt2 ) {
			var topLeft = this.canvasToWorld( new Regulus.Vector( 0, 0 ) );
			var topRight = this.canvasToWorld( new Regulus.Vector( canvas.width, 0 ) );
			var bottomRight = this.canvasToWorld( new Regulus.Vector( canvas.width, canvas.height ) );
			var bottomLeft = this.canvasToWorld( new Regulus.Vector( 0, canvas.height ) );
			
			var iscs = [];
			
			var topIsc = Regulus.IntersectionPoint( topLeft, topRight, pt1, pt2 );
			if ( topIsc.seg1 ) iscs.push( topIsc.pt );
			
			var rightIsc = Regulus.IntersectionPoint( topRight, bottomRight, pt1, pt2 );
			if ( rightIsc.between1 ) iscs.push( rightIsc.pt );
			
			var bottomIsc = Regulus.IntersectionPoint( bottomLeft, bottomRight, pt1, pt2 );
			if ( bottomIsc.seg1 ) iscs.push( bottomIsc.pt );
			
			var leftIsc = Regulus.IntersectionPoint( topLeft, bottomLeft, pt1, pt2 );
			if ( leftIsc.between1 ) iscs.push( leftIsc.pt );
			
			
			if ( iscs.length < 2 ) {
				return;
			}
			
			var p1 = this.worldToCanvas( iscs[ 0 ] );
			var p2 = this.worldToCanvas( iscs[ 1 ] );
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			ctx.beginPath();
			ctx.moveTo( p1.x, p1.y );
			ctx.lineTo( p2.x, p2.y );
			ctx.stroke();
		};
		
		this.drawDistanceIndicator = function( pt1, pt2, len, off ) {
			var p1 = this.worldToCanvas( pt1 );
			var p2 = this.worldToCanvas( pt2 );
			len = typeof len === "undefined" ? 10 : len;
			off = off || 0;
			var l = p2.sub( p1 ).perp().norm().mul( len / 2 );
			var ln = l.neg();
			var p = p2.sub( p1 ).perp().norm().mul( off );
			var p21 = p1.add( p );
			var p22 = p2.add( p );
			
			var p01 = p21.add( l );
			var p02 = p21.add( ln );
			var p11 = p22.add( l );
			var p12 = p22.add( ln );
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			
			ctx.beginPath();
			ctx.moveTo( p01.x, p01.y );
			ctx.lineTo( p02.x, p02.y );
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo( p11.x, p11.y );
			ctx.lineTo( p12.x, p12.y );
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo( p21.x, p21.y );
			ctx.lineTo( p22.x, p22.y );
			ctx.stroke();
		};
		
		this.drawSpring = function( pt1, pt2, length, cm, off, r, maxoff ) {
			cm = cm || 5;
			var len = Math.round( length * this.zoom / cm );
			off = ( off || 5 ) / this.zoom;
			maxoff = maxoff || 20;
			
			r = r || 7;
			
			var n = pt2.sub( pt1 ).norm().perp();
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			
			ctx.beginPath();
			
			var begin = this.worldToCanvas( pt1 );
			var end = this.worldToCanvas( pt2 );
			ctx.moveTo( begin.x, begin.y );
			
			ctx.lineJoin = "bevel";
			
			var dist = pt2.dist( pt1 );
			var offMultiplier = Math.pow( 2 / ( dist / length + 1 ), 2 );
			
			for ( var i = 1; i < len; i ++ ) {
				var p = i * cm;
				
				var im2 = i % 2;
				
				var pt = pt1.add( pt2.sub( pt1 ).mul( p / length ) );
				
				if ( i !== 1 && i !== len - 1 ) {
					if ( im2 === 0 ) {
						pt.Add( n.mul( Regulus.Math.clamp( off * offMultiplier, 0, maxoff ) ) );
					} else {
						pt.Sub( n.mul( Regulus.Math.clamp( off * offMultiplier, 0, maxoff ) ) );
					}
				}
				
				pt = this.worldToCanvas( pt );
				
				ctx.lineTo( pt.x, pt.y );
				
			}
			
			ctx.lineTo( end.x, end.y );
			ctx.stroke();
			ctx.lineJoin = "miter";
			
			this.drawPoint( pt1, r );
			this.drawPoint( pt2, r );
		};
		
		this.drawElastic = function( p1, p2, length, off, r ) {
			off = ( off || 7 ) / this.zoom;
			
			r = r || 7;
			
			var t = p2.sub( p1 ).norm();
			var n = t.perp();
			
			
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = this.borderWidth;
			
			
			var dist = p2.dist( p1 );
			var offMultiplier = dist > length ? Math.pow( 2 / ( dist / length + 1 ), 2 ) : 1;
			
			var pt1 = p1.sub( t.mul( off * offMultiplier ) );
			var pt2 = p2.add( t.mul( off * offMultiplier ) );
			
			var b0 = this.worldToCanvas( pt1 );
			var b1 = this.worldToCanvas( pt1.add( n.mul( off * offMultiplier ) ) );
			var b2 = this.worldToCanvas( pt1.sub( n.mul( off * offMultiplier ) ) );
			var b3 = this.worldToCanvas( p1.add( n.mul( off * offMultiplier ) ) );
			var e0 = this.worldToCanvas( pt2 );
			var e1 = this.worldToCanvas( pt2.add( n.mul( off * offMultiplier ) ) );
			var e2 = this.worldToCanvas( pt2.sub( n.mul( off * offMultiplier ) ) );
			var e3 = this.worldToCanvas( p2.sub( n.mul( off * offMultiplier ) ) );
			
			ctx.beginPath();
			ctx.moveTo( b3.x, b3.y );
			ctx.arcTo( e1.x, e1.y, e0.x, e0.y, off * offMultiplier );
			ctx.arcTo( e2.x, e2.y, e3.x, e3.y, off * offMultiplier );
			ctx.arcTo( b2.x, b2.y, b0.x, b0.y, off * offMultiplier );
			ctx.arcTo( b1.x, b1.y, b3.x, b3.y, off * offMultiplier );
			ctx.stroke();
			
			
			this.drawPoint( p1, r );
			this.drawPoint( p2, r );
		};
		
		this.drawSlider = function( pt1, pt2, pt, r, opac ) {
			r = r || 7;
			opac = opac || 0.2;
			
			ctx.globalAlpha = opac;
			this.drawLineSegment( pt1, pt2 );
			ctx.globalAlpha = 1;
			this.drawPoint( pt1, r );
			this.drawPoint( pt2, r );
			this.drawPoint( pt, r );
		};
		
		this.drawDistance = function( pt1, pt2, r ) {
			r = r || 7;
			
			this.drawLineSegment( pt1, pt2 );
			this.drawPoint( pt1, r );
			this.drawPoint( pt2, r );
		};
		
		this.drawAxle = function( pt, r ) {
			r = r || 9;
			
			this.drawCircPoint( pt, r );
		};
		
		this.drawGlue = function( pt, r ) {
			r = r || 9;
			
			this.drawXPoint( pt, r );
		};
		
		this.drawPointFF = function( time, str, point, maxr, r ) {
			var strength = Math.abs( str );
			time = time * 2 * strength;
			var dist = Math.abs( time ) % 100;
			if ( str < 0 ) dist = 100 - dist;
			r = r || 7;
			
			var alpha = ( 1 - dist / 100 ) * 0.1;
				
			var canvPt = this.worldToCanvas( point );
			
			
			this.drawPoint( point, r );
			
			if ( maxr ) {
				ctx.strokeStyle = this.fill;
				ctx.lineWidth = this.borderWidth;
				ctx.beginPath();
				ctx.arc( canvPt.x, canvPt.y, maxr * this.zoom, 0, Math.PI * 2 );
				ctx.closePath();
				ctx.stroke();
			}
			
			ctx.fillStyle = this.fill;
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc( canvPt.x, canvPt.y, Regulus.Math.clamp( dist, 0, maxr || 100 ) * this.zoom, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1;
			
		};
		
		this.drawVortexFF = function( time, str, point, maxr, r, arc ) {
			time = time / 10 * str;
			r = r || 7;
			arc = arc || 0.3;
			
			var canvPt = this.worldToCanvas( point );
			
			this.drawPoint( point, r );
			
			if ( maxr ) {
				ctx.strokeStyle = this.fill;
				ctx.lineWidth = this.borderWidth;
				ctx.beginPath();
				ctx.arc( canvPt.x, canvPt.y, maxr * this.zoom, 0, Math.PI * 2 );
				ctx.closePath();
				ctx.stroke();
			}
			
			ctx.fillStyle = this.fill;
			ctx.globalAlpha = 0.2;
			ctx.beginPath();
			ctx.arc( canvPt.x, canvPt.y, Regulus.Math.clamp( maxr * this.zoom, 0, 200 ), time, arc + time );
			ctx.lineTo( canvPt.x, canvPt.y );
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1;
			
		};
		
		this.drawLineFF = function( time, str, pt1, pt2, maxr ) {
			
			var strength = Math.abs( str );
			time = time * 2 * strength;
			var dist = Math.abs( time ) % 100;
			if ( str < 0 ) dist = 100 - dist;
			
			var alpha = ( 1 - dist / 100 ) * 0.1;
			
			
			this.drawLineSegment( pt1, pt2 );
			
			if ( maxr ) {
			
				var n = pt2.sub( pt1 ).norm().perp();

				var b1 = pt1.add( n.mul( maxr ) );
				var b2 = pt1.sub( n.mul( maxr ) );
				var e1 = pt2.add( n.mul( maxr ) );
				var e2 = pt2.sub( n.mul( maxr ) );
				
				this.drawLineSegment( b1, e1 );
				this.drawLineSegment( b2, e2 );
			}
			
			var bw = this.borderWidth;
			this.borderWidth = Regulus.Math.clamp( dist, 0, maxr || 100 ) * this.zoom * 2;
			ctx.globalAlpha = alpha;
			this.drawLineSegment( pt1, pt2 );
			ctx.globalAlpha = 1;
			this.borderWidth = bw;
			
		};
		
		this.drawTeleporterFF = function( time, shape, point, r ) {
			time /= 4;
			var dist = Math.abs( time ) % 20;
			var alpha = ( 1 - dist / 20 ) * 0.2;
			
			this.drawPoint( point, r || 7 );
			
			var canvPt = this.worldToCanvas( point );
			
			ctx.fillStyle = this.fill;
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc( canvPt.x, canvPt.y, dist * this.zoom, 0, Math.PI * 2 );
			ctx.closePath();
			ctx.fill();
			ctx.globalAlpha = 1;
			
			var fill = this.fill;
			var border = this.border;
			this.border = this.fill;
			this.fill = "transparent";
			var ai = this.drawAngleIndicators;
			this.drawAngleIndicators = false;
			if ( shape.type === "Polygon" ) {
				this.drawPolygon( shape );
			}
			if ( shape.type === "Circle" ) {
				this.drawCircle( shape );
			}
			if ( shape.type === "InfinitePlane" ) {
				this.drawPlane( shape );
			}
			if ( shape.type === "InfiniteBar" ) {
				this.drawBar( shape );
			}
			this.drawAngleIndicators = ai;
			this.fill = fill;
			this.border = border;
		};
		
		this.drawManipulatorFF = function( time, shape ) {
			
			var border = this.border;
			this.border = "transparent";
			ctx.globalAlpha = 0.2;
			if ( shape.type === "Polygon" ) {
				this.drawPolygon( shape );
			}
			if ( shape.type === "Circle" ) {
				this.drawCircle( shape );
			}
			if ( shape.type === "InfinitePlane" ) {
				this.drawPlane( shape );
			}
			if ( shape.type === "InfiniteBar" ) {
				this.drawBar( shape );
			}
			ctx.globalAlpha = 1;
			this.border = border;
		};
		
	};
	
}() );

( function() {
	
	Regulus.WorldRenderer = function( canvas ) {
		this.renderer = new Regulus.Renderer( canvas );
		
		this.angleIndicators = false;
		this.boxes = false;
		this.wireframes = false;
		this.fpsdata = false;
		this.centers = false;
		this.velocities = 0;
		this.collisions = false;
		this.constraints = true;
		this.forcefields = true;
		this.sensors = true;
		this.momentum = 0;
		this.SATAxes = false;
		
		this.render = function( world ) {
			
			var renderer = this.renderer;
			
			renderer.wipe();
			
			for ( var i = 0; i < world.forcefields.length; i ++ ) {
				var f = world.forcefields[ i ];
				
				renderer.fill = "#000";
				
				if ( f.type === "Point" ) {
					renderer.drawPointFF( world.time, f.strength, f.pt, f.radius );
				}
				if ( f.type === "Line" ) {
					renderer.drawLineFF( world.time, f.strength, f.pt1, f.pt2, f.radius );
				}
				if ( f.type === "Teleporter" ) {
					renderer.drawTeleporterFF( world.time, f.shape, f.pt );
				}
				if ( f.type === "Move" ) {
					renderer.drawManipulatorFF( world.time, f.shape );
				}
				if ( f.type === "Vortex" ) {
					renderer.drawVortexFF( world.time, f.strength, f.pt, f.radius );
				}
//				if ( c.type === "Spring" ) {
//					var data = c.getCorrectionData();
//					renderer.drawSpring( data.gp1, data.gp2, c.length );
//				}
//				if ( c.type === "Elastic" ) {
//					var data = c.getCorrectionData();
//					renderer.drawElastic( data.gp1, data.gp2, c.length );
//				}
			}
			
			renderer.drawAngleIndicators = this.angleIndicators;
			
			for ( var i = 0; i < world.bodies.length; i ++ ) {
				var body = world.bodies[ i ];
				var shape = body.getGlobalizedShape( true );
				
				renderer.fill = "rgba(255,255,255,0.2)";
				
				if ( this.boxes && shape.getBox ) {
					renderer.drawBox( shape.getBox() );
				}
				
				renderer.fill = this.wireframes ? "transparent" : body.color;
				renderer.border = this.wireframes ? body.color : "transparent";
				renderer.borderWidth = 2;
				
				if ( shape.type === "Polygon" ) {
					renderer.drawPolygon( shape );
				}
				if ( shape.type === "Circle" ) {
					renderer.drawCircle( shape );
				}
				if ( shape.type === "InfinitePlane" ) {
					renderer.drawPlane( shape );
				}
				if ( shape.type === "InfiniteBar" ) {
					renderer.drawBar( shape );
				}
			}
			
			for ( var i = 0; i < world.constraints.length; i ++ ) {
				var c = world.constraints[ i ];
				
				renderer.fill = "#000";
				
				if ( c.type === "Axle" ) {
					var data = c.getCorrectionData();
					renderer.drawAxle( data.gp1 );
				}
				if ( c.type === "Distance" ) {
					var data = c.getCorrectionData();
					renderer.drawDistance( data.gp1, data.gp2 );
				}
				if ( c.type === "Slider" ) {
					var data = c.getCorrectionData();
					renderer.drawSlider( c.pt2, c.pt3, data.gp );
				}
				if ( c.type === "Spring" ) {
					var data = c.getCorrectionData();
					renderer.drawSpring( data.gp1, data.gp2, c.length );
				}
				if ( c.type === "Elastic" ) {
					var data = c.getCorrectionData();
					renderer.drawElastic( data.gp1, data.gp2, c.length );
				}
			}
			
		};
	};
	
}() );

( function() {
	
	Regulus.CircleCircle = function( circ1, circ2 ) {
		var pos1 = circ1.position;
		var pos2 = circ2.position;
		
		if ( ! circ1.getBox().overlap( circ2.getBox() ) ) {
			return false;
		}
		
		var relative = pos2.sub( pos1 );
		
		var dist = relative.mag();
		
		var radius = circ1.radius + circ2.radius;
		if ( dist <= radius ) {
			var depth, normal, p1, p2;
			if ( dist === 0 ) {
				
				depth = radius;
				
				normal = new Regulus.Vector( 1, 0 );
				
				p1 = normal.neg().Mul( circ1.radius - depth );
				p2 = normal.mul( circ2.radius - depth );
				
				return {
					normal: normal,
					depth: depth,
					p1: [ p2 ],
					p2: [ p1 ]
				};
				
			} else {
				
				depth = radius - dist;
				
				normal = relative.norm().Neg();
				
				p1 = normal.neg().Mul( circ1.radius - depth );
				p2 = normal.mul( circ2.radius - depth );
				
				return {
					normal: normal,
					depth: depth,
					p1: [ p2 ],
					p2: [ p1 ]
				};
				
			}
		}
		
		return false;
		
	};
	
}() );

( function() {
	
	function distance( verts, point ) {
		var mindist = Infinity;
		var info = null;
		var pt = null;
		verts.forEach( function( next ) {
			var dist = Regulus.DistToLineInfo( point, this, next );
			if ( dist.distance < mindist ) {
				mindist = dist.distance;
				info = dist.normal;
				pt = dist.closest;
			}
		} );
		return {
			norm: info,
			dist: mindist,
			pt: pt
		};
	}
	
	function inside( point, poly ) {
		var x = point.x, y = point.y;
		
		var vs = poly.vertices;

		var inside = false;
		for ( var i = 0, j = vs.length - 1; i < vs.length; j = i ++ ) {
			var xi = vs[ i ].x, yi = vs[ i ].y;
			var xj = vs[ j ].x, yj = vs[ j ].y;

			var intersect = yi > y !== yj > y && x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi;
			if ( intersect ) inside = ! inside;
		}

		return inside;
	}
	
	Regulus.CirclePolygon = function( circ, poly ) {
		
		if ( ! circ.getBox().overlap( poly.getBox() ) ) {
			return false;
		}
		
		var pos = circ.position;
		var verts = poly;
		
		var dist = distance( verts, pos );
		
		if ( inside( pos, poly ) ) {
			// Circle is inside anyway
			var depth = dist.dist + circ.radius;
			
			var normal = dist.norm.norm();
			
			var pt1 = normal.neg().Mul( circ.radius );
			var pt2 = dist.pt.sub( poly.position );
			
			return {
				normal: normal,
				depth: depth,
				p1: [ pt2 ],
				p2: [ pt1 ]
			};
		} else {
			// Circle can be inside
			if ( dist.dist <= circ.radius ) {
				// Circle is inside
				var d = circ.radius - dist.dist;
				
				// Normal is negative, but don't flip it until needed
				var n = dist.norm.norm();
				
				var p1 = n.mul( circ.radius );
				var p2 = dist.pt.sub( poly.position );
				
				// Flip normal
				n.Neg();
				
				return {
					normal: n,
					depth: d,
					p1: [ p2 ],
					p2: [ p1 ]
				};
			} else {
				// Circle is not inside
				return false;
			}
		}
		
	};
	
}() );

( function() {
	
	Regulus.CirclePlane = function( circ, plane ) {
		var cpos = circ.position;
		var ppos = plane.position;
		
		var pnorm = Regulus.Vector.fromDirection( plane.rotation );
		
		var relative = cpos.sub( ppos );
		
		var raw = relative.rawProject( pnorm );
		
		var ptang = pnorm.perp();
		
		// Circle doesn't collide
		if ( raw > circ.radius ) {
			return false;
		}
		
		var depth = circ.radius - raw;
		var normal = pnorm;
		var p2 = relative.project( ptang );
		var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );
		
		return {
			normal: normal,
			depth: depth,
			p1: [ p2 ],
			p2: [ p1 ]
		};
		
	};
	
} () );

( function() {
	
	Regulus.CircleBar = function( circ, bar ) {
		var cpos = circ.position;
		var ppos = bar.position;
		
		var bnorm = Regulus.Vector.fromDirection( bar.rotation );
		
		var relative = cpos.sub( ppos );
		
		var raw = relative.rawProject( bnorm );
		
		var ptang = bnorm.perp();
		
		// Circle doesn't collide
		if ( Math.abs( raw ) > circ.radius + bar.width / 2 ) {
			return false;
		}
		
		if ( raw >= 0 ) {
		
			var depth = circ.radius - raw + bar.width / 2;
			var normal = bnorm;
			var p2 = relative.project( ptang ).Add( bnorm.mul( bar.width / 2 ) );
			var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );

			return {
				normal: normal,
				depth: depth,
				p1: [ p2 ],
				p2: [ p1 ]
			};
		} else {
		
			var depth = circ.radius + raw + bar.width / 2;
			var normal = bnorm.neg();
			var p2 = relative.project( ptang ).Add( bnorm.mul( - bar.width / 2 ) );
			var p1 = p2.add( ppos ).Add( normal.mul( - depth ) ).Sub( cpos );

			return {
				normal: normal,
				depth: depth,
				p1: [ p2 ],
				p2: [ p1 ]
			};
			
		}
		
	};
	
} () );

( function() {
	
	Regulus.PolygonBar = function( poly, bar ) {
		
		var bpos = bar.position;
		var verts = poly;
		
		var axis = Regulus.Vector.fromDirection( bar.rotation );
		
		var min = Infinity, max = - Infinity;
		verts.forEach( function() {
			var rel = this.sub( bpos );
			var raw = rel.rawProject( axis );
			if ( raw < min ) min = raw;
			if ( raw > max ) max = raw;
		} );
		
		var bmin = - bar.width / 2;
		var bmax = bar.width / 2;
		
		// Check if separating axis does exist
		if ( min > bmax || max < bmin ) return false;
		
		var normal = axis;
		var flip = false;
		if ( Math.abs( min - bmax ) > Math.abs( max - bmin ) ) {
			normal.Neg();
			flip = true;
		}
		var depth = Math.min( Math.abs( min - bmax ), Math.abs( bmin - max ) );
		
		
		var edge = poly.getBestEdge( normal.neg() );
		var pt1 = edge.vtx1;
		var pt2 = edge.vtx2;
		
		if ( ! bar.pointAtPosSide( pt1 ) && ! flip ) {
			pt1 = null;
		} else if ( ! bar.pointAtNegSide( pt1 ) && flip ) {
			pt1 = null;
		}
		
		if ( ! bar.pointAtPosSide( pt2 ) && ! flip ) {
			pt2 = null;
		} else if ( ! bar.pointAtNegSide( pt2 ) && flip ) {
			pt2 = null;
		}
		
		if ( ! pt1 ) {
			pt1 = pt2;
			pt2 = null;
		}
		
		var l1 = normal.mul( bar.width / 2 ).Add( bpos );
		var tangent = normal.perp();
		
		var proj1 = pt1.sub( l1 ).Project( tangent ).Add( l1 );
		var proj2 = pt2 ? pt2.sub( l1 ).Project( tangent ).Add( l1 ) : null;
		
		pt1.Sub( poly.position );
		if ( pt2 ) pt2.Sub( poly.position );
		
		proj1.Sub( bar.position );
		if ( pt2 ) proj2.Sub( bar.position );
		
		if ( pt2 ) {
			return {
				normal: normal,
				depth: depth,
				p1: [ proj1, proj2 ],
				p2: [ pt1, pt2 ]
			};
		} else {
			return {
				normal: normal,
				depth: depth,
				p1: [ proj1 ],
				p2: [ pt1 ]
			};
		}
	};
	
} () );

( function() {
	
	Regulus.PolygonPlane = function( poly, plane ) {
		
		// Polygons are cached and made compatible before any collision detection, so no check for clockwise or globalization
		var ppos = plane.position;
		var verts = poly;
		
		// One benefit with planes is that we already have the normal and tangent
		var normal = Regulus.Vector.fromDirection( plane.rotation );
		var tangent = normal.perp();
		var depth = - Infinity;
		var lastdepth = - Infinity;
		var p1 = null;
		var p2 = null;
		var pt1 = null;
		var pt2 = null;
		var collide = false;
		verts.forEach( function() {
			var rel = this.sub( ppos );
			var raw = rel.rawProject( normal );
			if ( raw <= 0 && - raw > depth ) {
				depth = - raw;
				p1 = this.sub( poly.position );
				pt1 = rel.project( tangent );
				collide = true;
			}
		} );
		verts.forEach( function() {
			var rel = this.sub( ppos );
			var raw = rel.rawProject( normal );
			if ( raw <= 0 && - raw > lastdepth && - raw < depth ) {
				lastdepth = - raw;
				p2 = this.sub( poly.position );
				pt2 = rel.project( tangent );
				collide = true;
			}
		} );
		
		if ( ! collide ) {
			return false;
		}
		
		if ( ! p2 ) {
			return {
				normal: normal,
				depth: depth,
				p1: [ pt1 ],
				p2: [ p1 ]
			};
		} else {
			return {
				normal: normal,
				depth: depth,
				p1: [ pt1, pt2 ],
				p2: [ p1, p2 ]
			};
		}
		
	};
	
} () );

( function() {
	
	Regulus.PolygonPolygon = function( poly1, poly2 ) {
		if ( ! poly1.getBox().overlap( poly2.getBox() ) ) {
			return false;
		}
		
		// Polygons are cached and made compatible before any collision detection, so no check for clockwise or globalization
		var verts1 = poly1;
		var verts2 = poly2;
		var axes1 = poly1.getSATAxes();
		var axes2 = poly2.getSATAxes();
		
		var collide = true;
		var normal = null;
		var depth = Infinity;
		
		// Iterate over the SAT axes of polygon 1
		var index;
		for ( index = 0; index < axes1.length; index ++ ) {
			var axis = axes1[ index ];
			
			// Project polygon 1 on axis
			var min1 = Infinity, max1 = - Infinity;
			verts1.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max1 ) max1 = proj;
				if ( proj < min1 ) min1 = proj;
			} );
			
			
			// Project polygon 2 on axis
			var min2 = Infinity, max2 = - Infinity;
			verts2.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max2 ) max2 = proj;
				if ( proj < min2 ) min2 = proj;
			} );
			
			// Check for collisisons
			if ( min1 <= max2 && max1 >= min2 ) {
				var n = axis.clone();
				var d = Math.min( Math.abs( min1 - max2 ), Math.abs( min2 - max1 ) );
				if ( Math.abs( min1 - max2 ) < Math.abs( max1 - min2 ) ) n.Neg();
				if ( d < depth || ! collide ) {
					depth = d;
					normal = n;
					collide = true;
				}
			} else {
				// There is no 1D collision between projections, perpendicular axis can separate polygons
				collide = false;
				break;
			}
		}
		
		if ( ! collide ) return false;
		
		// Iterate over the SAT axes of polygon 2
		for ( index = 0; index < axes2.length; index ++ ) {
			var axis = axes2[ index ];
			
			// Project polygon 1 on axis
			var min1 = Infinity, max1 = - Infinity;
			verts1.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max1 ) max1 = proj;
				if ( proj < min1 ) min1 = proj;
			} );
			
			
			// Project polygon 2 on axis
			var min2 = Infinity, max2 = - Infinity;
			verts2.forEach( function() {
				var proj = this.rawProject( axis );
				if ( proj > max2 ) max2 = proj;
				if ( proj < min2 ) min2 = proj;
			} );
			
			// Check for collisisons
			if ( min1 <= max2 && max1 >= min2 ) {
				var n = axis.clone();
				var d = Math.min( Math.abs( min1 - max2 ), Math.abs( min2 - max1 ) );
				if ( Math.abs( min1 - max2 ) < Math.abs( max1 - min2 ) ) n.Neg();
				if ( d < depth || ! collide ) {
					depth = d;
					normal = n;
					collide = true;
				}
			} else {
				// There is no 1D collision between projections, perpendicular axis can separate polygons
				collide = false;
				break;
			}
		}
		
		if ( ! collide ) return false;
		
		
		// Return false if there is at least one axis that separates the 2 polygons
		if ( ! collide ) return false;

		var edgeData1 = poly1.getBestEdge( normal );
		var edgeData2 = poly2.getBestEdge( normal.neg() );
		var edge1 = edgeData1.edge;
		var edge2 = edgeData2.edge;

		var ref, inc, flip = false;
		if ( Math.abs( edge1.dot( normal ) ) <= Math.abs( edge2.dot( normal ) ) ) {
			ref = edgeData1;
			inc = edgeData2;
		} else {
			ref = edgeData2;
			inc = edgeData1;
			flip = true;
		}

		var pt1 = inc.vtx1, pt2 = inc.vtx2;
		var amount = 2;

		// Clipping plane 1
		var isc1 = Regulus.IntersectionPoint( ref.vtx1, ref.vtx1.add( normal ), pt1, pt2 );
		if ( isc1.u2 >= 0 && isc1.u2 <= 1 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is normalized vector from vtx1 to vtx2
			var n1 = ref.vtx2.sub( ref.vtx1 ).Norm();

			// Find relatives from ref.vtx1 to collision points pt1 and pt2
			var r11 = pt1.sub( ref.vtx1 );
			var r12 = pt2.sub( ref.vtx1 );

			// Project both relatives on n1, which is normal of clipping plane
			var proj1 = r11.rawProject( n1 );
			var proj2 = r12.rawProject( n1 );

			// Either one or none of proj1 and proj2 should be less than or equal to zero
			// No both are less than zero, because the clipping plane is then separating the edges
			if ( proj1 <= 0 ) {
				// pt1 gets into the clipping plane: Now make pt1 the intersection point
				pt1 = isc1.pt;
			} else if ( proj2 <= 0 ) {
				// pt2 gets into the clipping plane: Now make pt2 the intersection point
				pt2 = isc1.pt;
			}
		}
		

		// Clipping plane 2
		var isc2 = Regulus.IntersectionPoint( ref.vtx2, ref.vtx2.add( normal ), pt1, pt2 );
		if ( isc2.seg2 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is normalized vector from vtx2 to vtx1, just opposite of clipping plane 1
			var n2 = ref.vtx1.sub( ref.vtx2 ).Norm();

			// Find relatives from ref.vtx2 to collision points pt1 and pt2
			var r21 = pt1.sub( ref.vtx2 );
			var r22 = pt2.sub( ref.vtx2 );

			// Project both relatives on n2, which is normal of clipping plane
			var proj3 = r21.rawProject( n2 );
			var proj4 = r22.rawProject( n2 );

			// Same as clipping plane 1
			if ( proj3 <= 0 ) {
				// pt1 gets into the clipping plane: Now make pt1 the intersection point
				pt1 = isc2.pt;
			} else if ( proj4 <= 0 ) {
				// pt2 gets into the clipping plane: Now make pt2 the intersection point
				pt2 = isc2.pt;
			}
		}

		// Clipping plane 3
		var isc3 = Regulus.IntersectionPoint( ref.vtx1, ref.vtx2, pt1, pt2 );
		if ( isc3.seg2 ) {
			// Intersection with incident edge, we now have to find the normal of the clipping plane
			// Normal is collision normal, sometimes flipped if the reference and incident edges were not switched
			var n3;
			if ( flip ) n3 = normal;
			else n3 = normal.neg();

			// Find relatives from ref.vtx1 to collision points pt1 and pt2
			var r31 = pt1.sub( ref.vtx1 );
			var r32 = pt2.sub( ref.vtx1 );

			// Project both relatives on n2, which is normal of clipping plane
			var proj5 = r31.rawProject( n3 );
			var proj6 = r32.rawProject( n3 );

			// Same as clipping plane 1, but now remove vertices, instead of moving to the intersection
			// If both projections are in the plane now, the plane separates the polygons ( with exception to concave ones )
			if ( proj5 < 0 ) {
				// pt1 gets into the clipping plane: Make pt1 pt2, and remove pt2
				pt1 = pt2;
				pt2 = null;
				amount = 1;
			} else if ( proj6 < 0 ) {
				// pt2 gets into the clipping plane: Remove pt2
				pt2 = null;
				amount = 1;
			}

		}
		
		var verts = flip ? verts2 : verts1;
		var nrm = flip ? normal.neg() : normal;
		
		
		// Sat thinks the polygon is inside when it is really close, but actually not inside.
		// Collision points are unavailable then so we can prevent that from happening
		if ( ! pt1 ) return false;
		
		// Project the vertices on the other polygon, in the direction of the normal
		var iscs1 = null, iscs2 = null;
		verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( pt1, pt1.add( nrm ), this, next );
			if ( isc.u1 >= 0 && isc.seg2 ) {
				iscs1 = isc.pt;
			}
		} );
		if ( amount > 1 ) verts.forEach( function( next ) {
			var isc = Regulus.IntersectionPoint( pt2, pt2.add( nrm ), this, next );
			if ( isc.u1 >= 0 && isc.seg2 ) {
				iscs2 = isc.pt;
			}
		} );
		
		if ( amount > 1 ) {
			return {
				normal: normal.neg(),
				depth: depth,
				p2: flip ? [ pt1.sub( poly1.position ), pt2.sub( poly1.position ) ] : [ iscs1.sub( poly1.position ), iscs2.sub( poly1.position ) ],
				p1: flip ? [ iscs1.sub( poly2.position ), iscs2.sub( poly2.position ) ] : [ pt1.sub( poly2.position ), pt2.sub( poly2.position ) ]
			};
		} else {
			return {
				normal: normal.neg(),
				depth: depth,
				p2: flip ? [ pt1.sub( poly1.position ) ] : [ iscs1.sub( poly1.position ) ],
				p1: flip ? [ iscs1.sub( poly2.position ) ] : [ pt1.sub( poly2.position ) ]
			};
		}
	};
	
}() );

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

( function() {

	/**
	 * Connects two bodies together at a single point.
	 * @constructor SpringConstraint
	 * @param { Body }   body1 - The first body that is connected to the spring.
	 * @param { Vector } pt1   - The point where the first body is connected, relative to it's position.
	 * @param { Body }   body2 - The second body that is connected to the spring.
	 * @param { Vector } pt2   - The point where the second body is connected, relative to it's position.
	 * @param { Object } p     - Properties of the constraint
	 */
	Regulus.AxleConstraint = function( body1, pt1, body2, pt2, p ) {
		
		p = p || {};
		this.body1 = body1;
		this.body2 = body2;
		this.pt1 = pt1;
		this.pt2 = pt2;
		
		this.disableCollision = typeof p.disableCollision === "boolean" ? p.disableCollision : true;
		this.enabled = typeof p.enabled === "boolean" ? p.enabled : true;
		
	};
	
	Regulus.AxleConstraint.prototype.getCorrectionData = function() {
		var rp1 = this.pt1.rotate( this.body1.rotation );
		var rp2 = this.pt2.rotate( this.body2.rotation );
		var gp1 = rp1.add( this.body1.position );
		var gp2 = rp2.add( this.body2.position );
		var rel = gp2.sub( gp1 );
		var depth = rel.mag();
		var normal = rel.neg().norm();
		return {
			rp1: rp1,
			rp2: rp2,
			gp1: gp1,
			gp2: gp2,
			rel: rel,
			depth: depth,
			normal: normal
		};
	};
	
	
	Regulus.AxleConstraint.prototype.solve = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
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

	Regulus.AxleConstraint.prototype.correction = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
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
	
	Regulus.AxleConstraint.prototype.type = "Axle";
	
}() );

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

( function() {
	
	/**
	 * Springs are like distance constraints, except that they have spring properties.
	 * @constructor SpringConstraint
	 * @param { Body }   body1 - The first body that is connected to the spring
	 * @param { Vector } pt1   - The point where the first body is connected, relative to it's position.
	 * @param { Body }   body2 - The second body that is connected to the spring
	 * @param { Vector } pt2   - The point where the second body is connected, relative to it's position.
	 * @param { Object } p     - Properties of the constraint
	 */
	Regulus.SpringConstraint = function( body1, pt1, body2, pt2, p ) {
		
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
	
	Regulus.SpringConstraint.prototype.getCorrectionData = function() {
		var rp1 = this.pt1.rotate( this.body1.rotation );
		var rp2 = this.pt2.rotate( this.body2.rotation );
		var gp1 = rp1.add( this.body1.position );
		var gp2 = rp2.add( this.body2.position );
		var rel = gp2.sub( gp1 );
		var mag = rel.mag();
		var depth = 0;
		var normal = rel.neg().norm();
		if ( mag < this.length ) {
			depth = this.length - mag;
			normal.Neg();
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
			normal: normal
		};
	};
	
	
	Regulus.SpringConstraint.prototype.solve = function() {
		if ( ! this.enabled ) return;
		var cd = this.getCorrectionData();
		
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

	Regulus.SpringConstraint.prototype.correction = function() {
		// TODO: Correction
	};
	
	Regulus.SpringConstraint.prototype.type = "Spring";
	
}() );

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

( function() {
	
	Regulus.MoveFF = function( shape, p ) {
		p = p || {};
		this.shape = shape;
		
		this.move = new Regulus.Vector( p.move );
		this.wind = new Regulus.Vector( p.wind );
		this.disableGravity = typeof p.disableGravity === "boolean" ? p.disableGravity : false;
		this.disableWind = typeof p.disableWind === "boolean" ? p.disableWind : false;
		
		// -1 to use world value, 0 to turn air off here
		this.air = typeof p.air === "number" ? p.air : - 1;
	};
	
	Regulus.MoveFF.prototype.applyOnBody = function( body, dt, data ) {
		if ( this.shape.pointInside( body.position ) ) {
			if ( body.static ) return;
			
			if ( this.disableWind ) data.wind.set( 0 );
			data.wind.Sub( this.wind );
			
			if ( this.air > - 1 ) {
				data.air = this.air;
			}
			
			if ( this.disableGravity ) data.gravity.set( 0 );
			
			body.velocity.Add( this.move.mul( dt ) );
		}
	};
	
	Regulus.MoveFF.prototype.type = "Move";
	
}() );

( function() {
	
	Regulus.PointFF = function( pt, p ) {
		p = p || {};
		this.pt = pt;
		
		this.strength = typeof p.strength === "number" ? p.strength : 1;
		this.radius = typeof p.radius === "number" ? p.radius : 100;
	};
	
	Regulus.PointFF.prototype.applyOnBody = function( body, dt ) {
		
		// Calculate relative
		var rel = this.pt.sub( body.position );
		var mag = rel.mag();
		var n = rel.norm();
		
		if ( mag <= this.radius ) {
			// Calculate the force
			var F = n.neg().mul( this.strength );
			if ( ! body.static ) body.velocity.Add( F.mul( dt ) );
		}
	};
	
	Regulus.PointFF.prototype.type = "Point";
	
}() );

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

( function() {
	
	Regulus.VortexFF = function( pt, p ) {
		p = p || {};
		this.pt = pt;
		
		this.strength = typeof p.strength === "number" ? p.strength : 1;
		this.radius = typeof p.radius === "number" ? p.radius : 100;
	};
	
	Regulus.VortexFF.prototype.applyOnBody = function( body, dt ) {
		
		// Calculate relative
		var rel = this.pt.sub( body.position );
		var mag = rel.mag();
		var n = rel.norm().perp();
		
		if ( mag <= this.radius ) {
			// Calculate the force
			var F = n.mul( this.strength );
			if ( ! body.static ) body.velocity.Add( F.mul( dt ) );
		}
	};
	
	Regulus.VortexFF.prototype.type = "Vortex";
	
}() );
