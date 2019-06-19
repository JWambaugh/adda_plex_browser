//Very light ajax lib that replaces jQuery. By Jordan Wambaugh. V1.3 github.com/martamius/tiniAjax

chrome.runtime.onInstalled.addListener(function() {
  console.log("Addon Installed");
  window.addaplex = "foo";
  chrome.storage.local.set({ started: true });

  getServerStatus();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.active === true) {
    console.log(changeInfo, tab);
    chrome.storage.local.set({ activeUrl: tab.url });
    console.log(window.foo);
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  console.log(activeInfo);
  chrome.tabs.get(activeInfo.tabId, tab => {
    console.log(tab);
    chrome.storage.local.set({ activeUrl: tab.url });
  });
});

window.getServerStatus = _ => {
  window.chrome.storage.local.get(["serverURL"], r => {
    if (r.serverURL != "") {
      Tini.ajax({
        url: r.serverURL + "/status",
        type: "get",
        data: {},
        success: r => {
          let data = JSON.parse(r);
          console.log("server status:", data);
          window.chrome.storage.local.set({ serverStatus: data });
        }
      });
    }
  });
};

window.performAction = action => {
  window.chrome.storage.local.get(["serverURL", "activeUrl"], r => {
    if (r.serverURL != "") {
      let data = {
        ...action,
        url: r.activeUrl
      };

      Tini.ajax({
        url: r.serverURL + "/action",
        type: "get",
        data: data,
        success: r => {
          let data = JSON.parse(r);
          console.log("action completed:", data);
          chrome.notifications.create("", {
            message: data.Message,
            type: "basic",
            iconUrl: "Skull-icon.png",
            title: data.Status === "ok" ? "Success" : "Error"
          });
        }
      });
    }
  });
};
