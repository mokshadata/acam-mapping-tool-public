<script>
  import { slide } from "svelte/transition";
  import { 
           selectedPartner,
           selectedService,
           getOpenCardContext, 
           } from "../store";
  

  export let initiallyVisible = false;
  export let data
  export let index
  export let addresses

  let visible = initiallyVisible;
  let hoveredCard;
  let hoveredService;
  let selectedCard;

  $: groupedByProgramArea = data.services.reduce((acc, { program_area, service }) => {
    if (!acc[program_area]) {
        acc[program_area] = [];
    }
    acc[program_area].push(service);
    return acc;
  }, {});

  $: openCardContext.subscribe(openIndex => {
      visible = openIndex === index;
  });

  $: filteredAddress = addresses.default
      .filter(obj => data.partner == obj.partner)[0]

  function toggleVisibility(selected) {
    if (visible) {
      openCardContext.closeCard();
    } else {
      openCardContext.openCard(index);
    }    

    if($selectedPartner === selected){
      $selectedPartner = null
    } else {
    $selectedPartner = selected
    selectedCard = $selectedPartner
    }

  }
  const openCardContext = getOpenCardContext();

  function handleMouseOver(service) {
    hoveredService = service;
  }
  
  function handleMouseOut() {
    hoveredService = null;
  }
  function handleClick(service) {
    return
    
  }  


</script>

<button class="card"  
  class:selected={selectedCard === $selectedPartner}
  on:mouseenter={() => hoveredCard = true}
  on:mouseleave={() => { 
    hoveredCard = false 
    hoveredService = null
  }}
  class:active={hoveredCard}
  >
    <button class="card-header"  
    on:click={() => toggleVisibility(data.partner)}
  >
    {data.partner}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7" fill="none">
      <path d="M1 0L7 6L13 0" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <div class="card-brief">
  </div>
  {#if visible}
      <div class="legend-row">
        Hover over  <svg class="service-circle"></svg>  to view service
        </div>
      <div transition:slide>
  
        {#each Object.entries(groupedByProgramArea) as [programArea, services]}
      <div class="card-content">
        
        <div>{programArea}</div>
        <div class="items-container">
          {#each services as service }
            <div class="service-container">
              <button 
              class="service"
              class:selected={service === $selectedService}
              class:active={hoveredService === service}
              on:mouseout={handleMouseOut}
              on:focus={() => handleMouseOver(service)}
              on:blur={handleMouseOut}
              on:mouseover={() => handleMouseOver(service)}
              >
            </button>
            {#if hoveredService === service}
              <div class="tooltip"
              >
                <div>{service}</div>
              </div> 
              {/if}
            </div>
            {/each}
          </div>
      </div>
    {/each}
  </div>
  {#if data.partner == "Alliance of Community Assistance Ministries (ACAM)"}
  <p style="text-align:left;"> Young adult employment services (16 yrs – 24yrs old) available in the following counties: Harris, Fort Bend, Waller, Montgomery, Galveston, and Brazoria. </p> 
    <p style="text-align:left;">Housing screening and navigation services available in the following counties: Harris, Fort Bend, Montgomery, and Waller.</p>
  {:else}
    <p style="text-align:left;">Some services are only available in certain zipcodes. </p>
    <p style="text-align:left;"> Visit <a target="_blank" href={filteredAddress.website}>{filteredAddress.website}</a> to learn more.</p>
    {/if}
  {/if}
</button>


<style>
  .items-container {
    display: flex;
    flex-direction: row;
    font-size: 14px;
  }

  .service-container {
    position: relative;
    z-index: 2;
    margin-bottom: 10px;
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

  /* .card.selected {
    border: 1px solid #F3A712;
  } */
  

  @media (min-width: 768px) {
    .card {
      padding: 20px 16px; 
    }
  }
/* 
  @media (hover: hover) {
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px #F3A712;
      border: 1px solid #F3A712;
    }
  } */

  .card-header {
    font-family: var(--font-sans);
    color: #3a3a3e;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;  
    text-align: left;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    width: 100%;
  }

  .legend-row {
    display: flex;
    text-align: center;
    color: light-gray;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  .card-brief {
    display: flex;
    gap: 8px;
    align-self: stretch;
    color: #83858C;
  }

  .card-content {
    padding: 8px 0px;
    display: flex;
    flex-direction: column;
    color: #3a3a3e;
    font-family: var(--font-sans);
    text-align: left;
  }

  .tooltip {
    position: absolute;
    bottom: 120%;
    left: 50%;
    background-color: #333;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    white-space: normal;
    text-align: left;
  }

  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
  }

  .service, .service-circle {
    border: 1px solid #1c4498;
    background: #1c4498;
    border-radius: 100%;
    width: .75rem;
    height: .75rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 200ms ease;
    margin: 2px;  
  }

  .service-circle {
    margin-left: 4px;
    margin-right: 4px;
  }
/* 
  .card.active,
  .card:focus {
    border: 1px solid #F3A712;
  } */

  .service.active,
  .service:focus {
    border-width: 3px;
  }

  .service.selected,
  .service:focus {
    border-width: 3px;
    border: 1px solid #F3A712;
    background: #F3A712;
  }


</style>