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
