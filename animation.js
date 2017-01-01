// *******************************************************
// CS 174a Graphics Example Code
// animation.js - The main file and program start point.  The class definition here describes how to display an Animation and how it will react to key and mouse input.  Right now it has
// very little in it - you will fill it in with all your shape drawing calls and any extra key / mouse controls.

// Now go down to display() to see where the sample shapes are drawn, and to see where to fill in your own code.

"use strict"
var canvas, canvas_size, gl = null, g_addrs,
	movement = vec2(),	thrust = vec3(), 	looking = false, prev_time = 0, animate = false, animation_time = 0;
		var gouraud = false, color_normals = false, solid = false;
function CURRENT_BASIS_IS_WORTH_SHOWING(self, model_transform) { self.m_axis.draw( self.basis_id++, self.graphicsState, model_transform, new Material( vec4( .8,.3,.8,1 ), .5, 1, 1, 40, "" ) ); }

animate = !animate;

var a = 0;
var createdA = false;

var b = 0;
var createdB = false;

// VARIABLES FOR THE GAME
var md_stack = [];
var start;
var end;

var boing = new Audio("boing.wav");
var whistle = new Audio("whistle.wav");


var themeMusic = new Audio("theme.mp3");
var themeMusicPlaying = false;
var roadMusic = new Audio("road.mp3");
var roadMusicPlaying = false;
var batbattle = new Audio("batbattle.mp3");
var batbattleMusicPlaying = false;
var dragonbattle = new Audio("dragonbattle.mp3");
var dragonbattleMusicPlaying = false;
var defeat = new Audio("defeat.mp3");

var walkingSound = new Audio("footstep.mp3");
var hitNothingSound = new Audio("hitNothing.wav");
var fireBallHitSound = new Audio("fireballHit.mp3");
var hitBatSound = new Audio("hitBat.mp3");
var hitDragonSound = new Audio("hitDragon.mp3");

var batDieSound = new Audio("batdie.wav");
var batEntranceSound = new Audio("batEntrance.mp3");

var dragonAttackSound = new Audio("DragonAttack.mp3");
var dragonDieSound = new Audio("dragondie.wav");
var dragonEntranceSound = new Audio("DragonEntrance.wav");
var dragonEntranceSoundPlayed = false;
var dragonHitSound = new Audio("Dragonhit.mp3");
var dragonHitGroundSound = new Audio("dragonHitGround.mp3");
var fireBallSound = new Audio("fireball.wav");




// self.music = new Audio("theme.mp3");
// self.music.loop = true;
// self.music.addEventListener("theme", function(){self.music.currentTime=3;});


var recorded1 = false; // for phase1 lookAt
var counterAttack = 0;
var recordedAttack = false;
var counter12 = 0;
var recorded12 = false;
var counterJump = 0;
var recordedJump = false;
var counterBat = 0;
var recordedBat = false;
var counter5 = 0;
var recorded5 = false;

var counterTB = 0; // transitionBat
var recordedTB = false;

var counterTD = 0; // transitionDragon
var recordedTD = false;


var moveUp= false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;

var faceUp = false;
var faceRight = true;
var faceDown = false;
var faceLeft = false;
var currentDir = 0;

var walking = false;
var walkingAngle = 0;

var attack = false;
var jump = false;

var char_x = 0;
var char_y = 0;
var char_z = 0;

var time;

var charIsAlive = true;
var charHP = 15;

var batIsAlive = true;
var batAttack = false;
var batHP = 7;

var battleDragon = false;
var dragonIsAlive = true;
var dragonAttack = false;
var dragonHP = 20;


var gamePrep = true;

var phase1 = false; // from title to roadview

var transition12 = false;

var phase2 = false; // from roadview to 3/4 view

var transitionBat = false;
var transitionBatDone = false;
var batBattle = false;
var transitionDragon = false;
var transitionDragonDone = false;
var dragonBattle = false;
var victory = 1; // 1-game in process, 0-defeat, 2-victory
//
//




// *******************************************************
// IMPORTANT -- In the line below, add the filenames of any new images you want to include for textures!

var texture_filenames_to_load = [ "stars.png", "text.png", "earth.gif", "green1.png", "body.png", "character1.png",
"arms.png", "trunk1.png", "dskin.png", "dwing.png","dwingin.png", "dbelly.png", "dneck.png", "deye.png",
"dnostril.png", "title.png", "headf.png", "headl.png", "headr.png", "headb.png" , "headt.png", "bodyb.png",
"bodyf.png", "bodyl.png", "bodyr.png", "arms.png", "armt.png", "legs.png", "legb.png", "armb.png", "dfireball.png", "sky.png", "defeat.png", "victory.png" ];

// *******************************************************
// When the web page's window loads it creates an "Animation" object.  It registers itself as a displayable object to our other class "GL_Context" -- which OpenGL is told to call upon every time a
// draw / keyboard / mouse event happens.

window.onload = function init() {	var anim = new Animation();	}
function Animation()
{
	( function init (self)
	{
		self.context = new GL_Context( "gl-canvas" );
		self.context.register_display_object( self );

		gl.clearColor( 1, 1, 1, 1 );			// Background color

		for( var i = 0; i < texture_filenames_to_load.length; i++ )
			initTexture( texture_filenames_to_load[i], true );

		self.m_cube = new cube();
		self.m_obj = new shape_from_file( "teapot.obj" )
		self.m_axis = new axis();
		self.m_sphere = new sphere( mat4(), 4 );
		self.m_fan = new triangle_fan_full( 10, mat4() );
		self.m_strip = new rectangular_strip( 1, mat4() );
		self.m_cylinder = new cylindrical_strip( 10, mat4() );

		self.m_triangle = new triangle();
		self.m_tetrahedron = new tetrahedron();
		self.m_tetrahedronA = new tetrahedronA();
		self.m_flake = new flake();
		self.m_flakeAce = new flakeAce();

		self.m_rectangle = new rectangular_strip(1, mat4());

		// 1st parameter is camera matrix.  2nd parameter is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
		// self.graphicsState = new GraphicsState( translation(0, 0,-40), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );
		self.graphicsState = new GraphicsState( translation(0, 0,-40), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );

		gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);		gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);		gl.uniform1i( g_addrs.SOLID_loc, solid);

		self.context.render();
	} ) ( this );

	canvas.addEventListener('mousemove', function(e)	{		e = e || window.event;		movement = vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2, 0);	});
}

