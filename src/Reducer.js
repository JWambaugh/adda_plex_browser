var actionHistory = [];
var versionNumber = 0;

export class Action {
  constructor() {
    this.newState = null;
    this.beforeState = null;
    this.arguments = arguments;
    this.addToHistory = true;
  }

  doAction() {}

  getTitle() {
    return null;
  }

  setBeforeState(state) {
    this.beforeState = JSON.stringify(state);
  }

  setNewState(state) {
    this.newState = state;
  }

  getNewState() {
    return this.newState;
  }

  getAddToHistory() {
    return this.addToHistory;
  }

  setAddToHistory(add) {
    this.addToHistory = add;
  }

  getUndoable() {
    return true;
  }

  makeDirty(bidder) {
    if (this.newState.dirtyBidders.indexOf(bidder) === -1) {
      this.newState.dirtyBidders.push(bidder);
    }
  }

  getBidder(bidderIndex) {
    return this.newState.data[bidderIndex].bidder;
  }
}

export class SetDataAction extends Action {
  doAction() {
    let [state] = this.arguments;
    this.newState.data = state;
  }

  getUndoable() {
    return false;
  }
}

/**
 * An action that undoes the specified action by restoring the state to that
 * before the action was done.
 */
export class UndoAction extends Action {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    super(arguments);
    this.action = action;
  }

  getNewState() {
    return JSON.parse(this.action.beforeState);
  }
  getAddToHistory() {
    return false;
  }
  getUndoable() {
    return false;
  }
  getTitle() {
    let description = this.action.getTitle()
      ? "[" + this.action.getTitle() + "]"
      : "last action";
    return "Undid " + description;
  }
}

export function getUndo() {
  if (actionHistory.length <= 0) return null;
  console.log(actionHistory);
  let action = actionHistory.pop();
  return new UndoAction(action);
}

export function clearHistory() {
  actionHistory = [];
}

export function isClean() {
  return actionHistory.length == 0;
}

export function getVersionNumber() {
  return versionNumber;
}
/**
 *
 * @param {*} state
 * @param {Action} action
 */
export function dataReducer(state, action) {
  if (action == null) return state;
  //console.log(action);
  let newState;
  if (state === false)
    newState = {
      data: [],
      dirtyBidders: []
    };
  else newState = { ...state };
  action.setBeforeState(state);
  action.setNewState(newState);
  action.doAction();

  if (action.getAddToHistory() && action.getUndoable())
    actionHistory.push(action);

  newState = action.getNewState();
  console.log(newState);
  versionNumber++;

  return newState;
}
