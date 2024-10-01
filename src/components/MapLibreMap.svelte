<script>
  import { MapLibre, 
          Popup,
          GeoJSON, 
          FillLayer,
          Marker,
          hoverStateFilter,
          LineLayer
        } from 'svelte-maplibre';
  import { selectedZipcode, selectedPartner } from "../store.js";
  import { geoCentroid } from 'd3'
  
  export let zipcodes
  export let addresses
  export let partners

  let map
  let loaded
  let textLayers=[]
  let lng = -94.5;
  let lat = 29.756365448746067;
  let zoom = 7.4;
  let partnerNames
  let partnerZipcodes

  $: partnerNames = partners.map(obj => obj.partner);

  $: if ($selectedPartner) {
  const partnerObject = partners.find(obj => obj.partner === $selectedPartner);
  partnerZipcodes = partnerObject ? partnerObject.zipcodes || [] : [];
}

  $: filteredAddresses = addresses.default
        .filter(obj => partnerNames.includes(obj.partner))
                                          
  $: if (map && loaded) {
    textLayers = map.getStyle().layers.filter((layer) => layer['id'] === 'place_city_r5');
  }


  $: if (map && loaded) {
    for (let layer of textLayers) {
    }
  }

  function clickZip(e) {
    const zipcode = e.detail.features?.[0]?.properties.ZIPCODE
    selectedZipcode.set(zipcode);
  }

  selectedZipcode.subscribe(value => {
    if (value) {
      const zipcode = zipcodes.features.filter(feature => feature.properties.ZIPCODE === $selectedZipcode)
      const bounds = geoCentroid(zipcode[0]) 
        // map.flyTo({
        //   center: bounds,
        // } )  
    }
  });

  $: filter = $selectedPartner
  ? ['in', ['get', 'ZIPCODE'], ['literal', partnerZipcodes]]
  : undefined

  

</script>

<MapLibre 
  bind:map
  bind:loaded
  center={[lng,lat]}
  zoom={zoom}
  class="map"
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
>
    {#each filteredAddresses as { longitude, latitude, address, partner, website }}
      <Marker
        lngLat={[longitude, latitude]}
        class="circle-marker"
        >
      <Popup 
      openOn="click"
      closeOnClickInside
        >
          <div class="partner-name">{partner}</div>
          <div>{address}</div>
          <div><a target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=
{website}">Get directions</a> |
          <a target="_blank" href={website}>Visit website</a></div>
          
          
        </Popup>
      </Marker>
    {/each} 
 <GeoJSON id="zipcodes" data={zipcodes} promoteId="ZIPCODE">
    <FillLayer
        paint={{
          'fill-opacity': [
      'case',
      ['==', ['get', 'ZIPCODE'], $selectedZipcode],
      0.95,
      0.5   
    ],
          'fill-color':  [
      'case',
      ['==', ['get', 'ZIPCODE'], $selectedZipcode],
      [
          'case',
          ['has', 'color'],
          ['get', 'color'],
          "#1c4498"
        ],
      [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        "#5C676E",
        [
          'case',
          ['has', 'color'],
          ['get', 'color'],
          "#1c4498"  // default color if no COLOR attribute
        ]
      ]
    ]
        }}
        manageHoverState
        hoverCursor="pointer"
        on:click={clickZip}
        >
      </FillLayer> 
      </GeoJSON> 
      {#if $selectedPartner}
      <GeoJSON id="filtered" data={zipcodes} promoteId="ZIPCODE">
          <LineLayer
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 
              'line-color': [
          'case',
          ['has', 'color'],
          ['get', 'color'],
          "#1c4498"  // default color if no COLOR attribute
        ], 
            
            'line-width': 2 }}
            {filter}
          />
      </GeoJSON>
      {/if}
      
</MapLibre>


<style>
  :global(.map) {
    height: 100vh;
    margin-top: 32px;
  }

  .partner-name {
    font-family: var(--font-sans);
    font-size: 14px;
    color:  #83858C;
  }

  :global(.circle-marker) {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: black;
    border: 2px solid #ffffff;
    opacity: 0.9;
  }

</style>