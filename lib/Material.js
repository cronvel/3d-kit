/*
	The Cedric's Swiss Knife (CSK) - CSK 3D toolbox

	Copyright (c) 2015 - 2016 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;

/* global THREE */



//const tdk = require( './tdk.js' ) ;
const fs = require( 'fs' ) ;
const RAD_TO_DEG = 360 / ( 2 * Math.PI ) ;



function Material( params ) {
	if ( ! params || typeof params !== 'object' ) { params = {} ; }

	// Lambert material replication, hard to figure out, see:
	// http://stackoverflow.com/questions/21928178/replicating-meshlambertmaterial-using-shadermaterial-ignores-textures

	// "Defines" are preprocessor define
	var defines = {} ;

	/*
		* Uniforms are variables that have the same value for all vertices---lighting, fog, and shadow maps are examples of data
			that would be stored in uniforms. Uniforms can be accessed by both the vertex shader and the fragment shader.
		* Attributes are variables associated with each vertex---for instance, the vertex position, face normal,
			and vertex color are all examples of data that would be stored in attributes. Attributes can only be accessed
			within the vertex shader.
		* Varyings are variables that are passed from the vertex shader to the fragment shader. For each fragment,
			the value of each varying will be smoothly interpolated from the values of adjacent vertices.
	*/

	// uniforms from Lambert material as of THREE r75
	var uniforms = THREE.UniformsUtils.merge( [
		THREE.UniformsLib.common ,
		THREE.UniformsLib.aomap ,
		THREE.UniformsLib.lightmap ,
		THREE.UniformsLib.emissivemap ,
		THREE.UniformsLib.fog ,
		THREE.UniformsLib.lights ,
		{
			emissive: { type: 'c' , value: new THREE.Color( 0x000000 ) }
		}
	] ) ;

	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;

	if ( params.map ) {
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}

	var material = new THREE.ShaderMaterial( {
		//name: "TerrainShader",
		defines: defines ,
		uniforms: shaderUniforms ,
		vertexShader: params.vertexShader || THREE.ShaderLib.lambert.vertexShader ,
		fragmentShader: params.fragmentShader || THREE.ShaderLib.lambert.fragmentShader ,
		side: params.side || THREE.DoubleSide ,
		fog: params.fog || false ,
		lights: params.lights || false
	} ) ;

	return material ;
}

module.exports = Material ;



// Lambert material, but light is computed on the fragment part: better precision on low-poly, at the cost of more GPU usage
Material.LambertPlusPlus = function MaterialLambertPlusPlus( params ) {
	var i , iMax , steps ;

	if ( ! params || typeof params !== 'object' ) { params = {} ; }

	// "Defines" are preprocessor define
	var defines = {} ;

	// uniforms from Lambert material as of THREE r75
	var uniforms = THREE.UniformsUtils.merge( [
		THREE.UniformsLib.common ,
		THREE.UniformsLib.aomap ,
		THREE.UniformsLib.lightmap ,
		THREE.UniformsLib.emissivemap ,
		THREE.UniformsLib.fog ,
		THREE.UniformsLib.lights ,
		{
			emissive: { type: 'c' , value: new THREE.Color( 0x000000 ) }
		}
	] ) ;

	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;

	if ( params.map ) {
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}

	var material = new THREE.ShaderMaterial( {
		//name: "LambertPlusPlusShader",
		defines: defines ,
		uniforms: shaderUniforms ,
		vertexShader: fs.readFileSync( __dirname + '/shaders/lambert++.vertex.glsl' , 'utf8' ) ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/lambert++.fragment.glsl' , 'utf8' ) ,
		side: params.side || THREE.FrontSide ,
		fog: params.fog || false ,
		lights: params.lights || true
	} ) ;

	return material ;
} ;



/*
	* params `object`, where:
		* map `Texture` (optional) diffuse map
		* diffuse `object` (optional) describing the cel-shading step for the diffuse shading:
			* lowAngle `number` (default to 60) the angle in degree for the low to middle step
			* highAngle `number` (default to 30) the angle in degree for the middle to high step
		* specular `object` (optional) if defined the material has a specular halo:
			* intensity `number` (default to 1) the intensity of the specular halo
			* angle `number` (default to 20) the angle in degree of the specular halo
		* side
		* fog
		* lights
*/
Material.Cel = function MaterialCel( params ) {
	var i , iMax , steps ;

	if ( ! params || typeof params !== 'object' ) { params = {} ; }

	// "Defines" are preprocessor define
	var defines = {} ;


	// Diffuse Cel-shading step effect
	// We use defines instead of uniforms: better perf
	// Important: define number as string using .toFixed(), because GLSL expect float, and if a number has no frac-part like 2,
	// the regular string coercion will print "2" instead of "2.0", and GLSL will think it's an integer
	if ( ! params.diffuse || typeof params.diffuse === 'object' ) { params.diffuse = {} ; }

	defines.DIFFUSE_LOW_THRESHOLD = Math.cos( ( params.diffuse.lowAngle || 60 ) / RAD_TO_DEG ) ;
	defines.DIFFUSE_HIGH_THRESHOLD = Math.cos( ( params.diffuse.highAngle || 30 ) / RAD_TO_DEG ) ;

	defines.DIFFUSE_LOW_INTENSITY = ( defines.DIFFUSE_LOW_THRESHOLD / 2 ).toFixed( 5 ) ;
	defines.DIFFUSE_MIDDLE_INTENSITY = ( ( defines.DIFFUSE_LOW_THRESHOLD + defines.DIFFUSE_HIGH_THRESHOLD ) / 2 ).toFixed( 5 ) ;
	defines.DIFFUSE_HIGH_INTENSITY = ( ( 1 + defines.DIFFUSE_HIGH_THRESHOLD ) / 2 ).toFixed( 5 ) ;

	defines.DIFFUSE_LOW_THRESHOLD = defines.DIFFUSE_LOW_THRESHOLD.toFixed( 5 ) ;
	defines.DIFFUSE_HIGH_THRESHOLD = defines.DIFFUSE_HIGH_THRESHOLD.toFixed( 5 ) ;


	// Specular Cel-shading step effect
	if ( params.specular && typeof params.specular === 'object' ) {
		defines.SPECULAR_INTENSITY = ( params.specular.intensity || 1 ).toFixed( 5 ) ;
		defines.SPECULAR_THRESHOLD = ( Math.cos( ( params.specular.angle || 20 ) / RAD_TO_DEG ) ).toFixed( 5 ) ;
	}


	// uniforms from Lambert material as of THREE r75
	var uniforms = THREE.UniformsUtils.merge( [
		THREE.UniformsLib.common ,
		THREE.UniformsLib.aomap ,
		THREE.UniformsLib.lightmap ,
		THREE.UniformsLib.emissivemap ,
		THREE.UniformsLib.fog ,
		THREE.UniformsLib.lights ,
		{
			emissive: { type: 'c' , value: new THREE.Color( 0x000000 ) }
		}
	] ) ;

	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;

	if ( params.map ) {
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}

	var material = new THREE.ShaderMaterial( {
		//name: "CelShader",
		defines: defines ,
		uniforms: shaderUniforms ,
		vertexShader: fs.readFileSync( __dirname + '/shaders/cel.vertex.glsl' , 'utf8' ) ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/cel.fragment.glsl' , 'utf8' ) ,
		side: params.side || THREE.FrontSide ,
		fog: params.fog || false ,
		lights: params.lights || false
	} ) ;

	return material ;
} ;


