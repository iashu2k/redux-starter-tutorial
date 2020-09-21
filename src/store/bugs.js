import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";



const slice = createSlice({
  name: "bugs",
  //initialState: [],
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    //actions => action handlers
    //bugs (current state)
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },

    bugsRecieved: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false
    },

    bugAssignedToUser: (bugs, action) => {
      const { bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },

    bugAdded: (bugs, action) => {
      // bugs.list.push({
      //   id: ++lastId,
      //   description: action.payload.description,
      //   resolved: false,
      // });
      bugs.list.push(action.payload);
    },

    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
  },
});
//reducing coupling
const { bugAdded, bugResolved, bugAssignedToUser, bugsRecieved, bugsRequested, bugsRequestFailed } = slice.actions;
export default slice.reducer;

//selector
// this method is time consuming and also it returns a new array everytime even if there is no change. the react DOM may rerender due to this.
// export const getUnresolvedBugs = state =>
//   state.entities.bugs.filter(bug => !bug.resolved);

//memoisation(chaching results)

export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs, //selector functions (output passed to result functions)
  (state) => state.entities.projects, //selector functions (output passed to result functions)
  //if the value of these two selected does not change the result function will not be executed
  (bugs, projects) => bugs.filter((bug) => !bug.resolved)
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );

//Action Creators(api call to server)
const url = "/bugs"

export const loadBugs = () => (dispatch, getState) => {
  const {lastFetch} = getState().entities.bugs;
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
  if(diffInMinutes < 10) return;

  dispatch(apiCallBegan({
    url,
    //method: 'get',
    //data: {},
    onStart: bugsRequested.type,
    onSuccess: bugsRecieved.type,
    onError: bugsRequestFailed.type
  }));
}

//post request to server
export const addBug = bug => apiCallBegan({
  url,
  method: "post",
  data: bug,
  onSuccess: bugAdded.type
})