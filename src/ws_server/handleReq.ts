import { WSdata, User } from "../types/ts_types";
import { users } from "../ws_db/db";

const validateUser = (reqData: WSdata) => {
  const candidateName = JSON.parse(reqData.data).name;
  const isNotUnique = users.find((user) => user.name === candidateName);
  return isNotUnique
    ? { error: true, text: "User with this name is already exists" }
    : { error: false, text: "" };
};

const getDbIndex = (
  reqData: WSdata,
  errorData: { error: boolean; text: string }
) => {
  const userData = JSON.parse(reqData.data);

  let userIdx = null;
  if (errorData.error) {
    users.forEach((user) => {
      if (user.name === userData.name) {
        userIdx = user.index;
      }
    });
  } else {
    userIdx = users.length + 1;

    const newUser = {
      name: userData.name,
      index: userIdx,
      password: userData.password,
    };

    users.push(newUser);
    console.log(newUser);
  }
  return userIdx;
};

export const registration = (ws, reqData: WSdata) => {
  const userData = JSON.parse(reqData.data);

  const error = validateUser(reqData);
  const userIndex = getDbIndex(reqData, error);

  const data = {
    type: "reg",
    data: JSON.stringify({
      name: userData.name,
      index: userIndex,
      error: error.error,
      errorText: error.text,
    }),
    id: 0,
  };
  ws.send(JSON.stringify(data));
};
