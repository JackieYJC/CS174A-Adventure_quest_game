# ADVENTURE QUEST
Designed and coded by Jiachen Yang 104641376 in UCLA CS174A Intro to Computer Graphics, using OpenGL and Javascript

(To run this game, open the index.html in sample_project and follow the instruction at the bottom of the screen)

Here are some course required descriptions:

-Hierarchical Design: this program uses hierarchical design to draw its object. For instance, to draw the dragon, it first draw its feet, then move upward to draw its body, head and wings. The hierarchy could be seen by the various functions defined outside of display() to be called to draw objects. 

-Polygonal: this program extends the shape class and draw a flat-shaded shape called "flake", which is a polygon that looks likea triangular platform, with its upper and lower surface being triangles, and its three sides being rectangles. It is the building block of the dragon's head, horns, and wings. 

-Texture: texture is extensively used in this program. The character's whole body is textured by pressing triangular strips onto its body. The dragon's belly and eyes is also textured this way. However, the tree's texture could only be seen using safari under OSX. I have not yet been able to solve that issue, but I guess it won't influence the grading or quality of the game. I suggest using firefox/safari to run this game. 

-Other:
I used lookAt() in creating all the scenes in the game.
I used real-time speed.
I used Phong shading in the program.
I displayed frame rate on the screen.
I created a story (a worrior going on a quest of killing dragon) using animation
Several complexity points:
	I created various gaming and scene-changing mechanisms.
	I imbedded various sound effects and background music.
	I used shader particle to create the effect of the dragon's fireball.
	I used a sphere to create the sky of the game, so it could be textured in gradients.
I paid a looot of attention to gamer experience. 

