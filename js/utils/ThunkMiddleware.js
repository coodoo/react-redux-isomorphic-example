// v1 裏所有 middleware 都要收入一個 obj，裏面是 dispatch, getState
export default function thunkMiddleware({ dispatch, getState }) {
  return next =>
    action =>
      typeof action === 'function' ?
        action(dispatch, getState) :
        next(action);
}