// *******************************************************
// init_keys():  Define any extra keyboard shortcuts here
Animation.prototype.init_keys = function()
{
	// shortcut.add( "Space", function() { thrust[1] = -1; } );			shortcut.add( "Space", function() { thrust[1] =  0; }, {'type':'keyup'} );
	// shortcut.add( "z",     function() { thrust[1] =  1; } );			shortcut.add( "z",     function() { thrust[1] =  0; }, {'type':'keyup'} );
	// shortcut.add( "w",     function() { thrust[2] =  1; } );			shortcut.add( "w",     function() { thrust[2] =  0; }, {'type':'keyup'} );
	// shortcut.add( "a",     function() { thrust[0] =  1; } );			shortcut.add( "a",     function() { thrust[0] =  0; }, {'type':'keyup'} );
	// shortcut.add( "s",     function() { thrust[2] = -1; } );			shortcut.add( "s",     function() { thrust[2] =  0; }, {'type':'keyup'} );
	// shortcut.add( "d",     function() { thrust[0] = -1; } );			shortcut.add( "d",     function() { thrust[0] =  0; }, {'type':'keyup'} );
	// shortcut.add( "f",     function() { looking = !looking; } );
	// shortcut.add( ",",     ( function(self) { return function() { self.graphicsState.camera_transform = mult( rotation( 3, 0, 0,  1 ), self.graphicsState.camera_transform ); }; } ) (this) ) ;
	// shortcut.add( ".",     ( function(self) { return function() { self.graphicsState.camera_transform = mult( rotation( 3, 0, 0, -1 ), self.graphicsState.camera_transform ); }; } ) (this) ) ;
	//
	// shortcut.add( "r",     ( function(self) { return function() { self.graphicsState.camera_transform = mat4(); }; } ) (this) );
	// shortcut.add( "ALT+s", function() { solid = !solid;					gl.uniform1i( g_addrs.SOLID_loc, solid);
	// 																	gl.uniform4fv( g_addrs.SOLID_COLOR_loc, vec4(Math.random(), Math.random(), Math.random(), 1) );	 } );
	// shortcut.add( "ALT+g", function() { gouraud = !gouraud;				gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);	} );
	// shortcut.add( "ALT+n", function() { color_normals = !color_normals;	gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);	} );
	// // shortcut.add( "ALT+a", function() { animate = !animate; } );
	//
	// shortcut.add( "p",     ( function(self) { return function() { self.m_axis.basis_selection++; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );
	// shortcut.add( "m",     ( function(self) { return function() { self.m_axis.basis_selection--; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );
	//
	// shortcut.add( "y",     ( function(self) { return function() {
	// 	self.graphicsState.camera_transform = lookAt( vec3(0,50,0), vec3(0,0, 0), vec3(1,0,0) );
	// }; } ) (this) ) ; // button to look as an eagle
	//
	// shortcut.add( "u",     ( function(self) { return function() {
	// 	self.graphicsState.camera_transform = lookAt( vec3(-5,20,20), vec3(0,0, 0), vec3(0,1,0) );
	// }; } ) (this) ) ; // button to 3/4 look

	/* BUTTON TEMPLATE
	shortcut.add( "y",     ( function(self) { return function() {
		// button inputs
	}; } ) (this) ) ;
	*/

		shortcut.add( "w",     function() {
			if(phase2){
			moveUp = true; walking = true;} } );
		shortcut.add( "w",     function() {
			moveUp = false; walking = false; }, {'type':'keyup'} );
		shortcut.add( "s",     function() {
			if(phase2){
			moveDown = true; walking = true;}} );
		shortcut.add( "s",     function() {
			moveDown = false; walking = false; }, {'type':'keyup'} );
		shortcut.add( "d",     function() {
			if(phase2){
			moveRight = true; walking = true;}} );
		shortcut.add( "d",     function() {
			 moveRight = false; walking = false; }, {'type':'keyup'} );
		shortcut.add( "a",     function() {
			if(phase2){
			moveLeft = true; walking = true;}} );
		shortcut.add( "a",     function() {
			moveLeft = false; walking = false; }, {'type':'keyup'} );
		shortcut.add( ",",     function() {
			if(phase2){
			jump = true; }} );
		shortcut.add( ",",     function() {
			jump = false }, {'type':'keyup'} );
		shortcut.add( ".",     function() {
			if(phase2){
			attack = true; }} );
		shortcut.add( ".",     function() {
			attack = false; }, {'type':'keyup'} );




		shortcut.add( "enter",     function() { if (gamePrep){ victory = 1; gamePrep = false; phase1 = true;} } );

		shortcut.add( "shift",     function() { if (victory == 0 || victory == 2){ recorded1 = false; counterAttack = 0;
		recordedAttack = false; counter12 = 0; recorded12 = false; counterJump = 0; recordedJump = false; counterBat = 0;
		 recordedBat = false; counter5 = 0; recorded5 = false; counterTB = 0; recordedTB = false; counterTD = 0; // transitionDragon
		 recordedTD = false; moveUp= false; moveDown = false; moveRight = false; moveLeft = false; faceUp = false;
		 faceRight = true; faceDown = false; faceLeft = false; currentDir = 0; walking = false;
		 walkingAngle = 0; attack = false; jump = false; char_x = 0; char_y = 0; char_z = 0; charIsAlive = true; charHP = 15;
		batIsAlive = true; batAttack = false; batHP = 7; battleDragon = false; dragonIsAlive = true; dragonAttack = false;
		 dragonHP = 20; gamePrep = false; phase1 = true; transition12 = false; phase2 = false; transitionBat = false;
		 transitionBatDone = false; batBattle = false; transitionDragon = false; transitionDragonDone = false;
		 dragonBattle = false; victory = 1; attacked = false;
		  attackedCounter = 0;
		  recordedAttackedB = false;
			attackedD = false;
			attackedCounterD = 0;
			recordedAttackedD = false;;

			recordedBall = false;
			counterBall = false;

			fireBallHitSoundPlayed = false;

			 recordedAngle = false;
			 phase1Counter = 0;
			 lookrecorded = false; // 1-game in process, 0-defeat, 2-victory
	 } });
}


function update_camera( self, animation_delta_time )
	{
		var leeway = 70, border = 50;
		var degrees_per_frame = .0002 * animation_delta_time;
		var meters_per_frame  = .01 * animation_delta_time;
																					// Determine camera rotation movement first
		var movement_plus  = [ movement[0] + leeway, movement[1] + leeway ];		// movement[] is mouse position relative to canvas center; leeway is a tolerance from the center.
		var movement_minus = [ movement[0] - leeway, movement[1] - leeway ];
		var outside_border = false;

		for( var i = 0; i < 2; i++ )
			if ( Math.abs( movement[i] ) > canvas_size[i]/2 - border )	outside_border = true;		// Stop steering if we're on the outer edge of the canvas.

		for( var i = 0; looking && outside_border == false && i < 2; i++ )			// Steer according to "movement" vector, but don't start increasing until outside a leeway window from the center.
		{
			var velocity = ( ( movement_minus[i] > 0 && movement_minus[i] ) || ( movement_plus[i] < 0 && movement_plus[i] ) ) * degrees_per_frame;	// Use movement's quantity unless the &&'s zero it out
			self.graphicsState.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), self.graphicsState.camera_transform );			// On X step, rotate around Y axis, and vice versa.
		}
		self.graphicsState.camera_transform = mult( translation( scale_vec( meters_per_frame, thrust ) ), self.graphicsState.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame
	}



// Generate one part of a curve. Returns an array of two points - a line segment of a curve. Repeatedly call this and increase the "segment" number to get the full
// curve. To specify the curve's location, supply endpoints a and b and tangents da and db. Adjust num_segments to increase / decrease granularity.


Animation.prototype.drawSky = function( model_transform, material )
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(1000, 1000, 1000));
	this.m_cube.draw(this.graphicsState, model_transform, material);
	model_transform = md_stack.pop();
}

Animation.prototype.drawGround = function( model_transform, material )
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, -50, 0));
	model_transform = mult(model_transform, scale(1000, 100, 1000));
	this.m_cube.draw(this.graphicsState, model_transform, material);

	model_transform = md_stack.pop();
}

Animation.prototype.drawOneTree = function( model_transform, foliage, trunk )
{

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, model_transform, trunk);
	model_transform = mult(model_transform, translation(0, 1, 0));
	this.m_cube.draw(this.graphicsState, model_transform, trunk);
	model_transform = mult(model_transform, translation(0, 1.5, 0));
	model_transform = mult(model_transform, scale(2, 2, 2));
	this.m_cube.draw(this.graphicsState, model_transform, foliage);
	model_transform = md_stack.pop();
}

Animation.prototype.drawFiveTrees = function( model_transform, foliage, trunk )
{
	md_stack.push(model_transform);
	this.drawOneTree( model_transform, foliage, trunk);

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, 2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, -2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	model_transform = md_stack.pop();
}

Animation.prototype.drawNineTrees = function( model_transform, foliage, trunk )
{
	md_stack.push(model_transform);
	this.drawOneTree( model_transform, foliage, trunk);

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = mult(model_transform, translation(0, 0, 2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = mult(model_transform, translation(0, 0, -2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, 2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = mult(model_transform, translation(-2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, -2));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = mult(model_transform, translation(2, 0, 0));
	this.drawOneTree( model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	model_transform = md_stack.pop();
}

Animation.prototype.drawBlockTree = function( model_transform, foliage, trunk)
{
	for (var h = 1; h < 5; h++) {
		if (h == 1) {
			model_transform = mult(model_transform, translation(-15, 0, 0));
		}
		if (char_x <= 105*h && char_x >= 105*(h-2)) {
			model_transform = mult(model_transform, translation(30, 0, 0));
				for( var i = 0; i < 3; i++ )
				{
					md_stack.push(model_transform);
					this.drawFiveTrees(model_transform, foliage, trunk);
					md_stack.push(model_transform);
					model_transform = mult(model_transform, translation(6*i, 0, 0));
					this.drawFiveTrees(model_transform, foliage, trunk);
					model_transform = md_stack.pop();
					md_stack.push(model_transform);
					model_transform = mult(model_transform, translation(-6*i, 0, 0));
					this.drawFiveTrees(model_transform, foliage, trunk);
					model_transform = md_stack.pop();
					model_transform = md_stack.pop();
				}
		}
		else {
			model_transform = mult(model_transform, translation(30, 0, 0));
		}
	}
}

Animation.prototype.drawSideTrees = function( model_transform, foliage, trunk)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, -8));
	this.drawBlockTree(model_transform, foliage, trunk);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, 8));
	this.drawBlockTree(model_transform, foliage, trunk);
	model_transform = md_stack.pop();
}


Animation.prototype.drawAllTrees = function( model_transform, foliage, trunk )
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(2.5, 2.5, 2.5));
	this.drawSideTrees(model_transform, foliage, trunk);


	model_transform = md_stack.pop();
}

