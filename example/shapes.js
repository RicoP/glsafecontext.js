/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   Class: VertexBasedShape
   The shape holds an array of vertices, and knows how to 
   draw itself using WebGL.
    
    Parameters to the constructor:
    - program is the Program that these buffer objects shall be bound to  
    - primitiveType is the geometric primitive to be used for drawing,
      e.g. gl.TRIANGLES, gl.LINES, gl.POINTS, gl.TRIANGLE_STRIP, 
            gl.TRIANGLE_FAN
    - numVertices is the number of vertices this object consists of
*/ 


VertexBasedShape = function(gl, primitiveType, numVertices) {
	    
    
    // transformation applied to the entire object 
    this.modelTranslation = mat4.identity();

    // arrays in which to store vertex buffers and the respective 
    this.vertexBuffers = new Array();
    
    // remember what goemtric primitive to use for drawing
    this.primitiveType = primitiveType;
    
    // remember how many vertices this shape has
    this.numVertices = numVertices;
    
    // add a vertex attribute to the shape
    this.addVertexAttribute = function(gl, attrType, dataType, 
                                        numElements,dataArray) {
        this.vertexBuffers[attrType] = new VertexAttributeBuffer(gl,
                                            attrType, dataType,
                                            numElements,dataArray);
        var n = this.vertexBuffers[attrType].numVertices;
        if(this.numVertices != n) {
            window.console.log("Warning: wrong number of vertices (" 
                                + n + " instead of " + this.numVertices 
                                + ") for attribute " + attrType);
        }
    }
    
    /* 
       Method: draw using a vertex buffer object
    */
    this.draw = function(program) {
    
        // go through all types of vertex attributes 
        // and enable them before drawing
        for(attribute in this.vertexBuffers) {
            //window.console.log("activating attribute: " + attribute);
            this.vertexBuffers[attribute].makeActive(program);
        }
        
        // perform the actual drawing of the primitive 
        // using the vertex buffer object
        program.gl.drawArrays(primitiveType, 0, this.numVertices);

    }
    
    /*
     * Method: set uniform variable to transformation matrix values of this object
     */
    this.setUniforms = function(program){
    	var matrixLocation = gl.getUniformLocation(program.glProgram, "modelTranslation");
    	gl.uniformMatrix4fv(matrixLocation, false, this.modelTranslation);
    }
    
}
/*

 Class:  Triangle
 The triangle consists of three vertices.

 Parameters to the constructor:
 - program is a Program object that knows which vertex attributes
 are expected by its shaders

 */
Triangle = function(gl) {

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 3);

	var vposition = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
	var vcolor = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
	this.shape.addVertexAttribute(gl, "vertexColor", gl.FLOAT, 3, vcolor);

}
/*

 Class:  TriangleFan
 A little fan around a center vertex.

 Parameters to the constructor:
 - program is a Program object that knows which vertex attributes
 are expected by its shaders

 */
TriangleFan = function(gl) {

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLE_FAN, 9);

	var vposition = new Float32Array([0, 0, 1, 0, 1, 0, -0.7, 0.7, 0, -1, 0, 0, -0.7, -0.7, 0, 0, -1, 0, 0.7, -0.7, 0, 1.0, 0, 0, 0.7, 0.7, 0]);
	var vcolor = new Float32Array([1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0]);
	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
	this.shape.addVertexAttribute(gl, "vertexColor", gl.FLOAT, 3, vcolor);

}
/*

 Class:  Cube
 A little cube around the zero point.

 Parameters to the constructor:
 - program is a Program object that knows which vertex attributes
 are expected by its shaders

 */
Cube = function(gl, size) {
	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 36);

	var s = size || 1.0;

	var vposition = new Float32Array([-s, -s, s, s, s, s, -s, s, s, // a
	-s, -s, s, s, -s, s, s, s, s, // b
	s, -s, s, s, -s, -s, s, s, s, // c
	s, -s, -s, s, s, -s, s, s, s, // d
	s, s, s, s, s, -s, -s, s, -s, // e
	-s, s, -s, -s, s, s, s, s, s, // f
	-s, s, s, -s, -s, s, -s, -s, -s, // g
	-s, s, s, -s, -s, -s, -s, s, -s, // h
	-s, s, -s, -s, -s, -s, s, -s, -s, // i
	s, -s, -s, s, s, -s, -s, s, -s, // j
	-s, -s, -s, -s, -s, s, s, -s, s, // k
	s, -s, s, s, -s, -s, -s, -s, -s // l
	]);

	var a = 1, b = 0, c = 0.5;

	var vcolor = new Float32Array([a, a, a, a, a, a, a, a, a, a, a, b, a, a, b, a, a, b, a, b, a, a, b, a, a, b, a, a, b, b, a, b, b, a, b, b, b, a, a, b, a, a, b, a, a, b, a, b, b, a, b, b, a, b, b, b, a, b, b, a, b, b, a, a, a, c, a, a, c, a, a, c, a, c, a, a, c, a, a, c, a, a, c, c, a, c, c, a, c, c, c, a, a, c, a, a, c, a, a, c, a, c, c, a, c, c, a, c]);
	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
	this.shape.addVertexAttribute(gl, "vertexColor", gl.FLOAT, 3, vcolor);
}
/*

 Class:  Sphere
 A little sphere around the zero point.

 Parameters to the constructor:
 - program is a Program object that knows which vertex attributes
 are expected by its shaders

 */
