<script>
	import Typeahead from 'svelte-typeahead'
	import { selectedZipcode, 
           selectedService } from "../store.js";

    export let data
	export let searchType
	export let limit


	function handleSelect(detail) {
		if (searchType === 'zip') {
			selectedZipcode.set(detail.original)

		} else if(searchType == 'service'){
			selectedService.set(detail.original)
		} 
	}

</script>

<div>
	<Typeahead
		value={searchType == "zip" ? $selectedZipcode : searchType == "service" ? $selectedService : '' }
		data={data}
		hideLabel=true
		placeholder={searchType == "service" ? 'e.g. food cards': 'e.g 77002'}
		limit={limit}
		showDropdownOnFocus={true}
		on:select={({ detail }) => handleSelect(detail)}
		on:clear={() => {
			if (searchType === 'zip') {
				selectedZipcode.set('');
			} 
			else if(searchType === 'service') {
				selectedService.set('');
			}
		}}
	/>
</div>

<style>

</style>