Animation.prototype.textureLeg = function (model_transform, legs, legb)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, legs);
	model_transform = mult(model_transform, translation( 1.03, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, legs);

	model_transform = mult(model_transform, rotation(-270, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, -.51));
	this.m_rectangle.draw(this.graphicsState, model_transform, legs);
	model_transform = mult(model_transform, translation(1.02, 0, 0));
	model_transform = mult(model_transform, rotation(180, 0, 1, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, legs);

	model_transform = mult(model_transform, rotation(90, 0, 0, 1));
	model_transform = mult(model_transform, translation(0.51, -0.505, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, legb);
	model_transform = mult(model_transform, translation(-1.015, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, legb);

	model_transform = md_stack.pop();
}

Animation.prototype.textureArm = function (model_transform, arms, armt, armb)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, arms);
	model_transform = mult(model_transform, translation( 1.03, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, arms);

	model_transform = mult(model_transform, rotation(-270, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, -.51));
	this.m_rectangle.draw(this.graphicsState, model_transform, arms);
	model_transform = mult(model_transform, translation(1.02, 0, 0));
	model_transform = mult(model_transform, rotation(180, 0, 1, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, arms);

	model_transform = mult(model_transform, rotation(90, 0, 0, 1));
	model_transform = mult(model_transform, translation(0.51, -0.505, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, armt);
	model_transform = mult(model_transform, translation(-1.015, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, armb);

	model_transform = md_stack.pop();
}

Animation.prototype.textureHead = function (model_transform, headf, headl, headr, headb, headt)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, headf);
	model_transform = mult(model_transform, translation( 1.03, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, headb);

	model_transform = mult(model_transform, rotation(-270, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.51, 0, -.51));
	this.m_rectangle.draw(this.graphicsState, model_transform, headl);
	model_transform = mult(model_transform, translation(1.02, 0, 0));
	model_transform = mult(model_transform, rotation(180, 0, 1, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, headr);

	model_transform = mult(model_transform, rotation(90, 0, 0, 1));
	model_transform = mult(model_transform, translation(0.51, -0.505, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, headt);

	model_transform = md_stack.pop();


}

Animation.prototype.textureBody = function (model_transform, bodyb, bodyf, bodyl, bodyr)
{
	md_stack.push(model_transform);
	model_transform = md_stack.pop();
}

Animation.prototype.drawMan = function( model_transform, head, arm, torso, leg,
	headf, headl, headr, headb, headt,
	bodyb, bodyf, bodyl, bodyr,
	arms, armt, armb, legs, legb)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0.2, 0));
	// legs
	model_transform = mult(model_transform, translation(0, 1.25, 0));
	model_transform = mult(model_transform, scale(1, 1, 2));


	md_stack.push(model_transform);

	model_transform = mult(model_transform, translation(0, 0.5, 0));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0.4, 0));
	model_transform = mult(model_transform, scale(1, 1, 1/2));
	if (phase2 && walking) {
		model_transform = mult(model_transform, rotation(-walkingAngle, 1, 0, 0));
	}
	model_transform = mult(model_transform, scale(1, 1, 2));
	model_transform = mult(model_transform, scale(1, 1.2, 3/4));
	model_transform = mult(model_transform, translation(0, -0.4, 0));
	model_transform = mult(model_transform, translation(-0.5, 0, 0));
	model_transform = mult(model_transform, scale(1, 2.5, 1));
	this.m_cube.draw(this.graphicsState, model_transform, leg);
	this.textureLeg(model_transform, legs, legb); /* leg texture */

	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0.4, 0));
	model_transform = mult(model_transform, scale(1, 1, 1/2));
	if (phase2 && walking) {
		model_transform = mult(model_transform, rotation(walkingAngle, 1, 0, 0));
	}
	model_transform = mult(model_transform, scale(1, 1, 2));
	model_transform = mult(model_transform, scale(1, 1.2, 3/4));
	model_transform = mult(model_transform, translation(0, -0.4, 0));

	model_transform = mult(model_transform, translation(0.5, 0, 0));
	model_transform = mult(model_transform, scale(1, 2.5, 1));
	this.m_cube.draw(this.graphicsState, model_transform, leg);
	this.textureLeg(model_transform, legs, legb); /* leg texture */
	model_transform = md_stack.pop();
	model_transform = md_stack.pop();

	// torso
	model_transform = mult(model_transform, translation(0, 2.25, 0));
	model_transform = mult(model_transform, scale(2, 2, 1));
	this.m_cube.draw(this.graphicsState, model_transform, torso);
	this.textureBody(model_transform, bodyb, bodyf, bodyl, bodyr); /* body texture */
	md_stack.push(model_transform);

	// arms
	if (!transition12 && !phase1 && !transitionBat && !transitionDragon) {
		if (attack && !recorded12) {
			counterAttack = 0;
			recorded12 = true;
		}
		if (attack && recorded12) {
			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0, 0.4, 0));
			if (counterAttack < 10*33) {
				model_transform = mult(model_transform, rotation(-45-counterAttack/33*9, 1, 0, 0));
			}
			else if(counterAttack > 10*33 && counterAttack < 20*33) {
				model_transform = mult(model_transform, rotation(-135+(counterAttack/33-10)*9, 1, 0, 0));
			}
			else {
				model_transform = mult(model_transform, rotation(-45, 1, 0, 0));
				recorded12 = false;
			}
			model_transform = mult(model_transform, translation(0, -0.4, 0));
			model_transform = mult(model_transform, scale(0.5, 1.25, 0.8));
			model_transform = mult(model_transform, translation(-1.5, -.01, 0));
			this.m_cube.draw(this.graphicsState, model_transform, arm);
			this.textureArm(model_transform, arms, armt, armb); /* arm texture */
			model_transform = md_stack.pop();
			counterAttack += 33;
		}
		else {
			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0, 0.4, 0));
			if (phase2 && walking) {
				model_transform = mult(model_transform, rotation(walkingAngle, 1, 0, 0));
			}
			model_transform = mult(model_transform, translation(0, -0.4, 0));
			model_transform = mult(model_transform, scale(0.5, 1.25, 0.8));
			model_transform = mult(model_transform, translation(-1.5, -.01, 0));
			this.m_cube.draw(this.graphicsState, model_transform, arm);
			this.textureArm(model_transform, arms, armt, armb); /* arm texture */
			model_transform = md_stack.pop();
		}
	}
	else { // transition12
		md_stack.push(model_transform);
		model_transform = mult(model_transform, translation(0, 0.4, 0));
		if (counter12 < 40*33) {
			model_transform = mult(model_transform, rotation(-counter12/33*4.5, 1, 0, 0));
		}
		if (counter12 > 40*33 && counter12 < 60*33) {
			model_transform = mult(model_transform, rotation(-180, 1, 0, 0));
		}
		if (counter12 > 60*33 && counter12 < 100*33) {
			model_transform = mult(model_transform, rotation(-180+(counter12/33-60)*4.5, 1, 0, 0));
		}
		model_transform = mult(model_transform, translation(0, -0.4, 0));
		model_transform = mult(model_transform, scale(0.5, 1.25, 0.8));
		model_transform = mult(model_transform, translation(-1.5, -.01, 0));
		this.m_cube.draw(this.graphicsState, model_transform, arm);
		this.textureArm(model_transform, arms, armt, armb); /* arm texture */
		model_transform = md_stack.pop();
	}

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0.4, 0));
	if (phase2 && walking) {
		model_transform = mult(model_transform, rotation(-walkingAngle, 1, 0, 0));
	}
	model_transform = mult(model_transform, translation(0, -0.4, 0));
	model_transform = mult(model_transform, scale(0.5, 1.25, 0.8));
	model_transform = mult(model_transform, translation(1.5, -.01, 0));
	this.m_cube.draw(this.graphicsState, model_transform, arm);
	this.textureArm(model_transform, arms, armt, armb); /* arm texture */
	model_transform = md_stack.pop();

	// head
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, 1, 0));
	this.m_cube.draw(this.graphicsState, model_transform, head);
	this.textureHead(model_transform, headf, headl, headr, headb, headt); /* head texture */

	model_transform = md_stack.pop();

}

