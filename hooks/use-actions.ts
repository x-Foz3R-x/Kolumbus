/**
 * @param ADD > { type: ACTION.ADD, payload: payload }
 * @param EMPTY > { type: ACTION.EMPTY }
 * @param REPLACE > { type: ACTION.REPLACE, payload: payload }
 * @param UPDATE > { type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data }
 * @param X_UPDATES > { type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[] }
 */
export const ACTION = {
  // dispatch({ type: ACTION.ADD, payload: payload });
  ADD: "add",

  // dispatch({ type: ACTION.EMPTY });
  EMPTY: "empty",

  // dispatch({ type: ACTION.REPLACE, payload: payload });
  REPLACE: "replace",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data, });
  UPDATE: "update",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[], });
  X_UPDATES: "x_updates",
};
