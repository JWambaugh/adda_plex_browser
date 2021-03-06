import React, { useState, Fragment } from "react"

import MainMenu from "./components/MainMenu"

let displayStack = []

let getCurrentView = _ => {
  return displayStack[displayStack.length - 1]
}

let App = () => {
  let [currentView, setView] = useState(false)

  let back = _ => {
    if (displayStack.length > 1) {
      displayStack.pop()
      setView(getCurrentView)
    }
  }

  let setActiveView = view => {
    displayStack.push(view)
    setView(view)
  }

  if (displayStack.length === 0) {
    displayStack.push(
      <MainMenu width={300} back={back} setActiveView={setActiveView} />
    )
  }
  window.chrome.storage.local.get(["started"], function(result) {
    console.log("Value currently is " + result.started)
  })
  window.foo = "this works"
  console.log(window.chrome.tabs)
  return <Fragment>{getCurrentView()}</Fragment>
}

export default App