Animation.prototype.drawSword = function( model_transform, handle, blade)
{

	md_stack.push(model_transform);
	if (phase1) {
		model_transform = mult(model_transform, translation(0, 0.5, -1.2));
		model_transform = mult(model_transform, translation(0, 3, 0));
		model_transform = mult( model_transform, rotation( 45, 0, 0, 1 ) );
		model_transform = mult(model_transform, translation(0, -3, 0));
		model_transform = mult(model_transform, translation(0, 2, 0));
		md_stack.push(model_transform);
		model_transform = mult(model_transform, scale(1.5, 4, 0.2));
		this.m_cube.draw(this.graphicsState, model_transform, blade);
	 	model_transform = md_stack.pop();

		model_transform = mult(model_transform, translation(0, 2.1, 0));
		model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
		this.m_cube.draw(this.graphicsState, model_transform, handle);

		model_transform = mult(model_transform, translation(0, 1.5, 0));
		model_transform = mult(model_transform, scale(0.17, 10, 1.2));
		this.m_cube.draw(this.graphicsState, model_transform, handle);
	}
	else if (transition12) {
		if (counter12 < 40*33) {
			model_transform = mult(model_transform, translation(0, 0.5, -1.2));
			model_transform = mult(model_transform, translation(0, 3, 0));
			model_transform = mult( model_transform, rotation( 45, 0, 0, 1 ) );
			model_transform = mult(model_transform, translation(0, -3, 0));
			model_transform = mult(model_transform, translation(0, 2, 0));
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
		 	model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
		}
		else if (counter12 > 40*33 && counter12 < 60*33) {
			model_transform = mult(model_transform, translation(-1.5, 6, -4));
			model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );


			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
			model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
		}
		else if (counter12 > 60*33 && counter12 < 100*33) {
			model_transform = mult(model_transform, translation(-1.5, 6, -4));
			model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );

			 model_transform = mult(model_transform, translation(-1.5, 4, -1));
			 model_transform = mult( model_transform, rotation( (counter12/33-60)*4.5, 0, 0, 1 ) );
			//CURRENT_BASIS_IS_WORTH_SHOWING(this, model_transform);
			 model_transform = mult(model_transform, translation(1.5, -4, 1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
			model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
		}
	}
	else {
		if (attack && !transition12 && !phase1 && !transitionBat && !transitionDragon && !transition12) {
			model_transform = mult(model_transform, translation(-1.5, 6, -4));
			model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );

			 model_transform = mult(model_transform, translation(-1.5, 4, -1));
			 if (counterAttack < 10*33) {
 				model_transform = mult(model_transform, rotation(135-counterAttack/33*9, 0, 0, 1));
 			}
 			else if(counterAttack > 10*33 && counterAttack < 20*33) {
 				model_transform = mult(model_transform, rotation(45+(counterAttack/33-10)*9, 0, 0, 1));
 			}
 			else {
 				model_transform = mult(model_transform, rotation(135, 0, 0, 1));
 			}
			 model_transform = mult(model_transform, translation(1.5, -4, 1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
			model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
			}
		else if (!walking) {
			model_transform = mult(model_transform, translation(-1.5, 6, -4));
			model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );

			 model_transform = mult(model_transform, translation(-1.5, 4, -1));
			 model_transform = mult( model_transform, rotation( 180, 0, 0, 1 ) );
			//CURRENT_BASIS_IS_WORTH_SHOWING(this, model_transform);
			 model_transform = mult(model_transform, translation(1.5, -4, 1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
			model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
		}
		else {
			model_transform = mult(model_transform, translation(-1.5, 6, -4));
			model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );

			 model_transform = mult(model_transform, translation(-1.5, 4, -1));
			 model_transform = mult( model_transform, rotation( 180+walkingAngle, 0, 0, 1 ) );
			//CURRENT_BASIS_IS_WORTH_SHOWING(this, model_transform);
			 model_transform = mult(model_transform, translation(1.5, -4, 1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(1.5, 4, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, blade);
			model_transform = md_stack.pop();

			model_transform = mult(model_transform, translation(0, 2.1, 0));
			model_transform = mult(model_transform, scale(2.6, 0.25, 0.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);

			model_transform = mult(model_transform, translation(0, 1.5, 0));
			model_transform = mult(model_transform, scale(0.17, 10, 1.2));
			this.m_cube.draw(this.graphicsState, model_transform, handle);
		}

	}


	model_transform = md_stack.pop();
}


Animation.prototype.drawCharacter = function( model_transform, head, arm, torso, leg, handle, blade,
	headf, headl, headr, headb, headt,
	bodyb, bodyf, bodyl, bodyr,
	arms, armt, armb, legs, legb )
{
	md_stack.push(model_transform);
	if (jump == true && recordedJump == false && !transitionBat && !transitionDragon && !transition12 && !phase1) {
		counterJump = 0;
		recordedJump = true;
	}
	else if (jump == true && recordedJump == true) {
		if (counterJump >= 0 && counterJump <= 10*33) {
			model_transform = mult(model_transform, translation(0, (counterJump/33)*0.2, 0));
		}
		else if (counterJump >= 10*33 && counterJump <= 20*33) {
			model_transform = mult(model_transform, translation(0, 2 - (counterJump/33-10)*0.2, 0));
		}
		else {
			recordedJump = false;
		}
		counterJump += 33;
	}
	model_transform = mult(model_transform, translation(0, 1, 0));
	model_transform = mult(model_transform, translation(char_x, char_y, char_z));
	if (transitionBat || transitionDragon) {
		walking = false;
	}
	if (phase2 == true && !transitionBat && !transitionDragon && !transition12)
	{
		if (moveUp == true)
		{
			walking = true;
			char_z -= 0.35;
			currentDir = 3;
		}
		if (moveDown == true)
		{
			walking = true;
			char_z += 0.35;
			currentDir = 1;
		}
		if (moveRight == true)
		{
			walking = true;
			char_x += 0.45;
			currentDir = 0;
		}
		if (moveLeft == true)
		{
			walking = true;
			char_x -= 0.45;
			currentDir = 2;
		}
	}
	if (faceUp) {
		model_transform = mult( model_transform, rotation( 90*(1-currentDir), 0, 1, 0 ) );
	}
	else if (faceLeft) {
		model_transform = mult( model_transform, rotation( 90*(2-currentDir), 0, 1, 0 ) );
	}
	else if (faceRight) {
		model_transform = mult( model_transform, rotation( 90*(0-currentDir), 0, 1, 0 ) );
	}
	else if (faceDown) {
		model_transform = mult( model_transform, rotation( 90*(3-currentDir), 0, 1, 0 ) );
	}

	if (walking) {
		walkingAngle = 30*Math.sin(1/150*(this.graphicsState.animation_time-2));
	}

	model_transform = mult( model_transform, rotation( 90, 0, 1, 0 ) );

	this.drawMan(model_transform, head, arm, torso, leg,
		headf, headl, headr, headb, headt,
		bodyb, bodyf, bodyl, bodyr,
		arms, armt, armb, legs, legb);


	this.drawSword(model_transform, handle, blade);


	model_transform = md_stack.pop();
}

var attacked = false;
var attackedCounter = 0;
var recordedAttackedB = false;;


Animation.prototype.drawEvilBat = function( model_transform, bat, eye, blood )
{
	md_stack.push(model_transform);
	if (batHP <= 0) {
		batIsAlive = false;
	}
	if (char_x >= 73 && char_x <=78 && char_z >= -5 && char_z <= 5 && attack && !recordedAttackedB) {
		attacked = true;
		attackedCounter = 0;
		recordedAttackedB = true;
		batHP -= 1;
	}
	if (attacked) {
		if (attackedCounter < 3*33) {

		}
		else if (attackedCounter >= 3*33 && attackedCounter < 5*33) {
			// past drawing bat
			if (!transitionBat && recordedBat == false) {
				counterBat = 0;
				recordedBat = true;
			}
			else if (!transitionBat && recordedBat == true) {
				if (counterBat >= 0 && counterBat <= 10*33) {
					model_transform = mult(model_transform, translation(0, (counterBat/33)*0.2, 0));
				}
				else if (counterBat >= 10*33 && counterBat <= 20*33) {
					model_transform = mult(model_transform, translation(0, 2 - (counterBat/33-10)*0.2, 0));
				}
				else {
					recordedBat = false;
				}
				counterBat += 33;
			}
			model_transform = mult(model_transform, translation(0, 4, 0));
			// body
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(2, 2, 2));
			this.m_cube.draw(this.graphicsState, model_transform, bat);
			model_transform = md_stack.pop();
			// eye
			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0, -0.3, 1.1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0.75, 0, 0));
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
			this.m_triangle.draw(this.graphicsState, model_transform, eye);
			model_transform = md_stack.pop();

			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(-0.75, 0, 0));
			model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
			this.m_triangle.draw(this.graphicsState, model_transform, eye);
			model_transform = md_stack.pop();

			model_transform = md_stack.pop();

			// right wing
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(0.45, 0.1, 0));
			model_transform = mult(model_transform, translation(-0.2, 0, 0));
			model_transform = mult(model_transform, scale(1/3, 1, 2));
			//model_transform = mult( model_transform, rotation( 10, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(0.2, 0, 0));
			this.m_cube.draw(this.graphicsState, model_transform, bat);
			model_transform = md_stack.pop();

			// left wing
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(-0.45, 0.1, 0));
			model_transform = mult(model_transform, translation(0.2, 0, 0));
			model_transform = mult(model_transform, scale(1/3, 1, 2));
			//model_transform = mult( model_transform, rotation( -10, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(-0.2, 0, 0));
			this.m_cube.draw(this.graphicsState, model_transform, bat);



			model_transform = md_stack.pop();
		}
		else if (attackedCounter >= 5*33 && attackedCounter < 6*33) {

		}
		else if (attackedCounter >= 6*33 && attackedCounter < 9*33) {
			// past drawing bat
			if (!transitionBat && recordedBat == false) {
				counterBat = 0;
				recordedBat = true;
			}
			else if (!transitionBat && recordedBat == true) {
				if (counterBat >= 0 && counterBat <= 10*33) {
					model_transform = mult(model_transform, translation(0, (counterBat/33)*0.2, 0));
				}
				else if (counterBat >= 10*33 && counterBat <= 20*33) {
					model_transform = mult(model_transform, translation(0, 2 - (counterBat/33-10)*0.2, 0));
				}
				else {
					recordedBat = false;
				}
				counterBat += 33;
			}
			model_transform = mult(model_transform, translation(0, 4, 0));
			// body
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(2, 2, 2));
			this.m_cube.draw(this.graphicsState, model_transform, bat);
			model_transform = md_stack.pop();
			// eye
			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0, -0.3, 1.1));

			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(0.75, 0, 0));
			model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
			this.m_triangle.draw(this.graphicsState, model_transform, eye);
			model_transform = md_stack.pop();

			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(-0.75, 0, 0));
			model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
			this.m_triangle.draw(this.graphicsState, model_transform, eye);
			model_transform = md_stack.pop();

			model_transform = md_stack.pop();

			// right wing
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(0.45, 0.1, 0));
			model_transform = mult(model_transform, translation(-0.2, 0, 0));
			model_transform = mult(model_transform, scale(1/3, 1, 2));
			//model_transform = mult( model_transform, rotation( 10, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(0.2, 0, 0));
			this.m_cube.draw(this.graphicsState, model_transform, bat);
			model_transform = md_stack.pop();

			// left wing
			md_stack.push(model_transform);
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(-0.45, 0.1, 0));
			model_transform = mult(model_transform, translation(0.2, 0, 0));
			model_transform = mult(model_transform, scale(1/3, 1, 2));
			//model_transform = mult( model_transform, rotation( -10, 0, 0, 1 ) );
			model_transform = mult(model_transform, scale(3, 1, 0.5));
			model_transform = mult(model_transform, translation(-0.2, 0, 0));
			this.m_cube.draw(this.graphicsState, model_transform, bat);


			model_transform = md_stack.pop();
		}
		else if (attackedCounter >= 9*33 && attackedCounter < 10*33)
		{

		}
		else
		{
			attacked = false;
			recordedAttackedB = false;;
		}
		attackedCounter+=33;
	}
	else {
		if (!transitionBat && recordedBat == false) {
			counterBat = 0;
			recordedBat = true;
		}
		else if (!transitionBat && recordedBat == true) {
			if (counterBat >= 0 && counterBat <= 10*33) {
				model_transform = mult(model_transform, translation(0, (counterBat/33)*0.2, 0));
			}
			else if (counterBat >= 10*33 && counterBat <= 20*33) {
				model_transform = mult(model_transform, translation(0, 2 - (counterBat/33-10)*0.2, 0));
			}
			else {
				recordedBat = false;
			}
			counterBat += 33;
		}
		model_transform = mult(model_transform, translation(0, 4, 0));
		// body
		md_stack.push(model_transform);
		model_transform = mult(model_transform, scale(2, 2, 2));
		this.m_cube.draw(this.graphicsState, model_transform, bat);
		model_transform = md_stack.pop();
		// eye
		md_stack.push(model_transform);
		model_transform = mult(model_transform, translation(0, -0.3, 1.1));

		md_stack.push(model_transform);
		model_transform = mult(model_transform, translation(0.75, 0, 0));
		model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );
		model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
		this.m_triangle.draw(this.graphicsState, model_transform, eye);
		model_transform = md_stack.pop();

		md_stack.push(model_transform);
		model_transform = mult(model_transform, translation(-0.75, 0, 0));
		model_transform = mult(model_transform, scale(0.63, 0.63, 0.63));
		this.m_triangle.draw(this.graphicsState, model_transform, eye);
		model_transform = md_stack.pop();

		model_transform = md_stack.pop();

		// right wing
		md_stack.push(model_transform);
		model_transform = mult(model_transform, scale(3, 1, 0.5));
		model_transform = mult(model_transform, translation(0.45, 0.1, 0));
		model_transform = mult(model_transform, translation(-0.2, 0, 0));
		model_transform = mult(model_transform, scale(1/3, 1, 2));
		//model_transform = mult( model_transform, rotation( 10, 0, 0, 1 ) );
		model_transform = mult(model_transform, scale(3, 1, 0.5));
		model_transform = mult(model_transform, translation(0.2, 0, 0));
		this.m_cube.draw(this.graphicsState, model_transform, bat);
		model_transform = md_stack.pop();

		// left wing
		md_stack.push(model_transform);
		model_transform = mult(model_transform, scale(3, 1, 0.5));
		model_transform = mult(model_transform, translation(-0.45, 0.1, 0));
		model_transform = mult(model_transform, translation(0.2, 0, 0));
		model_transform = mult(model_transform, scale(1/3, 1, 2));
		//model_transform = mult( model_transform, rotation( -10, 0, 0, 1 ) );
		model_transform = mult(model_transform, scale(3, 1, 0.5));
		model_transform = mult(model_transform, translation(-0.2, 0, 0));
		this.m_cube.draw(this.graphicsState, model_transform, bat);

		model_transform = md_stack.pop();
	}

	model_transform = md_stack.pop();
}

