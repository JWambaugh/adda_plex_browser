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
  window.chrome.storage.local.get(["serverURL", "sharedKey"], r => {
    if (r.serverURL != "" && r.sharedKey) {
      let data = {
        timestamp: +new Date()
      };

      Tini.ajax({
        url: r.serverURL + "/status",
        type: "get",
        data: data,
        headers: {
          "X-Signature": getHmac(data, r.sharedKey)
        },
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
  window.chrome.storage.local.get(
    ["serverURL", "activeUrl", "sharedKey"],
    r => {
      if (r.serverURL != "" && r.sharedKey) {
        let data = {
          Name: action.Name,
          pluginIdentifier: action.pluginIdentifier,
          url: r.activeUrl,
          timestamp: +new Date()
        };
        let hash = getHmac(data, r.sharedKey);
        console.log("hash", hash);
        Tini.ajax({
          url: r.serverURL + "/action",
          type: "get",
          data: data,
          headers: {
            "X-Signature": hash
          },
          success: r => {
            let data = JSON.parse(r);
            console.log("action completed:", data);
            createNotification(
              data.Status === "ok" ? "Success" : "Error",
              data.Message
            );
          }
        });
      }
    }
  );
};

let getHmac = (data, sharedKey) => {
  console.log(data);
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.setHMACKey(sharedKey, "TEXT");
  let keys = Object.keys(data);
  keys = keys.sort();
  keys.forEach(key => {
    if (data[key]) {
      console.log(key);
      shaObj.update(key);
      console.log(data[key]);
      if (data[key].toString) {
        shaObj.update(data[key].toString());
      } else {
        shaObj.update(data[key]);
      }
    }
  });
  return shaObj.getHMAC("HEX");
};

let createNotification = (title, message) => {
  chrome.notifications.create("", {
    message: message,
    type: "basic",
    iconUrl: "Skull-icon.png",
    title: title
  });
};
