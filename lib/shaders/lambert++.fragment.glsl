// Lambert fragment as of THREE r75

// /!\ This shader works, but a lot of unecessary operations from the original Lambert fragment should be removed

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

// lambert++.vertex.glsl transmit that to us:
varying vec3 vViewPosition;
varying vec3 vNormal;



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
	
	vec3 vLightFront = vec3( 0.0 ) ;
	vec3 vLightBack = vec3( 0.0 ) ;
	
	#if NUM_POINT_LIGHTS > 0
		for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
			directLight = getPointDirectLightIrradiance( pointLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif
	
	#if NUM_SPOT_LIGHTS > 0
		for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
			directLight = getSpotDirectLightIrradiance( spotLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif

	#if NUM_DIR_LIGHTS > 0
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
			directLight = getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry );
			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED
				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			#endif
		}
	#endif

	#if NUM_HEMI_LIGHTS > 0
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			vLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
			#ifdef DOUBLE_SIDED
				vLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
			#endif
		}
	#endif

	// End of lights_lambert_vertex.glsl code
	// End of mod--------------------
	
	
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
	
}
