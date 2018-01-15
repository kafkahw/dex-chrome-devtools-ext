// Create a connection to the background page
let backgroundPageConnection = chrome.runtime.connect({
  name: 'dex-panel'
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(message => {

  // Handle responses from the background page, if any
  if (message.name === 'dex_site_loaded') {
    chrome.devtools.inspectedWindow.eval("document.body.className = 'cernmo-variables'");
    chrome.devtools.inspectedWindow.eval("Healthelastic.mount(document.getElementById('mount'), Object.assign(cernmoConfig, commonConfig), '/')");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Handler when the DOM is fully loaded
  document.getElementById('trigger').addEventListener(
    "click",
    () => {
      chrome.devtools.inspectedWindow.eval("console.log('hello window!')");
      chrome.devtools.inspectedWindow.eval("window.location='http://dex-site.s3-website-us-east-1.amazonaws.com'");
    },
    false
  );
});
