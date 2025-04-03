
// --- CONFIGURATION --- //
const BEARER_TOKEN = "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn";
const OMNIVA_METHOD_ID = '8451-1735813681330'; // Replace with your real Omniva ID
const LP_METHOD_ID = '46669-1736241676382';    // Replace with your real DPD ID

// === SETUP: Declare the field early === //
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};
ec.order.extraFields.pickup_point = {
  title: 'Pasirinkite atsiėmimo tašką',
  type: 'select',
  options: [{
    'title': 'Pasirinkite atsiemimo tašką'
  }], // start empty
  required: true,
  checkoutDisplaySection: 'shipping_methods',
  orderDetailsDisplaySection: 'shipping_info',
  overrides: [] // we'll fill this after fetching
};

// === FUNCTION: Fetch pickup points and apply overrides === //
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

      // Prepare Omniva options
      const omnivaOptions = locations
        .filter(loc => loc.courier_code === "omniva_lt")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      // Prepare DPD options
      const lpOptions = locations
        .filter(loc => loc.courier_code === "lp_express")
        .map(loc => ({
          title: `${loc.name} - ${loc.address} - ${loc.city}`,
          value: loc.identifier
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      // Update the overrides
      ec.order.extraFields.pickup_point.overrides = [
        {
          shippingMethodId: OMNIVA_METHOD_ID,
          options: omnivaOptions,
          tip: 'Omniva paštomatai'
        },
        {
          shippingMethodId: LP_METHOD_ID,
          options: lpOptions,
          tip: 'LP Express paštomatai'
        }
      ];

    // Reset selection to force refresh
    Ecwid.Cart.setExtraField('pickup_point', '');

    // ✅ Call refreshConfig *only after overrides are set*
    console.log("✅ Calling Ecwid.refreshConfig()");
    console.log("✅ Overrides assigned, refreshing field now...");
    Ecwid.refreshConfig();
  })
    .catch(error => console.error("Error fetching pickup points:", error));
};

// === PAGE + CART TRACKING === //
let currentEcwidPage = null;

// Step 1: Store the page type when loaded
Ecwid.OnPageLoaded.add((page) => {
  const allowedPages = ['CHECKOUT', 'CHECKOUT_DELIVERY'];
  console.log("Ecwid page loaded:", page.type);
  currentEcwidPage = page;

  if (allowedPages.includes(page.type)) {
    console.log("Running pickup logic on:", page.type);
    fetchPickupPoints();
  }
});

// Step 2: Also react to cart changes while on delivery step
Ecwid.OnCartChanged.add(() => {
  if (currentEcwidPage && currentEcwidPage.type === 'CHECKOUT_DELIVERY') {
    console.log("🔄 Cart changed on delivery step, updating pickup options...");
    fetchPickupPoints();
  }
});