Sphere = function(gl, size) {
	var vertices = getSphereVertices();
	var indices = getSphereIndices();

	var vposition = makeFlatWithSubdivision(vertices, indices, 3);

	var s = size || 1.0;

	if(s !== 1.0) {
		for(var i = 0; i != vposition.length; i++) {
			vposition[i] = s * vposition[i];
		}
	}

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);
	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}
Torus = function(gl, torusRadius, radius, sides, rings) {
	var vertices = getTorusVertices(8, 25);

	var vposition = new Float32Array(vertices);

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.QUAD_STRIP, vposition.length / 2);

	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 2, vposition);
}
MyTorus = function(gl, R, r, N, M, color1, color2, texture) {
	var vertices = [];
	var colors = [];
	var u, v;
	var x1, x2, x3, y1, y2, y3, z1, z2, z3;

	for(var i = 1; i <= N; i++) {
		for(var j = 1; j <= M; j++) {

			// calculate u and v ( Danke an Richard für den Tip)
			u1 = Math.PI * 2 / N * i;
			v1 = Math.PI * 2 / M * j;
			u2 = Math.PI * 2 / N * (i - 1);
			v2 = Math.PI * 2 / M * (j - 1);

			// 2 triangles are made up of 4 points
			// x coordinates
			x1 = (R + r * Math.cos(u1)) * Math.cos(v1);
			x2 = (R + r * Math.cos(u1)) * Math.cos(v2);
			x3 = (R + r * Math.cos(u2)) * Math.cos(v1);
			x4 = (R + r * Math.cos(u2)) * Math.cos(v2);

			// y coordinates
			y1 = (R + r * Math.cos(u1)) * Math.sin(v1);
			y2 = (R + r * Math.cos(u1)) * Math.sin(v2);
			y3 = (R + r * Math.cos(u2)) * Math.sin(v1);
			y4 = (R + r * Math.cos(u2)) * Math.sin(v2);

			// z coordinates
			z1 = r * Math.sin(u1);
			z2 = r * Math.sin(u1);
			z3 = r * Math.sin(u2);
			z4 = r * Math.sin(u2);

			vertices.push(x4, y4, z4, x2, y2, z2, x1, y1, z1, x4, y4, z4, x3, y3, z3, x1, y1, z1);
			if(texture === 0){
				for(var k = 0; k < 6; k++) {
					if(i % 2 + j % 2 == 1) {
						colors.push(color1[0]);
						colors.push(color1[1]);
						colors.push(color1[2]);
					} else {
						colors.push(color2[0]);
						colors.push(color2[1]);
						colors.push(color2[2]);
					}
				}
			} else {
				for(var k = 0; k < 6; k++) {
					if(i % 2 == 0) {
						colors.push(color1[0]);
						colors.push(color1[1]);
						colors.push(color1[2]);
					} else {
						colors.push(color2[0]);
						colors.push(color2[1]);
						colors.push(color2[2]);
					}
				}
			}
		}
	}
	var vposition = new Float32Array(vertices);
	var vcolor = new Float32Array(colors);

	window.console.log("vposition lenght:" + vposition.length);
	window.console.log("vcolor lenght:" + vcolor.length);

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);
	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
	this.shape.addVertexAttribute(gl, "vertexColor", gl.FLOAT, 3, vcolor);
}
UglyTorus = function(gl, torusRadius, radius, sides, rings) {
	var a = CSG.sphere({
		radius : 1.35,
		stacks : 32,
		slices : 32
	});
	var b = CSG.cube({
		center : [-2.2, 0, 0],
		radius : 2
	});
	var c = CSG.cube({
		center : [2.2, 0, 0],
		radius : 2
	});
	var d = CSG.cylinder({
		start : [-1, 0, 0],
		end : [1, 0, 0],
	});
	var form = a.subtract(b).subtract(c).subtract(d);
	var list = [];

	addPolygonsToList(list, form.polygons);

	var vposition = new Float32Array(list);

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);

	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}
CSGConstructor = function(gl, csg) {"use strict";

	var list = [];

	addPolygonsToList(list, csg.polygons);

	var vposition = new Float32Array(list);

	// instantiate the shape as a member variable
	this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);

	this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}
