// Initialize extra fields
window.ec = window.ec || {};
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};


// Set up request headers
const BEARER_TOKEN = "Bearer __REPLACE_ME__";
const myHeaders = new Headers();
myHeaders.append("Authorization", BEARER_TOKEN);
myHeaders.append("Cookie", "apiato=eyJpdiI6IlhLaU5IbG9IQXREM0c4TVc0TjR5dFE9PSIsInZhbHVlIjoiZ1NNS2VleWxxaG8za3BUUjBXdU0yZCs5bytuWHJCeHprMVFaWVAyS245UHhMd0U5SG82Y2FLcXZvWXhSWWRtZSIsIm1hYyI6IjE4YTM5MTUyN2FjYmYwNDg4OTc3MDg2NGM2MmJiNGVlMWYzM2E3NzljMzM1NGIzNjQxNDcyZTFkNzZiNTdiYjIifQ%3D%3D");

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
    })).sort((a, b) => b.title.localeCompare(a.title));

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
