import React, { useState, useRef, Fragment } from "react"
import {
  ListItem,
  ListItemText,
  List,
  Card,
  CardActions,
  Icon,
  IconButton,
  ListSubheader,
  Typography,
  Paper
} from "@material-ui/core"
import Settings from "./Settings"

let MainMenu = props => {
  let { setActiveView, width } = props
  let [serverStatus, setServerStatus] = useState(null)
  let [activeUrl, setActiveUrl] = useState(null)
  window.setServerStatus = setServerStatus

  if (serverStatus == null) {
    window.chrome.storage.local.get(["serverStatus", "activeUrl"], r => {
      console.log(r)
      setServerStatus(r.serverStatus)
      setActiveUrl(r.activeUrl)
    })
  }

  let { ServerName } = serverStatus || {}

  let actions = []

  if (serverStatus && serverStatus.Plugins) {
    serverStatus.Plugins.forEach(plugin => {
      if (plugin.Actions) {
        plugin.Actions.forEach(action => {
          action.pluginIdentifier = plugin.Identifier
          action.pluginName = plugin.Name
          let match = true
          if (action.Options) {
            if (action.Options.regex) {
              let r = new RegExp(action.Options.regex)
              if (r.exec(activeUrl) === null) {
                match = false
              }
            }
          }
          if (match) {
            actions.push(action)
          }
        })
      }
    })
  }

  return (
    <Card style={{ width: width }}>
      <List
        component="nav"
        aria-label="Main mailbox folders"
        subheader={
          <ListSubheader component="div">
            {ServerName || "Not Connected"}
          </ListSubheader>
        }
      >
        {actions.length === 0 && (
          <ListItem>
            <ListItemText primary="No available actions here" />
          </ListItem>
        )}
        {actions.map(action => (
          <ListItem
            button
            onClick={_ => {
              window.chrome.runtime.getBackgroundPage(w => {
                console.log("performing:", action)
                w.performAction(action)
              })
            }}
          >
            <ListItemText primary={action.pluginName + ": " + action.Name} />
          </ListItem>
        ))}
      </List>
      {!serverStatus && (
        <Paper elevation={10} style={{ padding: 10, margin: 10 }}>
          <Typography variant="h4" gutterBottom>
            Not configured
          </Typography>
          <Typography variant="body1" gutterBottom>
            Server settings not configured. Please go to settings (click the
            gear) and set it up.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Contact your server admin for help
          </Typography>
        </Paper>
      )}
      {serverStatus && !serverStatus.Plugins && (
        <Paper elevation={10} style={{ padding: 10, margin: 10 }}>
          <Typography variant="h4" gutterBottom>
            Server Error
          </Typography>
          <Typography variant="body1" gutterBottom>
            There was an error fetching available actions from the server.
            Please make sure your shared secret is correct.
          </Typography>
        </Paper>
      )}
      <CardActions>
        <IconButton
          onClick={_ => {
            setActiveView(<Settings {...props} />)
          }}
        >
          <Icon>settings</Icon>
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default MainMenu
