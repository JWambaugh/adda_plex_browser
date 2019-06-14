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
  let [url, setUrl] = useState(localStorage.getItem('url'));

  return (
    <Card style={{ width: width }}>
      <CardContent>
        <Toolbar disableGutters={true}>
          <IconButton fontSize="small" onClick={_ => {
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
            localStorage.setItem("url", e.target.value)
          }}
          margin="normal"
        />
      </CardContent>
    </Card>
  );
};

export default Settings;