var attackedD = false;
var attackedCounterD = 0;
var recordedAttackedD = false;;

var recordedBall = false;
var counterBall = false;

var fireBallHitSoundPlayed = false;

Animation.prototype.drawFireBall = function(model_transform, fireBall)
{
	md_stack.push(model_transform);
	if (dragonBattle && transitionDragonDone && recordedBall == false) {
		counterBall = 0;
		recordedBall = true;
		fireBallHitSoundPlayed = false;
		fireBallSound.play();
	}
	if (recordedBall == true) {
		var distance = -(-190 - char_y);
		if (counterBall < 30*33) {
			model_transform = mult(model_transform, translation(0, counterBall/33*.333, counterBall/33*-.333));
			model_transform = mult(model_transform, scale(1.5, 1, 1));
			model_transform = mult(model_transform, translation(0, 0, -1.7));
			model_transform = mult(model_transform, scale(1.5, 1.5, 1.5));
			gl.uniform1i( g_addrs.IS_FIRE_loc, true);
			this.m_sphere.draw(this.graphicsState, model_transform, fireBall);
			gl.uniform1i( g_addrs.IS_FIRE_loc, false);
			model_transform = mult(model_transform, scale(1.0005, 1.0005, 1.0005));
			this.m_sphere.draw(this.graphicsState, model_transform, fireBall);
		}
		else if (counterBall >= 30*33 && counterBall <= 80*33) {
			if (!fireBallHitSoundPlayed) {
				fireBallHitSound.play();
				fireBallHitSoundPlayed = true;
			}
		}
		else {
			recordedBall = false;
		}
		counterBall += 33;
	}

	model_transform = md_stack.pop();
}

Animation.prototype.drawDragon = function (model_transform, teeth, dEye, dBody, spike, belly, dwing, dwingin, neck, dnostril, fireBall)
{
	//model_transform = mult( model_transform, rotation( 180, 0, 1, 0 ) );
	if (dragonHP <= 0) {
		dragonIsAlive = false;
	}
	if (char_x >= 185 && char_x <=200 && char_z >= -10 && char_z <= 10 && attack && !recordedAttackedD) {
		attackedD = true;
		attackedCounterD = 0;
		recordedAttackedD = true;
		dragonHP -= 1;
	}
	if(attackedD)
	{
		if (attackedCounterD >= 10*33) {
			attackedD = false;
			recordedAttackedD = false;

		}
		attackedCounterD+=33;

	}

	if (dragonIsAlive && transitionBatDone) {

			md_stack.push(model_transform);
			model_transform = mult(model_transform, translation(20, 0, 0));
			// draw feet
			this.drawFeet(model_transform, dBody, spike);

			// draw body
			this.drawBody(model_transform, dBody, belly, neck);

			// draw head

		  this.drawHead(model_transform, dBody, dEye, teeth, spike, dnostril, fireBall);

			// draw wings

			this.drawWings(model_transform, dBody, spike, dwing, dwingin);


			model_transform = md_stack.pop();
			model_transform = md_stack.pop();
	}


}

