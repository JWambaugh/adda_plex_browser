class MessageHandler {
  handleMessage(response) {}
  messageName() {
    return "default"
  }
}

// Add new message handlers here

class ServerStatusMessage extends MessageHandler {
  messageName() {
    return "serverStatusUpdate"
  }
  handleMessage(message, response) {
    if (window.setServerStatus) {
      window.chrome.storage.local.get(["serverStatus"], r => {
        console.log("updating server status", r)
        window.setServerStatus(r.serverStatus)
      })
    }
  }
}

// add your message handler to this list
const handlers = [new ServerStatusMessage()]

// code for processing handlers
const handlerMap = {}

handlers.forEach(handler => {
  handlerMap[handler.messageName()] = handler
})

export const listenToMessages = () => {
  window.chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.action) {
      if (message.action in handlerMap) {
        handlerMap[message.action].handleMessage(message, response)
      }
    }
  })
}
