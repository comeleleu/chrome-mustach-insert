
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/*
Get image, detect and recognize faces, then update src image
*/
function processImage(node) {
  node.crossOrigin = "anonymous";

  if (node.complete) {
    f = async () => add_mustache(node)
    f();
  } else {
    node.onload = async function () {
      add_mustache(this);
    };
  }
}

function add_mustache(node) {
  new_url = mustached_url(node);
  if (node.src != new_url) {
    node.src = new_url;
  }
}

function mustached_url(node) {
  let url = get_url(node)
  let hash = url.hashCode().toString()

  if (url.indexOf("picsum") > -1 || hash == "0") {
    return url
  } else {
    return "https://picsum.photos/200/300?random=" + hash
  }
}

function get_url(node) {
  return node.getAttribute("src") || node.getAttribute("data-src") || ""
}

/*
Process dynamically loaded images
*/
function observeMutations() {
  // Setup callback for mutations
  const observer = new MutationObserver(function (mutations) {
    // For every mutation
    mutations.forEach(function (mutation) {
      // For every added element
      mutation.addedNodes.forEach(function (node) {
        // Check if we appended a node type that isn't an element that we can search for images inside, like a text node.
        if (!node.tagName) return;
        const imgs = node.getElementsByTagName("img");
        Array.from(imgs).forEach((img) => {
          processImage(img);
        });
      });
    });
  });
  // Bind mutation observer to document body
  observer.observe(document.body, { childList: true, subtree: true });
}


// Entry point
document.addEventListener("DOMContentLoaded", async function (event) {
  Array.from(document.images).forEach((img) => {
    processImage(img);
  });

  observeMutations();
});