Animation.prototype.drawFeet = function (model_transform, dBody, spike)
{
	model_transform = mult(model_transform, translation(0, 4.5, 0));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(6.5, 0, 0));
	model_transform = mult(model_transform, scale(5, 9, 9));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = mult(model_transform, scale(1, 1/9, 1));
	model_transform = mult(model_transform, translation(0, -4, 0.5));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-6.5, 0, 0));
	model_transform = mult(model_transform, scale(5, 9, 9));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = mult(model_transform, scale(1, 1/9, 1));
	model_transform = mult(model_transform, translation(0, -4, 0.5));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = md_stack.pop();

}

var recordedAngle = false;
var phase1Counter = 0;
var lookrecorded = false;

Animation.prototype.drawBody = function (model_transform, dBody, belly, neck)
{
	var turningAngle = 0;
	var AngleMax = 0;
	if (transitionDragon) {
		if (counterTD < 125*33 ) {
			turningAngle = counterTD/33*0.222;
		}
		else if (counterTD >= 125*33 && counterTD <= 270*33) {
			if (!recordedAngle) {
				AngleMax = (counterTD/33-1)*0.222;
				recordedAngle = true;
			}
			turningAngle = 30- (counterTD/33-135)*0.222;
		}
	}


	model_transform = mult(model_transform, translation(0, 3, 0));
	model_transform = mult(model_transform, rotation(30 + turningAngle, 1, 0, 0));
	model_transform = mult(model_transform, translation(0, 9, 0));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(8, 14, 10));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	// draw belly
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, belly);
	model_transform = md_stack.pop();



	model_transform = mult(model_transform, translation(0, 0.5, 0));
	model_transform = mult(model_transform, scale(.5, 1/5, .5));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, neck);
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, .95, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, neck);
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, .95, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, neck);
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, .95, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, neck);
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, .95, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, translation(-.505, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, neck);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);


}

Animation.prototype.drawHead = function (model_transform, dBody, dEye, teeth, spike, dnostril, fireBall)
{
	model_transform = md_stack.pop();
	//model_transform = mult(model_transform, rotation (-90, 0,1,0));
	// head
	model_transform = mult(model_transform, translation(0, .95, -.05));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(1, 1.5, 1));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = md_stack.pop();
	md_stack.push(model_transform);

	// upper jaw
	model_transform = mult(model_transform, translation(0, 0, 1));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(1, 0.3, 1.3));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	// lower jaw
	model_transform = mult(model_transform, translation(0, -1, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = md_stack.pop();

	// head append
	model_transform = mult(model_transform, translation(.5, .15, -.5));
	model_transform = mult(model_transform, scale(1, .6, .4));
	model_transform = mult(model_transform, rotation (-90, 0,1,0));
	this.m_flake.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(1.5, 1, .8));
	model_transform = mult(model_transform, translation(-0.4, 0, -.005));
	this.m_triangle.draw(this.graphicsState, model_transform, dEye);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(1.5, 1, .8));
	model_transform = mult(model_transform, translation(-0.4, 0, 1.26));
	this.m_triangle.draw(this.graphicsState, model_transform, dEye);
	model_transform = md_stack.pop();

	md_stack.push(model_transform);


	model_transform = mult(model_transform, rotation (90, 0,1,0));

	// notrils
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-.075, .12, 2.2));
	model_transform = mult(model_transform, scale(.15, .4, .7));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(.55, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, dnostril);
	model_transform = md_stack.pop();

	model_transform = md_stack.pop();

	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-.925, .12, 2.2));
	model_transform = mult(model_transform, scale(.15, .4, .7));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(-.55, 0, 0));
	this.m_rectangle.draw(this.graphicsState, model_transform, dnostril);
	model_transform = md_stack.pop();
	model_transform = md_stack.pop();

	// forehorn
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, rotation (90, 0,1,0));
	model_transform = mult(model_transform, translation(-.5, .4, 2.5));
	model_transform = mult(model_transform, scale(.2, .4, 1));
	model_transform = mult(model_transform, rotation (180, 1,0,0));
	this.m_flakeAce.draw(this.graphicsState, model_transform, spike);
	model_transform = mult(model_transform, scale(1.1, 2, .7));
	model_transform = mult(model_transform, translation(0, .46, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);

	this.drawFireBall(model_transform, fireBall);

	// backhorn
	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(0, 1, -.2));
	model_transform = mult(model_transform, scale(.3, .4, .6));
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(1.15, -.5, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = mult(model_transform, translation(0, .5, -.5));
	model_transform = mult(model_transform, rotation (180, 1,0,0));
	model_transform = mult(model_transform, scale(1, 1, 2));
	this.m_flakeAce.draw(this.graphicsState, model_transform, spike);

	model_transform = md_stack.pop();
	model_transform = mult(model_transform, translation(-1.15, -.5, 0));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = mult(model_transform, translation(0, .5, -.5));
	model_transform = mult(model_transform, rotation (180, 1,0,0));
	model_transform = mult(model_transform, scale(1, 1, 2));
	this.m_flakeAce.draw(this.graphicsState, model_transform, spike);


}

Animation.prototype.drawWings = function (model_transform, dBody, spike, dwing, dwingin)
{
	model_transform = md_stack.pop();
	md_stack.push(model_transform);
	model_transform = mult(model_transform, translation(0, 0, -5));
	model_transform = mult(model_transform, scale(15, 15, 1.5));
	model_transform = mult(model_transform, translation(0, .05, -0.1));
	this.m_cube.draw(this.graphicsState, model_transform, dBody);
	model_transform = mult(model_transform, translation(0, -.05, 0.1));
	model_transform = mult(model_transform, scale(1/15, 1/15, 1/1.5));


	md_stack.push(model_transform);
	model_transform = mult( model_transform, rotation( -20, 0, 0, 1 ) );
	model_transform = mult(model_transform, scale(37, 15, 1.5));
	model_transform = mult(model_transform, translation(-.1, .5, 0));
	model_transform = mult( model_transform, rotation( -90, 1, 0, 0 ) );
	model_transform = mult( model_transform, rotation( 90, 0, 0, 1 ) );
	model_transform = mult( model_transform, rotation( 180, 0, 1, 0 ) );
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwing);
	model_transform = mult( model_transform, rotation( -30, 1, 0, 0 ) );
	model_transform = mult(model_transform, translation(0, 0, .5));
	model_transform = mult(model_transform, scale(.8, .8, .8));
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
	model_transform = mult(model_transform, translation(0, -.5, 0));
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
	model_transform = mult(model_transform, translation(0, .5, 0));
	model_transform = mult( model_transform, rotation( -30, 1, 0, 0 ) );
	model_transform = mult(model_transform, translation(0, 0, .5));
	model_transform = mult(model_transform, scale(.8, .8, .4));
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
	model_transform = md_stack.pop();



	md_stack.push(model_transform);
	model_transform = mult( model_transform, rotation( 20, 0, 0, 1 ) );
	model_transform = mult(model_transform, scale(37, 15, 1.5));
	model_transform = mult(model_transform, translation(.1, .5, 0));
	model_transform = mult( model_transform, rotation( -90, 1, 0, 0 ) );
	model_transform = mult( model_transform, rotation( -90, 0, 0, 1 ) );
	model_transform = mult( model_transform, rotation( -180, 0, 1, 0 ) );
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwing);
	 model_transform = mult( model_transform, rotation( -30, 1, 0, 0 ) );
	 model_transform = mult(model_transform, translation(0, 0, .5));
	 model_transform = mult(model_transform, scale(.8, .8, .8));
	 this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
	 model_transform = mult(model_transform, translation(0, -.5, 0));
 	this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
 	model_transform = mult(model_transform, translation(0, .5, 0));
	model_transform = mult( model_transform, rotation( -30, 1, 0, 0 ) );
	model_transform = mult(model_transform, translation(0, 0, .5));
	model_transform = mult(model_transform, scale(.8, .8, .4));
	this.m_flakeAce.draw(this.graphicsState, model_transform, dwingin);
	model_transform = md_stack.pop();


}

Animation.prototype.drawRoad = function (model_transform, road)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, scale(2.5, 2.5, 2.5));
	model_transform = mult(model_transform, scale(300, 0.1, 7));
	model_transform = mult(model_transform, translation(0, 0.5, 0));
	this.m_cube.draw(this.graphicsState, model_transform, road);
	model_transform = md_stack.pop();
}

