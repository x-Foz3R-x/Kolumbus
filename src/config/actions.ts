// User Trips Actions
export const UT = {
  // dispatch({ type: UT.REPLACE, payload: any });
  REPLACE: "replace",

  // dispatch({ type: UT.REPLACE_TRIP, payload: any });
  REPLACE_TRIP: "replace_trip",

  // dispatch({ type: UT.ADD_REPLACE_TRIP, payload: any });
  ADD_REPLACE_TRIP: "add/replace_trip",

  // dispatch({ type: UT.UPDATE, payload: {  regenerate: boolean,selectedTrip: number, field: string, value: string | number } });
  UPDATE_FIELD: "update_field",

  // dispatch({ type: UT.X_UPDATES, payload: { regenerate: boolean, selectedTrip: number, fields: string[], values: string | number[] } });
  UPDATE_FIELDS: "update_fields",

  // dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { selectedTrip: number, dayIndex: number, eventIndex: number, field: string, value: string | number } });
  UPDATE_EVENT_FIELD: "update_event_field",

  // dispatchUserTrips({ type: UT.INSERT_EVENT, payload: { selectedTrip: number, dayIndex: number, position: number } });
  INSERT_EVENT: "insert_event",
};
