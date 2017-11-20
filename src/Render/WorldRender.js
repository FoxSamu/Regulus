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
