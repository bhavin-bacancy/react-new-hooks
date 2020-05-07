import { createStore, applyMiddleware } from "redux";
import rootReducer from "./Reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const logger = store => next => action => {
  let result;
  console.groupCollapsed("dispatching", action.type);
  console.log("prev state: ", store.getState());
  console.log("action: ", action);
  result = next(action);
  console.log("next state: ", store.getState());
  console.groupEnd();
  return result;
};

const storeFactory = () =>
 createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
export default storeFactory;