Animation.prototype.drawTitle = function (model_transform, title)
{
	if (gamePrep == true)
	{
		md_stack.push(model_transform);
		model_transform = mult(model_transform, scale(2, 2, 2));
		model_transform = mult(model_transform, rotation(90, 0, 1, 0));
		model_transform = mult(model_transform, scale(1, 5, 10));
		model_transform = mult(model_transform, translation(-17, 1.6, 3));
		model_transform = mult(model_transform, scale(1.2, 1.2, 1.2));
		this.m_strip.draw(this.graphicsState, model_transform, title);
		model_transform = md_stack.pop();
	}
}



 Animation.prototype.lookAt = function (model_transform, time)
{
	if (gamePrep == true)
	{
		this.graphicsState.camera_transform = lookAt( vec3(60,13,50), vec3(60,13,0), vec3(0,1,0) );
	}
	if (phase1 == true && recorded1 == false)
	{
		phase1Counter = 0;
		recorded1 = true;
	}

	if (phase1 == true && recorded1 == true)
	{
		if (phase1Counter < 60*33){
			this.graphicsState.camera_transform = lookAt( vec3(-15,5,-10), vec3(char_x, char_y + 5, char_z - 10), vec3(0,1,0) );
		}
		else {
			phase1 = false;
			recorded1 = false;
			transition12 = true;

		}
		phase1Counter+=33;
	}

	if (transition12 == true && recorded12 == false)
	{
		counter12 = 0;
		recorded12 = true;
	}

	if (transition12 == true && recorded12 == true)
	{
		if (counter12 < 100*33){
			this.graphicsState.camera_transform = lookAt( vec3(-15+counter12*.1/33,5+counter12*.15/33,-10+counter12*.3/33), vec3(char_x, char_y + 5, char_z - 10), vec3(0,1,0) );
			counter12 += 33;
		}
		else {
			transition12 = false;
			phase2 = true;
			counter12 = 0;
			recorded12 = false;
		}
	}

	if (phase2 == true)
	{
		if (char_x >= 70 && !transitionBatDone) {
			transitionBat = true;
		}
		if (char_x >= 160 && !transitionDragonDone) {
			transitionDragon = true;
		}
		if (transitionBat) {
			batBattle = true;
			if (recordedTB == false) {
				counterTB = 0;
				recordedTB = true;
			}
			else {

				if (counterTB <= 100*33){
					this.graphicsState.camera_transform = lookAt( vec3(-5+char_x + counterTB*.002/3.3, 20 - counterTB*.012/3.3, 20 - counterTB*.03/3.3), vec3(char_x + counterTB*0.12/3.3, char_y + 5 + counterTB*0.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTB += 33;
				}
				else if (counterTB > 100*33 && counterTB <= 150*33){
					if (!createdA) {
						a = counterTB - 33;
						createdA = true;
					}
					this.graphicsState.camera_transform = lookAt( vec3(-5+char_x + a*.002/3.3, 20 - a*.012/3.3, 20 - a*.03/3.3), vec3(char_x + a* 0.12/3.3, char_y + 5 + a*0.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTB += 33;
				}
				else if (counterTB > 150*33 && counterTB <= (50*33+2*a)){
					var A = vec3(-5+char_x + a*.002/3.3 - (counterTB-50*33-a)*.002/3.3, 20 - a*.012/3.3 + (counterTB-50*33-a)*.012/3.3, 20 - a*.03/3.3 + (counterTB-50*33-a)*.03/3.3);
					 this.graphicsState.camera_transform = lookAt( A, vec3(char_x + a* 0.12/3.3 - (counterTB-50*33-a)*0.12/3.3, char_y + 5 + a*0.03/3.3 - (counterTB-50*33-a)*.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTB += 33;
				}
				else {
					transitionBatDone = true;
					transitionBat = false;
					counterTB = 0;
					recordedTB = false;
				}
			}
		}
		else if (transitionDragon) {
			dragonBattle = true;
			if (!recordedTD) {
				counterTD = 0;
				recordedTD = true;
			}
			else {
				if (counterTD <= 100*33){
					this.graphicsState.camera_transform = lookAt( vec3(-5+char_x + counterTD*.002/3.3, 20 - counterTD*.012/3.3, 20 - counterTD*.03/3.3), vec3(char_x + counterTD*0.12/3.3, char_y + 5 + counterTD*0.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTD += 33;
				}
				else if (counterTD > 100*33 && counterTD <= 170*33){
					if (!createdB) {
						b = counterTD - 33;
						createdB = true;
					}
					if (!dragonEntranceSoundPlayed) {
						dragonEntranceSound.play();
						dragonEntranceSoundPlayed = true;
					}

					this.graphicsState.camera_transform = lookAt( vec3(-5+char_x + b*.002/3.3, 20 - b*.012/3.3, 20 - b*.03/3.3), vec3(char_x + b* 0.12/3.3, char_y + 5 + b*0.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTD += 33;
				}
				else if (counterTD > 170*33 && counterTD <= (70*33+2*a)){
					var B = vec3(-5+char_x + b*.002/3.3 - (counterTD-70*33-b)*.002/3.3, 20 - b*.012/3.3 + (counterTD-70*33-b)*.012/3.3, 20 - b*.03/3.3 + (counterTD-70*33 - b)*0.03/3.3);
					 this.graphicsState.camera_transform = lookAt( B, vec3(char_x + b* 0.12/3.3 - (counterTD-70*33-b)*0.12/3.3, char_y + 5 + b*0.03/3.3 - (counterTD-70*33-b)*.03/3.3, char_z - 10), vec3(0,1,0) );
					counterTD += 33;
				}
				else {
					transitionDragonDone = true;
					transitionDragon = false;
					counterTD = 0;
					recordedTD = false;
				}
			}

		}
		else {
			this.graphicsState.camera_transform = lookAt( vec3(-5+char_x,20,20), vec3(char_x, char_y + 5, char_z - 10), vec3(0,1,0) );
		}

	}



}

Animation.prototype.drawDefeat = function (model_transform, defeat)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(-1.85, 0, 0, 1));
	model_transform = mult(model_transform, translation(char_x, 5 + 5, - 10));
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, scale(5, 5, 10));
	model_transform = mult(model_transform, translation(-7, 2.75, -.45));
	this.m_strip.draw(this.graphicsState, model_transform, defeat);
	model_transform = md_stack.pop();
}

Animation.prototype.drawVictory = function (model_transform, victorious)
{
	md_stack.push(model_transform);
	model_transform = mult(model_transform, rotation(-1.85, 0, 0, 1));
	model_transform = mult(model_transform, translation(char_x, 5 + 5, - 10));
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	model_transform = mult(model_transform, scale(5, 5, 10));
	model_transform = mult(model_transform, translation(-7, 2.75, -.45));
	this.m_strip.draw(this.graphicsState, model_transform, victorious);
	model_transform = md_stack.pop();
}


// *******************************************************
// display(): called once per frame, whenever OpenGL decides it's time to redraw.

Animation.prototype.display = function(time)
	{
		if(!time) time = 0;
		this.animation_delta_time = time - prev_time;
		if(animate) this.graphicsState.animation_time += this.animation_delta_time;
		prev_time = time;

		update_camera( this, this.animation_delta_time );

		this.basis_id = 0;

		var model_transform = mat4();

		// Materials: Declare new ones as needed in every function.
		// 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
		var ground = new Material( vec4( .792,.655,.282, 1), .8, .2, .2, 40 ), // Omit the final (string) parameter if you want no texture
			sky = new Material( vec4( .255, .8, 1, 1 ), .8, .2, .2, 40, "sky.png" ),
			foliage = new Material( vec4( 0,.541,.039,1 ), .2, .2, .2, 10, "green1.png"),
			trunk = new Material( vec4( .431,.329,.149,1 ), .3, .2, .2, 40),
			head = new Material( vec4( .694,.694,.694,1 ), .3, .2, .2, 40, "character1.png"),
			arm = new Material( vec4( .694,.694,.694,1 ), .3, .2, .2, 40, "arms.png"),
			torso = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "body.png"),
			leg = new Material( vec4( .694,.694,.694,1 ), .3, .2, .2, 40),
			handle = new Material( vec4( .694,.694,.694,1 ), .1, .2, .2, 40),
			blade = new Material( vec4( .694,.694,.694,1 ), .3, .2, .2, 40),
			bat = new Material( vec4( .694,.694,.694,1 ), .05, .2, .2, 40),
			eye = new Material( vec4( .694,.694,.694,1 ), .8, .2, .2, 40),
			teeth = new Material( vec4( .694,.694,.694,1 ), .9, .2, .2, 40),
			dEye = new Material( vec4( .694,.694,.694,1 ), .8, .2, .2, 40, "deye.png"),
			dBody = new Material( vec4( .694,.694,.694,1 ), .4, .2, .2, 40, "dskin.png"),
			dwing = new Material( vec4( .694,.694,.694,1 ), .4, .2, .2, 40, "dwing.png"),
			dwingin = new Material( vec4( .694,.694,.694,1 ), .4, .2, .2, 40, "dwingin.png"),
			dnostril = new Material( vec4( .694,.694,.694,1 ), .4, .2, .2, 40, "dnostril.png"),
			spike = new Material( vec4( .694,.694,.694,1 ), .05, .2, .2, 40),
			belly = new Material( vec4( .694,.694,.694,1 ), .7, .2, .2, 40, "dbelly.png"),
			neck = new Material( vec4( .694,.694,.694,1 ), .7, .2, .2, 40, "dneck.png"),
			road = new Material( vec4( .694,.694,.694,1 ), .9, .2, .2, 40),
			title = new Material( vec4( .694,.694,.694,1 ), .9, .2, .2, 40, "title.png"),
			headf = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "headf.png"),
			headl = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "headl.png"),
			headr = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "headr.png"),
			headb = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "headb.png"),
			headt = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "headt.png"),
			bodyb = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "bodyb.png"),
			bodyf = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "bodyf.png"),
			bodyl = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "bodyl.png"),
			bodyr = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "bodyr.png"),
			arms = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "arms.png"),
			armt = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "armt.png"),
			armb = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "armb.png"),
			legs = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "legs.png"),
			legb = new Material( vec4( .6,.5,.5,1 ), .2, .2, .2, 40, "legb.png"),
			blood = new Material( vec4( .8,0,0,1 ), .5, .5, .5, 40),
			fireBall = new Material( vec4( .8,0,0,0.7 ), .9, .9, .9, 40, "dfireball.png"),
			defeat = new Material( vec4( .8,0,0,0.7 ), .9, .9, .9, 40, "defeat.png"),
			victorious = new Material( vec4( .8,0,0,0.1 ), .9, .9, .9, 40, "victory.png");

		/**********************************
		Start coding here!!!!
		**********************************/

		// CONTROL TIME
			// Apparently display() is called for every frame, and animation_time gets incremented every time it is called.
		// USE A BUTTON
			// Use the button template, fill in the function call
		// CHANGE CAMERA
			// this.graphicsState.camera_transform = lookAt( vec3(0,0,0), vec3(0,0, 1), vec3(0,1,0) );
			// LookAt(eye,at,up)
		// CREATE POLYGONS
			// extend shapes.js to create new shapes
		// "REAL-TIME"
			// Not and issue really

			// TO MAKE FIREBALL!!!!!
			//gl.uniform1i( g_addrs.IS_FIRE_loc, true);

		// var md_stack = [];
		// var seconds = 1000;
		//
		// model_transform = mult( model_transform, translation( 0, 10, -15) );		// Position the next shape by post-multiplying another matrix onto the current matrix product
		// model_transform = mult( model_transform, rotation( this.graphicsState.animation_time/20, 0, 1, 0 ) );
		//
		// this.m_triangle.draw(this.graphicsState, model_transform, purplePlastic);


		if (gamePrep ) {
			themeMusic.play();
			themeMusicPlaying = true;
		}
		else if (themeMusicPlaying && victory != 2){
			themeMusic.pause();
			themeMusicPlaying = false;
			themeMusic.load();
		}

		if (!dragonIsAlive) {
			dragonBattle = false;
		}

		if (!batIsAlive) {
			batBattle = false;
		}

		if (batBattle && !dragonBattle && victory == 1) {
			batbattle.play();
			batbattleMusicPlaying = true;
		}
		else if (transitionBatDone && batbattleMusicPlaying){
			batbattle.pause();
			batbattleMusicPlaying = false;
		}

		if (dragonBattle ) {
			dragonbattle.play();
			dragonbattleMusicPlaying = true;
		}
		else if (transitionDragonDone && dragonbattleMusicPlaying){
			dragonbattle.pause();
			batbattleMusicPlaying = false;
			batbattle.pause();
			batbattleMusicPlaying = false;
			themeMusic.play();
			themeMusicPlaying = true;
			victory = 2;
		}

		if (!batBattle && !dragonBattle && !themeMusicPlaying) {
			roadMusic.play();
			roadMusicPlaying = true;
		}
		else if (roadMusicPlaying) {
			roadMusic.pause();
			roadMusic.load();
			roadMusicPlaying = false;
		}



		if (walking) {
			walkingSound.play();
			//hitNothingSound.play();
			//boing.play();
		}

		if (attacked && batIsAlive) {
			hitBatSound.play();
			batEntranceSound.play();
		}
		else if (attackedD && dragonIsAlive) {
			hitDragonSound.play();
			dragonHitSound.play();
		}
		else if (attack)
		{
			hitNothingSound.play();
		}

		if (batHP == 0) {
			batDieSound.play();
			batHP--;
		}

		if (dragonHP == 0) {
			dragonDieSound.play();
			dragonHP--;
		}





		// var phase1 = false; // from title to roadview
		//
		// var transition12 = false;
		//
		// var phase2 = false; // from roadview to 3/4 view
		//
		// var transitionBat = false;
		// var transitionBatDone = false;
		// var transitionDragon = false;
		// var transitionDragonDone = false;
		// var victory = 1; // 1-game in process, 0-defeat, 2-victory

		model_transform = mult(model_transform, translation(0, 4, 0));
		// this.m_flake.draw(this.graphicsState, model_transform, blade);
		model_transform = mult(model_transform, translation(0, -4, 0));

		model_transform = mult(model_transform, translation(0, 0, -10)); // do not touch
		//CURRENT_BASIS_IS_WORTH_SHOWING(this, model_transform);





		if (charHP <= 0) {
			charIsAlive = false;
		}
		if (!dragonIsAlive) {
			victory = 2;
			phase2 = false;
		}
		else if (!charIsAlive) {
			victory = 0;
		}

		// several states:
			// gameBegin (after title page)
			// choose charater (gameBegin & !questBegin)
			// questBegin (after transitionA)



		// draw the sky
			this.drawSky(model_transform, sky);



		// draw the ground
			// permanent drawing
			this.drawGround( model_transform, ground );

		// draw the trees
			// permanent drawing
				this.drawAllTrees(model_transform, foliage, trunk);
				// this.drawNineTrees(model_transform, foliage, trunk);


		// character
		// 	draw only when gameBegin = true
		// 	position
			this.drawCharacter(model_transform, head, arm, torso, leg, handle, blade,
				headf, headl, headr, headb, headt,
				bodyb, bodyf, bodyl, bodyr,
				arms, armt, armb, legs, legb);




		// evil bat
			// if questBegin = true
				// if hit = true
					// don't draw
					// when time passed
						// hit = false
				// else
					// draw evil bat

				if (phase2) {
					if (batIsAlive) {
						md_stack.push(model_transform);
						model_transform = mult(model_transform, translation(80, 5, 0));
						model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
						this.drawEvilBat(model_transform, bat, eye, blood);
						model_transform = md_stack.pop();
					}
				}


		// draw the dragon
			// draw only when batIsAlive = false
			if (phase2) {
				if (dragonIsAlive) {
					md_stack.push(model_transform);
					model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
					model_transform = mult(model_transform, translation(-20, 0, -200));
		 this.drawDragon (model_transform, teeth, dEye, dBody, spike, belly, dwing, dwingin, neck, dnostril, fireBall);
					model_transform = md_stack.pop();
				}
			}


		// draw the road
		this.drawRoad (model_transform, road);
		// draw the title
			// draw only when gameBegin = false
				this.drawTitle(model_transform, title);

				if (victory == 0) {
					this.drawDefeat(model_transform, defeat);
				}
				else if (victory == 2) {
					this.drawVictory(model_transform, victorious);
				}


		// Lookat()

		this.lookAt(model_transform, this.graphicsState.animation_time);



		//this.graphicsState.camera_transform = lookAt( vec3(0,50,0), vec3(0,0, 0), vec3(1,0,0) );
			// if questBegin = false
					// Lookat Title place
			// if questBegin = true
					// if transitionA = true
							// shift at once to character viewpoint, pause, then MOVE to 3/4
							// set transitionA = false
					// if transitionB = true
							// MOVE to character viewpoint, pause, then MOVE to 3/4
					// if transitionC = true
							// MOVE to character viewpoint
					// else
							// Follow the character 3/4
		//








	}



Animation.prototype.update_strings = function( debug_screen_strings )		// Strings this particular class contributes to the UI
{
	debug_screen_strings.string_map["time"] = "Animation Time: " + this.graphicsState.animation_time/1000 + "s";
	debug_screen_strings.string_map["basis"] = "Showing basis: " + this.m_axis.basis_selection;
	debug_screen_strings.string_map["animate"] = "Animation " + (animate ? "on" : "off") ;
	debug_screen_strings.string_map["thrust"] = "Thrust: " + thrust;
}
