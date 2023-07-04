export const UT = {
  // dispatch({ type: UT.REPLACE, payload: any });
  REPLACE: "replace",

  // dispatch({ type: UT.REPLACE_TRIP, payload: any });
  REPLACE_TRIP: "replace_trip",

  // dispatch({ type: UT.ADD_REPLACE_TRIP, payload: any });
  ADD_REPLACE_TRIP: "add/replace_trip",

  // dispatch({ type: UT.UPDATE, trip: selectedTrip, field: string, payload: any });
  UPDATE_FIELD: "update_field",

  // dispatch({ type: UT.X_UPDATES, trip: selectedTrip, fields: string[], payload: any[], });
  UPDATE_FIELDS: "update_fields",

  // dispatchUserTrips({ type: UT.UPDATE_EVENT, tripIndex: selectedTrip, dayIndex: number, eventIndex: number, field: string, payload: any});
  UPDATE_EVENT_FIELD: "update_event_field",
};
