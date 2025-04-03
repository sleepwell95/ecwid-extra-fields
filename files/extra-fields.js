
// --- CONFIGURATION --- //
const BEARER_TOKEN = "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn";
const OMNIVA_METHOD_ID = "8451-1735813681330"; // Replace with your real Omniva ID
const DPD_METHOD_ID = "46669-1736241676382";    // Replace with your real DPD ID


// --- STEP 1: Declare empty field early --- //
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};
ec.order.extraFields.pickup_point = {
  title: 'Pasirinkite atsiėmimo tašką',
  type: 'select',
  options: [], // start empty
  required: false,
  tip: 'Pasirinkite terminalą pagal pristatymo metodą',
  checkoutDisplaySection: 'shipping_methods',
  orderDetailsDisplaySection: 'shipping_info',
  overrides: [] // will be filled after fetch
};

// --- STEP 2: Fetch locations and update the field --- //
const fetchPickupPoints = () => {
  const headers = new Headers();
  headers.append("Authorization", BEARER_TOKEN);

  const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch("https://api.multiparcels.com/v1/locations?limit=100", requestOptions)
    .then(response => response.json())
    .then(data => {
      const locations = data.data;

      // Prepare courier-specific options
      const omnivaOptions = locations
        .filter(loc => loc.courier_code === "omniva_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }));

      const dpdOptions = locations
        .filter(loc => loc.courier_code === "dpd_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }));

      // Update the overrides now that data is ready
      ec.order.extraFields.pickup_point.overrides = [
        {
          shippingMethodId: OMNIVA_METHOD_ID,
          options: omnivaOptions,
          tip: 'Omniva paštomatai'
        },
        {
          shippingMethodId: DPD_METHOD_ID,
          options: dpdOptions,
          tip: 'DPD paštomatai'
        }
      ];

      // This tells Ecwid to update the UI
      Ecwid.refreshConfig();
    })
    .catch(error => console.error("Error fetching pickup points:", error));
};

// --- STEP 3: Run fetch on CHECKOUT page load --- //
Ecwid.OnPageLoaded.add((page) => {
  if (page.type === 'CHECKOUT') {
    fetchPickupPoints();
  }
});

