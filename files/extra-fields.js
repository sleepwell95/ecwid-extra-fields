// Initialize extra fields
window.ec = window.ec || {};
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};


// Set up request headers
const BEARER_TOKEN = "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn";
const myHeaders = new Headers();
myHeaders.append("Authorization", BEARER_TOKEN);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

// Fetch data and populate options
// Testing with only 50 limit. 
fetch("https://api.multiparcels.com/v1/locations?limit=50", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const locations = data.data;

    // Map API data to options array using only the name
    const options = locations.map((location) => ({
      title: `${location.name} - ${location.address} - ${location.city} - ${location.postal_code}`
    })).sort((a, b) => a.title.localeCompare(b.title));

    // Assign to extra field
    ec.order.extraFields.wrapping_box_signature = {
      title: 'Select a pickup point',
      type: 'select',
      options: options,
      tip: 'Select a pickup point from the list',
      required: false,
      checkoutDisplaySection: 'shipping_methods'
    };

    // Refresh Ecwid config to apply the new fields
    window.Ecwid && Ecwid.refreshConfig();
  })
  .catch((error) => console.error("API error:", error));

console.log("Fetching pickup points...");

//TODO: 
//!For tomorrow. 
//* 1. Save the selected option "values" in Ecwid so it would be possible to pass  
//* it in the MS. 
// 2. Override fields when other shipping option is selected. 
// 2.1. Test it with different info showing in the options menu. Could be dummy info too. 
// 3. Think of a better way of testing everything. 
// At the moment to go through entire pipeline and then be able to test is way too long.  
// 3.1. Possible to test locally? 
// 4. How to get Shipping options data from Ecwid/MS? 
// 4.1. With shipping options data we could override options select to correct one's in options.  


