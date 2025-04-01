// Initialize extra fields
window.ec = window.ec || {};
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};

// Add a new optional text input 'How should we sign the package?' to shipping address form
ec.order.extraFields.wrapping_box_signature = {
    'title': 'How should we sign the package?',
    'textPlaceholder': 'Package sign',
    'type': 'select',
    'options':{option1,option2,option3},
    'tip': 'Select a pickup point from the list',
    'required': false,
    'checkoutDisplaySection': 'shipping_methods'
};

window.Ecwid && Ecwid.refreshConfig();
console.log("Hello there!");