import store from "./store/configureStore";
import {
  bugAdded,
  bugResolved,
  getUnresolvedBugs,
  getBugsByUser,
  loadBugs, addBug
} from "./store/bugs";
import { apiCallBegan, apiCallSuccess, apiCallBegan } from "./store/api";

store.dispatch(bugAdded({ description: "Bug 1" }));
store.dispatch(bugAdded({ description: "Bug 2" }));
store.dispatch(bugAdded({ description: "Bug 3" }));
store.dispatch(bugResolved({ id: 1 }));

// console.log(store.getState());

const unresolvedBugs = getUnresolvedBugs(store.getState());
const bugs = getBugsByUser(1)(store.getState());

//dispatching functions
store.dispatch((dispatch, getState) => {
  dispatch({ type: "bugsRecieved", bugs: [1, 2, 3] });
});

//alternative built in middleware called "thunk"

// dispatching action/api

store.dispatch(loadBugs());

//storing to server
store.dispatch(addBug({description: "a"}));