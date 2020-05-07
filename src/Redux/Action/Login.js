//Sync action
export const syncLogin = obj => {
  localStorage.setItem("employeeId", obj.data && obj.data.employeeId);
  localStorage.setItem("id", obj.data && obj.data.id);
  return { type: "login", payload: obj };
};

export const syncLogout = obj => {
  console.log("Object", obj);
  localStorage.setItem("employeeId", "");
  localStorage.setItem("id", "");
  return { type: "logout", payload: {} };
};

//Async action
