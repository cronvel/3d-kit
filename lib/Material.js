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
		name: "TerrainShader",
		defines: defines,
		uniforms: shaderUniforms,
		vertexShader: three.ShaderLib.lambert.vertexShader ,
		fragmentShader: params.fragmentShader || three.ShaderLib.lambert.fragmentShader ,
		side: params.side || three.DoubleSide ,
		fog: params.fog || false,
		lights: params.lights || false
	} ) ;
	
	return material ;
}

module.exports = Material ;


