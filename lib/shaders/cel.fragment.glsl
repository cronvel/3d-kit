// Lambert fragment as of THREE r75

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
uniform vec2 celStep[5];

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
	
	#ifdef USE_MAP
		gl_FragColor = texture2D( map, vUv );
	#else
		gl_FragColor = vec4(diffuse, 1.0);
	#endif
	
	vec3 basecolor = vec3(gl_FragColor[0], gl_FragColor[1], gl_FragColor[2]);
	float alpha = gl_FragColor[3];
	float vlf = vLightFront[0];
	
	// Clean and simple
	//if (vlf >= 0.75) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.0), alpha); }
	//else if (vlf >= 0.50) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.3), alpha); }
	//else { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.5), alpha); }
	
	// Clean and simple
	//if (vlf <= 0.5 ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, 0.5) , alpha); }
	if (vlf <= celStep[0][0] ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, celStep[0][1]), alpha); }
	else if (vlf <= celStep[1][0] ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, celStep[1][1]), alpha); }
	else if (vlf <= celStep[2][0] ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, celStep[2][1]), alpha); }
	else if (vlf <= celStep[3][0] ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, celStep[3][1]), alpha); }
	else if (vlf <= celStep[4][0] ) { gl_FragColor = vec4(mix( vec3(0.0), basecolor, celStep[4][1]), alpha); }
	else { gl_FragColor = vec4( mix( vec3(0.0), basecolor, 1.0), alpha); }
}
