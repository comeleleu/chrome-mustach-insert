chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.dir(details)

    let url = details.url
    if (details.url.indexOf("picsum") == -1) {
      url = "https://picsum.photos/200/300"
    }

    return {redirectUrl: url}
  },

  {
    urls: ["<all_urls>"],
    types: ["image"],
  },
  ["blocking", "requestBody", "extraHeaders"]
)