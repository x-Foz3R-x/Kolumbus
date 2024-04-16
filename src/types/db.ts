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
