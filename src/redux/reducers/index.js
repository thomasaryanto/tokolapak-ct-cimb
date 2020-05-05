import { combineReducers } from "redux";
import userReducer from "./user";
import componentReducer from "./component";

export default combineReducers({
  user: userReducer,
  component: componentReducer,
});
