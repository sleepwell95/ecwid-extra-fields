const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer InCerbzptEszbxze6xV340gdd8J3FZhn");
myHeaders.append("Cookie", "apiato=eyJpdiI6IlhLaU5IbG9IQXREM0c4TVc0TjR5dFE9PSIsInZhbHVlIjoiZ1NNS2VleWxxaG8za3BUUjBXdU0yZCs5bytuWHJCeHprMVFaWVAyS245UHhMd0U5SG82Y2FLcXZvWXhSWWRtZSIsIm1hYyI6IjE4YTM5MTUyN2FjYmYwNDg4OTc3MDg2NGM2MmJiNGVlMWYzM2E3NzljMzM1NGIzNjQxNDcyZTFkNzZiNTdiYjIifQ%3D%3D");
const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

async function apiCall() {
  try {
    const response = await fetch("https://api.multiparcels.com/v1/locations", requestOptions);
    return response.text();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}