
// --- CONFIGURATION --- //
const BEARER_TOKEN = "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn";
const OMNIVA_METHOD_ID = "8451-1735813681330"; // Replace with your real Omniva ID
const DPD_METHOD_ID = "46669-1736241676382";    // Replace with your real DPD ID

// --- FETCH LOCATIONS AND SETUP FIELD WITH OVERRIDES --- //
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

      // Filter options
      const omnivaOptions = locations
        .filter(loc => loc.courier_code === "omniva_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      const dpdOptions = locations
        .filter(loc => loc.courier_code === "dpd_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      // Setup the extra field with overrides
      ec.order = ec.order || {};
      ec.order.extraFields = ec.order.extraFields || {};

      ec.order.extraFields.pickup_point = {
        title: 'Pasirinkite atsiėmimo tašką',
        type: 'select',
        tip: 'Pasirinkite terminalą pagal pristatymo metodą',
        required: false,
        checkoutDisplaySection: 'shipping_methods',
        orderDetailsDisplaySection: 'shipping_info',

        // This will be the default if no override matches
        options: [],

        overrides: [
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
        ]
      };

      // Apply changes
      Ecwid.refreshConfig();
    })
    .catch(error => console.error("Error fetching pickup points:", error));
};

// --- INITIALIZE --- //
Ecwid.OnPageLoaded.add((page) => {
  if (page.type === 'CHECKOUT') {
    fetchPickupPoints();
  }
});

