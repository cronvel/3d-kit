// Lambert fragment as of THREE r75

// /!\ This shader works, but a lot of unecessary operations from the original Lambert fragment should be removed

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

// The material has at most 3 shades
uniform vec3 celStep[3];

// cel.vertex.glsl transmit that to us:
varying vec3 vViewPosition;
varying vec3 vNormal;


// /!\ Should be removed, but it is still used somewhere
varying vec3 vLightFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
#endif



#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>

	// accumulation
	reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );

	#include <lightmap_fragment>

	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );

	#ifdef DOUBLE_SIDED

		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;

	#else

		reflectedLight.directDiffuse = vLightFront;

	#endif

	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <envmap_fragment>

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	
	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	
	// Start of mod--------------------
	
	// This whole part is taken from lights_lambert_vertex.glsl, now light is computed on the fragment to gain precisions
	
	GeometricContext geometry;
	geometry.position = vViewPosition;
	geometry.normal = vNormal;
	
	GeometricContext backGeometry;
	backGeometry.position = geometry.position;
	backGeometry.normal = -geometry.normal;
	
	IncidentLight directLight;
	float dotNL;
	vec3 directLightColor_Diffuse;
	
	vec3 vLightFront_cel = vec3( 0.0 ) ;
	vec3 vLightBack_cel = vec3( 0.0 ) ;
	
	#if NUM_POINT_LIGHTS > 0
		for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
			directLight = getPointDirectLightIrradiance( pointLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			//*
			if ( dotNL >= 0.8 ) { dotNL = 0.9 ; }
			else if ( dotNL >= 0.3 ) { dotNL = 0.5 ; }
			else if ( dotNL >= 0.0 ) { dotNL = 0.15 ; }
			else { dotNL = 0.0 ; }
			//*/
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront_cel += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack_cel += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif
	
	#if NUM_SPOT_LIGHTS > 0
		for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
			directLight = getSpotDirectLightIrradiance( spotLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront_cel += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack_cel += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif

	#if NUM_DIR_LIGHTS > 0
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
			directLight = getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront_cel += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack_cel += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif

	#if NUM_HEMI_LIGHTS > 0
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			vLightFront_cel += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
			#ifdef DOUBLE_SIDED
				vLightBack_cel += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
			#endif
		}
	#endif

	// End of lights_lambert_vertex.glsl code
	
	// Cel-shading specific code
	
	#ifdef USE_MAP
		gl_FragColor = texture2D( map, vUv );
	#else
		gl_FragColor = vec4(diffuse, 1.0);
	#endif
	
	gl_FragColor[0] *= vLightFront_cel[0] ;
	gl_FragColor[1] *= vLightFront_cel[1] ;
	gl_FragColor[2] *= vLightFront_cel[2] ;
	/*
	vec3 basecolor = vec3(gl_FragColor[0], gl_FragColor[1], gl_FragColor[2]);
	float alpha = gl_FragColor[3];
	//float vlf = vLightFront[0];
	float vlf = ( vLightFront_cel[0] + vLightFront_cel[1] + vLightFront_cel[2] ) * 0.33333333333;
	
	// Clean and simple
	if ( vlf <= celStep[0][0] ) { gl_FragColor = vec4(mix( basecolor, vec3( celStep[0][2] ), celStep[0][1]), alpha); }
	else if ( vlf <= celStep[1][0] ) { gl_FragColor = vec4(mix( basecolor, vec3( celStep[1][2] ), celStep[1][1]), alpha); }
	else if ( vlf <= celStep[2][0] ) { gl_FragColor = vec4(mix( basecolor, vec3( celStep[2][2] ), celStep[2][1]), alpha); }
	else { gl_FragColor = vec4( mix( basecolor, vec3(1.0), 0.2), alpha); }
	*/
	
	// End of mod--------------------
}
