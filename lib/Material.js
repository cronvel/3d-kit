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
var three = require( 'three' ) ;



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
	var uniforms = three.UniformsUtils.merge( [
		three.UniformsLib.common ,
		three.UniformsLib.aomap ,
		three.UniformsLib.lightmap ,
		three.UniformsLib.emissivemap ,
		three.UniformsLib.fog ,
		three.UniformsLib.lights ,
		{
			emissive: { type: 'c', value: new three.Color( 0x000000 ) }
		}
	] ) ;
	
	var shaderUniforms = three.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new three.ShaderMaterial( {
		//name: "TerrainShader",
		defines: defines,
		uniforms: shaderUniforms,
		vertexShader: params.vertexShader || three.ShaderLib.lambert.vertexShader ,
		fragmentShader: params.fragmentShader || three.ShaderLib.lambert.fragmentShader ,
		side: params.side || three.DoubleSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
}

module.exports = Material ;



Material.Cel = function MaterialCel( params )
{
	var i , iMax , steps ;
	
	if ( ! params || typeof params !== 'object' ) { params = {} ; }
	
	// Lambert material replication, hard to figure out, see:
	// http://stackoverflow.com/questions/21928178/replicating-meshlambertmaterial-using-shadermaterial-ignores-textures
	
	if ( Array.isArray( params.steps ) )
	{
		for ( i = 0 , iMax = Math.max( 5 , params.steps.length ) ; i < iMax ; i ++ )
		{
			steps.push( new THREE.Vector2( params.steps[ i ].lte , params.steps[ i ].value ) ) ;
		}
		
		for ( ; i < 5 ; i ++ )
		{
			steps.push( new THREE.Vector2( 1 , 1 ) ) ;
		}
	}
	else
	{
		steps = [
			new THREE.Vector2( 0.5 , 0.5 ) ,
			new THREE.Vector2( 0.75 , 0.7 ) ,
			new THREE.Vector2( 1 , 1 ) ,
			new THREE.Vector2( 1 , 1 ) ,
			new THREE.Vector2( 1 , 1 )
		] ;
	}
	
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
	var uniforms = three.UniformsUtils.merge( [
		three.UniformsLib.common ,
		three.UniformsLib.aomap ,
		three.UniformsLib.lightmap ,
		three.UniformsLib.emissivemap ,
		three.UniformsLib.fog ,
		three.UniformsLib.lights ,
		{
			emissive: { type: 'c', value: new three.Color( 0x000000 ) } ,
			celStep: { type: 'v2v', value: steps } // Vector2 array
		}
	] ) ;
	
	var shaderUniforms = three.UniformsUtils.clone( uniforms ) ;
	
	if ( params.map )
	{
		defines.USE_MAP = '' ;
		shaderUniforms.map.value = params.map ;
		shaderUniforms.offsetRepeat.value.set( 0 , 0 , params.map.repeat.x , params.map.repeat.y ) ;
	}
	
	var material = new three.ShaderMaterial( {
		//name: "TerrainShader",
		defines: defines,
		uniforms: shaderUniforms,
		vertexShader: three.ShaderLib.lambert.vertexShader ,
		fragmentShader: fs.readFileSync( __dirname + '/shaders/cel.fragment.glsl' , 'utf8' ) ,
		side: params.side || three.DoubleSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
} ;


