window.chrome.runtime.onInstalled.addListener(function() {
  console.log("Addon Installed")
  window.addaplex = "foo"
  window.chrome.storage.local.set({ started: true })

  getServerStatus()
})

window.chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.action) {
    switch (message.action) {
      case "serverStatus":
        getServerStatus(response)
        break
      default:
    }
  }
})

window.chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.active === true) {
    console.log(changeInfo, tab)
    window.chrome.storage.local.set({ activeUrl: tab.url })
    console.log(window.foo)
  }
})

window.chrome.tabs.onActivated.addListener(activeInfo => {
  console.log(activeInfo)
  window.chrome.tabs.get(activeInfo.tabId, tab => {
    console.log(tab)
    window.chrome.storage.local.set({ activeUrl: tab.url })
  })
})

const getServerStatus = response => {
  window.chrome.storage.local.get(["serverURL", "sharedKey"], r => {
    console.log("using key " + r.sharedKey)
    if (r.serverURL != "" && r.sharedKey) {
      let data = {
        timestamp: +new Date()
      }

      Tini.ajax({
        url: r.serverURL + "/status",
        type: "get",
        data: data,
        headers: {
          "X-Signature": getHmac(data, r.sharedKey)
        },
        success: r => {
          let data = JSON.parse(r)
          console.log("server status:", data)
          if (data.Status !== "error") {
            window.chrome.storage.local.set({ serverStatus: data })
          } else {
            window.chrome.storage.local.set({ serverStatus: null })
            createNotification("Error fetching from server", data.Message)
          }
          window.chrome.runtime.sendMessage({ action: "serverStatusUpdate" })
        },
        error: r => {
          console.log("Error:", r)
          createNotification("Error", r)
        }
      })
    }
  })
}

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
        }
        let hash = getHmac(data, r.sharedKey)
        console.log("hash", hash)
        Tini.ajax({
          url: r.serverURL + "/action",
          type: "get",
          data: data,
          headers: {
            "X-Signature": hash
          },
          success: r => {
            let data = JSON.parse(r)
            console.log("action completed:", data)
            createNotification(
              data.Status === "ok" ? "Success" : "Error",
              data.Message
            )
          },
          error: r => {
            console.log("Error:", r)
            createNotification("Error", r)
          }
        })
      }
    }
  )
}

let getHmac = (data, sharedKey) => {
  console.log(data)
  var shaObj = new jsSHA("SHA-256", "TEXT")
  shaObj.setHMACKey(sharedKey, "TEXT")
  let keys = Object.keys(data)
  keys = keys.sort()
  keys.forEach(key => {
    if (data[key]) {
      console.log(key)
      shaObj.update(key)
      console.log(data[key])
      if (data[key].toString) {
        shaObj.update(data[key].toString())
      } else {
        shaObj.update(data[key])
      }
    }
  })
  return shaObj.getHMAC("HEX")
}

let createNotification = (title, message) => {
  window.chrome.notifications.create("", {
    message: message,
    type: "basic",
    iconUrl: "Skull-icon.png",
    title: "AddaPlex - " + title
  })
}
