<script>            
  import MapLibreMap from './components/MapLibreMap.svelte'
  import Card from './components/Card.svelte'        
  import SelectField from './components/SelectField.svelte'
  import * as zips from '../data/zipcodes.json'
  import * as services from '../data/services.json'
  import assignments from '../data/assignments.json'
  import * as addresses from '../data/addresses.json'
  import { groupByPartners} from './utils'
  import { selectedZipcode,
           selectedService, 
           createOpenCardContext, 
           setOpenCardContext } from "./store.js";
  import ACAM_LOGO from './assets/ACAM_LOGO.svg';
  

  const groupedPartners = groupByPartners()
  const openCardContext = createOpenCardContext();
  setOpenCardContext(openCardContext);

  $: groupedByZipcode = assignments.reduce((acc, { partner, zip_code }) => {
        if (!acc[zip_code]) {
            acc[zip_code] = [];
        }
        acc[zip_code].push(partner);
        return acc;
    }, {});

  $: filterByAssignment = $selectedZipcode ? Object.keys(groupedByZipcode)
    .filter(key => $selectedZipcode == key)
    .reduce((obj, key) => {
      obj[key] = groupedByZipcode[key];
      return Object.values(obj)[0];
    }, {}) : groupedPartners


  $: sortedPartners = groupedPartners
      .filter(item => filterByAssignment.includes(item.partner)) 
      .sort((a, b) => filterByAssignment.indexOf(a.partner) - filterByAssignment.indexOf(b.partner)); 


  $: filteredByZip = $selectedZipcode ? 
   sortedPartners.filter(item => item.zipcodes.some(item => item == $selectedZipcode || item.toString() === $selectedZipcode.toString()))
    : groupedPartners


  $: filteredByService = $selectedService? 
      filteredByZip.filter(item => item.services.some(item => item == $selectedService || item.service.toString() === $selectedService.toString() ))
    : filteredByZip

  $: totalPartners = groupedPartners.length
  $: shownPartners = filteredByService.length
  
  $: zipcodes = Array.from(new Set(zips.features.map((feature => feature.properties.ZIPCODE))))
  $: serviceTypes = Array.from(new Set(services.default.map((item) => item.service )))

</script>
<main>
  <div class="logo-position">
    <img src = "{ACAM_LOGO}" alt="ACAM Logo" height="30"/>
  </div>
  <div class="input-row">
      <div class="zip-wrapper"> 
        <p><span>I live in</span>
        <SelectField
          data={zipcodes}
          searchType="zip"
          limit=3
        />
        </p>
      </div>
      <div class="service-wrapper">
        <p><span>and seek</span>
        <SelectField
          data={serviceTypes}
          searchType="service"
          limit=5
        />
      </p>
    </div>
  </div>
  <div class="content-wrapper">
    <div class="info-column">
      <div class="listings">
        <div class="partners-info-container">
          <div class="partners-count">
            <span>Showing {shownPartners} out of {totalPartners} providers</span>
          </div>
        </div>
        {#each filteredByService as partner, index}
          <Card 
          
            data={partner}
            index={index}
            addresses={addresses}
          />
        {/each}
        {#if shownPartners === 0}
          <div class="card">No partners provide {$selectedService} in {$selectedZipcode}. </div> 
        {/if}
      </div>
    </div>
    <div class="map-column">
      <MapLibreMap
        zipcodes={zips}
        partners={filteredByService}
        addresses={addresses}
      />
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    /* height: 100vh; */
    width: 100vw;
  }
  .logo-position {
    padding-right: 12px;
    padding-top: 12px;
    display: flex;
    justify-content: right;
    /* align-items: center; */
  }
  .input-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 4px;
    margin-left: 12px;
    justify-content: space-between;
  }
  .partners-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: #83858C;
    font-size:12px;
    margin-bottom: 16px;
  }

  .partners-count {
    display: flex;
    align-items: center;
  }

  .card {
    width: calc(100% - 16px);
    max-width: 100%;
    box-sizing: border-box;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px; 
    border: 0.5px solid;
    margin: 8px;
    color: #83858C;
    background: transparent;
    transition: all 0.3s ease; 
    overflow: visible;
    position: relative;
  }

  .service-wrapper :global([data-svelte-typeahead]) {
      padding: 4px 8px;
      border-radius: 20px;
      margin-top: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      width: 240px;
      border: 1px solid #F3A712;
  }

  p {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 4px 0;
    gap: 8px;
  }

  p span {
    display: inline-block;
    padding: 4px 0;
  }

  .zip-wrapper, .service-wrapper {
    display: flex;
    align-items: center;
  }

  .zip-wrapper :global([data-svelte-typeahead]) {
      padding: 4px 8px;
      border-radius: 20px;
      margin-top: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      width: 120px;
      border: 1px solid #F3A712;
  }

  .zip-wrapper :global(input[name='search']) {
      background-color: white !important; 
      max-width: 100%;
      font-size: 14px;
  }

  .service-wrapper :global(input[name='search']) {
      background-color: white !important; 
      font-size: 14px;
  }

  :global([data-svelte-search] input) {
      border: 0px !important;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .map-column {
    flex: 1;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    padding: 12px;
    box-sizing: border-box;
    margin-top: 16px;
  }

  .listings {
    flex-grow: 1;
    z-index: 0;
    width: 100%;
    
  }

  p {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    gap: 8px;
  }

  p span {
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .content-wrapper {
      flex-direction: row;
    }

    .info-column {
      width: 40%;
    }

    .map-column {
      width: 60%;
    }

    .listings {
      max-height: none;
    }

    .input-row {
      flex-direction: row;
      justify-content: center;
      gap: 8px;
      
    }

    .zip-wrapper, .service-wrapper {
      margin-bottom: 0;
    }
  }
</style>