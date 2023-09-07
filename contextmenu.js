
// Create a parent item and two children.
var parent = chrome.contextMenus.create({
  "id": "parent",
  title: "Chrome Mustache Insert",
  contexts: ["image"]
});

var child1 = chrome.contextMenus.create({
  title: "Re-stache",
  contexts: ["image"],
  parentId: "parent",
  onclick: reStache
});

var child2 = chrome.contextMenus.create({
  title: "Un-stache",
  contexts: ["image"],
  parentId: "parent",
  onclick: unStache
});

function reStache(info, tab) {
  alert('Re-stache feature is available in the premium version of Chrome Mustache Insert. Please upgrade to Chrome Mustache Insert Pro to use this feature.');
}

function unStache(info, tab) {
  alert('Un-stache feature is available in the premium version of Chrome Mustache Insert. Please upgrade to Chrome Mustache Insert Pro to use this feature.');
}
