// Replace placeholder token dynamically
fetch("/files/extra-fields.js")
  .then(res => res.text())
  .then(script => {
    const realScript = script.replace("__REPLACE_ME__", "InCerbzptEszbxze6xV340gdd8J3FZhn");
    const blob = new Blob([realScript], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const tag = document.createElement("script");
    tag.src = url;
    document.head.appendChild(tag);
  });
