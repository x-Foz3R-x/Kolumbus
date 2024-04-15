// Member permissions as template
export enum MemberPermissionsTemplate {
  // General permissions
  shareInvite = 1 << 0,
  createInvite = 1 << 1,
  kickMembers = 1 << 2,
  managePermissions = 1 << 3,

  // Trip permissions
  editTrip = 1 << 4,
  addEvents = 1 << 5,
  editEvents = 1 << 6,
  deleteEvents = 1 << 7,
  editOwnEvents = 1 << 8,
  deleteOwnEvents = 1 << 9,
}

export type MemberPermissions = {
  // General permissions
  shareInvite: boolean;
  createInvite: boolean;
  kickMembers: boolean;
  managePermissions: boolean;

  // Trip permissions
  editTrip: boolean;
  addEvents: boolean;
  editEvents: boolean;
  deleteEvents: boolean;
  editOwnEvents: boolean;
  deleteOwnEvents: boolean;
};
