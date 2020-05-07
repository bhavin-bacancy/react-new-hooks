import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import login from "./Login";
export default combineReducers({
  toastr: toastrReducer,
  login
});