function addPolygonsToList(list, p) {
	for(var i = 0; i != p.length; i++) {
		var vertices = p[i].vertices;
		addVerticesToList(list, vertices);
	}
}

function addVerticesToList(list, vertices, endpoint) {
	if(!endpoint) {
		return addVerticesToList(list, vertices, vertices.length - 1);
	}

	//CSG Polygon ist Konvex und Koplanar. d. h. man kann die
	//Eckpunkte ganz einfach paarweise zuordnen.
	pushVerticePosition(list, vertices[0].pos);
	pushVerticePosition(list, vertices[endpoint - 1].pos);
	pushVerticePosition(list, vertices[endpoint].pos);

	if(endpoint > 2) {
		addVerticesToList(list, vertices, endpoint - 1);
	}
}

function pushVerticePosition(list, v) {
	list.push(v.x, v.y, v.z);
}

function getTorusVertices(numc, numt) {"use strict";

	var i, j, k, s, t, x, y, z, twopi, list;
	list = [];
	twopi = 2 * Math.PI;
	for( i = 0; i < numc; i++) {
		//glBegin(QUAD_STRIP);
		for( j = 0; j <= numt; j++) {
			for( k = 1; k >= 0; k--) {
				s = (i + k) % numc + 0.5;
				t = j % numt;
				x = (1 + 0.1 * Math.cos(s * twopi / numc)) * Math.cos(t * twopi / numt);
				y = (1 + 0.1 * Math.cos(s * twopi / numc)) * Math.sin(t * twopi / numt);
				z = 0.1 * Math.sin(s * twopi / numc);
				list.push(x, y, z);
			}
		}
		//glEnd();
	}

	return new Float32Array(list);
}

function getSphereVertices() {
	var X = 0.525731112119133606;
	var Z = 0.850650808352039932;

	var v = [[-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z], [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X], [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0]]

	return v;
}

function getSphereIndices() {
	var i = [[0, 4, 1], [0, 9, 4], [9, 5, 4], [4, 5, 8], [4, 8, 1], [8, 10, 1], [8, 3, 10], [5, 3, 8], [5, 2, 3], [2, 7, 3], [7, 10, 3], [7, 6, 10], [7, 11, 6], [11, 0, 6], [0, 1, 6], [6, 1, 10], [9, 0, 11], [9, 11, 2], [9, 2, 5], [7, 2, 11]];

	return i;
}

function makeFlatWithSubdivision(vertices, indeces, level) {
	var list = [];

	for(var i = 0; i != indeces.length; i++) {
		var indece = indeces[i];
		var v1, v2, v3;
		v1 = vertices[indece[0]];
		v2 = vertices[indece[1]];
		v3 = vertices[indece[2]];

		if(level === 0) {
			pushTriangle(list, v1, v2, v3);
		} else {
			subdivide(list, v1, v2, v3, level - 1);
		}
	}

	return new Float32Array(list);
}

function subdivide(list, v1, v2, v3, level) {
	var v12, v23, v31;
	v12 = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
	normalize(v12);
	v23 = [v2[0] + v3[0], v2[1] + v3[1], v2[2] + v3[2]];
	normalize(v23);
	v31 = [v3[0] + v1[0], v3[1] + v1[1], v3[2] + v1[2]];
	normalize(v31);

	if(level === 0) {
		pushTriangle(list, v1, v12, v31);
		pushTriangle(list, v2, v23, v12);
		pushTriangle(list, v3, v31, v23);
		pushTriangle(list, v12, v23, v31);
	} else {
		subdivide(list, v1, v12, v31, level - 1);
		subdivide(list, v2, v23, v12, level - 1);
		subdivide(list, v3, v31, v23, level - 1);
		subdivide(list, v12, v23, v31, level - 1);
	}

}

function normalize(v) {
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

	v[0] = v[0] / l;
	v[1] = v[1] / l;
	v[2] = v[2] / l;
}

function makeFlat(vertices, indeces) {
	var list = [];

	for(var i = 0; i != indeces.length; i++) {
		var indece = indeces[i];
		var v1, v2, v3;
		v1 = vertices[indece[0]];
		v2 = vertices[indece[1]];
		v3 = vertices[indece[2]];

		pushTriangle(list, v1, v2, v3);
	}

	return new Float32Array(list);
}

function pushQuadAsTriangles(list, a, b) {
	//	a---c
	//	|  /|
	//	| / |
	//	|/  |
	//	d---b
	//Angenommen a.z == b.z
	var c, d;
	c = [b[0], a[1], a[2]];
	d = [a[0], b[1], b[2]];

	pushTriangle(list, a, d, c);
	pushTriangle(list, c, d, b);
}

function pushTriangle(list, v1, v2, v3) {
	pushVertex(list, v1);
	pushVertex(list, v2);
	pushVertex(list, v3);
}

function pushVertex(list, v) {
	list.push(v[0], v[1], v[2]);
}