chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return {}
  },

  {
    urls: ["<all_urls>"],
    types: ["image"],
  },
  ["blocking", "requestBody", "extraHeaders"]
)