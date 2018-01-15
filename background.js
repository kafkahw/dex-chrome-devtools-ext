const DEX_SITE_URL = 'http://dex-site.s3-website-us-east-1.amazonaws.com/';

let connections = {};

chrome.runtime.onConnect.addListener((devToolsConnection) => {
  // Only listen for connection from 'dex-panel'
  if (devToolsConnection.name !== 'dex-panel') return;

  let devToolsListener = (message, sender, sendResponse) => {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name == "init") {
      connections[message.tabId] = devToolsConnection;
      console.log('register tabId: ', message.tabId);
      return;
    }

    // other message handling
  }

  let tabsListener = (tabId, changeInfo, tab) => {
    // Only listen for registered tab Ids and changes with complete status
    if (tab.url === DEX_SITE_URL && tabId in connections && changeInfo.status === 'complete') {
      devToolsConnection.postMessage({
        name: 'dex_site_loaded',
      });

      console.log('tab update is complete');
      // console.log('tab:', tab);
      console.log('tabId:', tabId);
      console.log('tab url:', tab.url);
    }
  };

  // Add listeners
  devToolsConnection.onMessage.addListener(devToolsListener);
  chrome.tabs.onUpdated.addListener(tabsListener);

  devToolsConnection.onDisconnect.addListener(() => {
    // Remove listeners
    devToolsConnection.onMessage.removeListener(devToolsListener);
    chrome.tabs.onUpdated.removeListener(tabsListener);
  });

});
