chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.dir(details)

    return {}
  },

  {
    urls: ["<all_urls>"],
    types: ["image"],
  },
  ["blocking", "requestBody", "extraHeaders"]
)