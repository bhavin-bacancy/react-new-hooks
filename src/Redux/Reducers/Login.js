const initialState = {
  isLogin: false
};

function addReducer(state = initialState, action) {
  switch (action.type) {
    case "login":
      return { ...state, ...action.payload,isLogin:true };
    case "logout":
      return { ...state, ...action.payload,isLogin:false };
    default:
      return state;
  }
}
export default addReducer;
