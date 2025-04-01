const { API } = require('./public/modules/fetch-points.js');

// Initialize extra fields
window.ec = window.ec || {};
ec.order = ec.order || {};
ec.order.extraFields = ec.order.extraFields || {};


// const myHeaders = new Headers();
// myHeaders.append("Authorization", "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn");
// myHeaders.append("Cookie", "apiato=eyJpdiI6IlhLaU5IbG9IQXREM0c4TVc0TjR5dFE9PSIsInZhbHVlIjoiZ1NNS2VleWxxaG8za3BUUjBXdU0yZCs5bytuWHJCeHprMVFaWVAyS245UHhMd0U5SG82Y2FLcXZvWXhSWWRtZSIsIm1hYyI6IjE4YTM5MTUyN2FjYmYwNDg4OTc3MDg2NGM2MmJiNGVlMWYzM2E3NzljMzM1NGIzNjQxNDcyZTFkNzZiNTdiYjIifQ%3D%3D");
// const requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow"
// };

// fetch("https://api.multiparcels.com/v1/locations", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));


function fetchApi() {
    return API.api();
  }

ec.order.extraFields.wrapping_box_signature = {
    'title': 'Select a pickup point',
    'textPlaceholder': '',
    'type': 'select',
    'options':[
        { 
          'title': 'Option1'
        },
        { 
            'title': 'Option2'
        },
        { 
            'title': 'Option3'
        }
    ],
    'tip': 'Select a pickup point from the list',
    'required': false,
    'checkoutDisplaySection': 'shipping_methods'
};

window.Ecwid && Ecwid.refreshConfig();
console.log("Hello there!");