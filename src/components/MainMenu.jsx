import React, { useState, useRef } from "react";
import {
  ListItem,
  ListItemText,
  List,
  Card,
  CardActions,
  Icon,
  IconButton
} from "@material-ui/core";
import Settings from "./Settings";

let MainMenu = (props) => {
  let { setActiveView, width } = props;
  let self = useRef()


  return (
    <Card ref={self} style={{ width: width }}>
      <List component="nav" aria-label="Main mailbox folders">
        <ListItem button>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
      <CardActions>
        <IconButton onClick={_ => { setActiveView(<Settings {...props} />) }}>
          <Icon>settings</Icon>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MainMenu;
