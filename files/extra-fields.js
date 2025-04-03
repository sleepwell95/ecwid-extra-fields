
// --- CONFIGURATION --- //
const BEARER_TOKEN = "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn";
const OMNIVA_METHOD_ID = "8451-1735813681330"; // Replace with real Omniva shipping method ID
const DPD_METHOD_ID = "46669-1736241676382";    // Replace with real DPD shipping method ID

// --- FETCH LOCATIONS AND SET FIELDS --- //
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

      // Filter by courier code
      const omnivaOptions = locations
        .filter(loc => loc.courier_code === "omniva_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city} - ${loc.postal_code}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      const dpdOptions = locations
        .filter(loc => loc.courier_code === "dpd_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city} - ${loc.postal_code}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      // Define extra fields with showForShippingMethodIds
      ec.order = ec.order || {};
      ec.order.extraFields = ec.order.extraFields || {};

      ec.order.extraFields.omniva_pickup = {
        title: 'Pasirinkite Omniva paštomatą',
        type: 'select',
        options: omnivaOptions,
        required: false,
        checkoutDisplaySection: 'shipping_methods',
        orderDetailsDisplaySection: 'shipping_info',
        showForShippingMethodIds: [OMNIVA_METHOD_ID]
      };

      ec.order.extraFields.dpd_pickup = {
        title: 'Pasirinkite DPD paštomatą',
        type: 'select',
        options: dpdOptions,
        required: false,
        checkoutDisplaySection: 'shipping_methods',
        orderDetailsDisplaySection: 'shipping_info',
        showForShippingMethodIds: [DPD_METHOD_ID]
      };

      // Apply changes
      Ecwid.refreshConfig();
    })
    .catch(error => console.error("Error fetching pickup points:", error));
};

// --- INITIALIZE ON CHECKOUT PAGE --- //
Ecwid.OnPageLoaded.add((page) => {
  if (page.type === 'CHECKOUT') {
    fetchPickupPoints();
  }
});
