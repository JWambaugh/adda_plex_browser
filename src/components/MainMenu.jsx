import React, { useState, useRef, Fragment } from "react";
import {
  ListItem,
  ListItemText,
  List,
  Card,
  CardActions,
  Icon,
  IconButton,
  ListSubheader
} from "@material-ui/core";
import Settings from "./Settings";

let MainMenu = (props) => {
  let { setActiveView, width } = props;
  let [serverStatus, setServerStatus] = useState(null);
  let [activeUrl, setActiveUrl] = useState(null);


  if (serverStatus == null) {
    window.chrome.storage.local.get(["serverStatus", 'activeUrl'], r => {
      console.log(r)
      setServerStatus(r.serverStatus);
      setActiveUrl(r.activeUrl);
    })
  }

  let { ServerName } = serverStatus || {}

  let actions = []

  if (serverStatus !== null) {
    serverStatus.Plugins.forEach(plugin => {
      plugin.Actions.forEach(action => {
        action.pluginIdentifier = plugin.Identifier;
        action.pluginName = plugin.Name;
        let match = true;
        if (action.Options) {
          if (action.Options.regex) {
            let r = new RegExp(action.Options.regex);
            if (r.exec(activeUrl) === null) {
              match = false;
            }
          }
        }
        if (match) {
          actions.push(action);
        }
      })
    })

  }



  return (
    <Card style={{ width: width }}>
      <List component="nav" aria-label="Main mailbox folders"
        subheader={<ListSubheader component="div">{ServerName}</ListSubheader>}
      >
        {actions.map(action =>
          <ListItem button onClick={_ => {
            window.chrome.runtime.getBackgroundPage(w => {
              console.log('performing:', action)
              w.performAction(action)
            })
          }}>
            <ListItemText primary={action.pluginName + ': ' + action.Name} />
          </ListItem>
        )}

      </List>
      <CardActions>
        <IconButton onClick={_ => { setActiveView(<Settings {...props} />) }}>
          <Icon>settings</Icon>
        </IconButton>
      </CardActions>
    </Card >
  );
};

export default MainMenu;
