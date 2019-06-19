import React, { useState, useRef } from "react";
import {
  ListItem,
  ListItemText,
  List,
  Card,
  CardActions,
  Icon,
  IconButton,
  CardContent,
  Typography,
  Toolbar,
  Divider,
  TextField
} from "@material-ui/core";
import MainMenu from "./MainMenu";

let Settings = (props) => {
  let { back, width } = props;
  let [url, setUrl] = useState(null);

  if (url === null) {
    window.chrome.storage.local.get(["serverURL"], function (result) {
      setUrl(result.serverURL)
    });
  }

  return (
    <Card style={{ width: width }}>
      <CardContent>
        <Toolbar disableGutters={true}>
          <IconButton fontSize="small" onClick={_ => {
            window.chrome.runtime.getBackgroundPage(w => {
              w.getServerStatus();
            })
            back();
          }}><Icon>arrow_back</Icon></IconButton>
          <Typography>Settings</Typography>
        </Toolbar>
        <Divider />
        <TextField
          label="Server URL"
          value={url}
          onChange={e => {
            setUrl(e.target.value)
            window.chrome.storage.local.set({ serverURL: e.target.value });
          }}
          margin="normal"
        />
      </CardContent>
    </Card>
  );
};

export default Settings;
