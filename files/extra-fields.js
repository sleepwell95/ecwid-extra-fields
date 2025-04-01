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
