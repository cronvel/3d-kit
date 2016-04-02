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



//var tdk = require( './tdk.js' ) ;
var fs = require( 'fs' ) ;



function Material( params )
{
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
			emissive: { type: 'c', value: new THREE.Color( 0x000000 ) }
		}
	] ) ;
	
	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new THREE.ShaderMaterial( {
		//name: "TerrainShader",
		defines: defines,
		uniforms: shaderUniforms,
		vertexShader: params.vertexShader || THREE.ShaderLib.lambert.vertexShader ,
		fragmentShader: params.fragmentShader || THREE.ShaderLib.lambert.fragmentShader ,
		side: params.side || THREE.DoubleSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
}

module.exports = Material ;



// Lambert material, but light is computed on the fragment part: better precision on low-poly, at the cost of more GPU usage
Material.LambertPlusPlus = function MaterialLambertPlusPlus( params )
{
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
			emissive: { type: 'c', value: new THREE.Color( 0x000000 ) }
		}
	] ) ;
	
	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new THREE.ShaderMaterial( {
		//name: "LambertPlusPlusShader",
		defines: defines,
		uniforms: shaderUniforms,
		vertexShader: fs.readFileSync( __dirname + '/shaders/lambert++.vertex.glsl' , 'utf8' ) ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/lambert++.fragment.glsl' , 'utf8' ) ,
		side: params.side || THREE.FrontSide ,
		fog: params.fog || false,
		lights: params.lights || true
	} ) ;
	
	return material ;
} ;



Material.Cel = function MaterialCel( params )
{
	var i , iMax , steps ;
	
	if ( ! params || typeof params !== 'object' ) { params = {} ; }
	
	if ( Array.isArray( params.steps ) )
	{
		for ( i = 0 , iMax = Math.max( 5 , params.steps.length ) ; i < iMax ; i ++ )
		{
			steps.push( new THREE.Vector3(
				params.steps[ i ].lte ,
				params.steps[ i ].mix ,
				params.steps[ i ].of
			) ) ;
		}
		
		for ( ; i < 5 ; i ++ )
		{
			steps.push( new THREE.Vector3( 1 , 0 , 0 ) ) ;
		}
	}
	else
	{
		steps = [
			new THREE.Vector3( 0.5 , 0.5 , 0 ) ,
			new THREE.Vector3( 0.75 , 0.3 , 0 ) ,
			new THREE.Vector3( 2 , 0 , 0 ) ,
			new THREE.Vector3( 1000 , 0.15 , 1.0 ) ,
			new THREE.Vector3( 1000 , 0.15 , 1.0 )
		] ;
	}
	
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
			emissive: { type: 'c', value: new THREE.Color( 0x000000 ) } ,
			celStep: { type: 'v3v', value: steps } // Vector3 array
		}
	] ) ;
	
	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new THREE.ShaderMaterial( {
		//name: "CelShader",
		defines: defines,
		uniforms: shaderUniforms,
		//vertexShader: THREE.ShaderLib.lambert.vertexShader ,
		vertexShader: fs.readFileSync( __dirname + '/shaders/cel.vertex.glsl' , 'utf8' ) ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/cel.fragment.glsl' , 'utf8' ) ,
		side: params.side || THREE.FrontSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
} ;



Material.Cel2 = function MaterialCel( params )
{
	var i , iMax , steps ;
	
	if ( ! params || typeof params !== 'object' ) { params = {} ; }
	
	if ( Array.isArray( params.steps ) )
	{
		/*
		for ( i = 0 , iMax = Math.max( 3 , params.steps.length ) ; i < iMax ; i ++ )
		{
			steps.push( new THREE.Vector3(
				params.steps[ i ].lte ,
				params.steps[ i ].mix ,
				params.steps[ i ].of
			) ) ;
		}
		
		for ( ; i < 3 ; i ++ )
		{
			steps.push( new THREE.Vector3( 1 , 0 , 0 ) ) ;
		}
		*/
	}
	else
	{
		steps = [
			new THREE.Vector3( 0.5 , 0.5 , 0 ) ,
			new THREE.Vector3( 0.75 , 0.3 , 0 ) ,
			new THREE.Vector3( 2 , 0 , 0 )
		] ;
	}
	
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
			emissive: { type: 'c', value: new THREE.Color( 0x000000 ) } ,
			celStep: { type: 'v3v', value: steps } // Vector3 array
		}
	] ) ;
	
	var shaderUniforms = THREE.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		//defines.PHYSICALLY_CORRECT_LIGHTS = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new THREE.ShaderMaterial( {
		//name: "CelShader",
		defines: defines,
		uniforms: shaderUniforms,
		//vertexShader: THREE.ShaderLib.lambert.vertexShader ,
		vertexShader: fs.readFileSync( __dirname + '/shaders/cel2.vertex.glsl' , 'utf8' ) ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/cel2.fragment.glsl' , 'utf8' ) ,
		side: params.side || THREE.FrontSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
} ;


