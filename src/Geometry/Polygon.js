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
