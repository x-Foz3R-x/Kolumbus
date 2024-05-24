"use client";

import { useState } from "react";

import { decodePermissions, encodePermissions } from "~/lib/utils";
import { type MemberPermissions, MemberPermissionFlags } from "~/lib/validations/membership";

import { Input } from "~/components/ui";
import PermissionCheckbox from "./_components/permission-checkbox";
import PermissionDisplay from "./_components/permission-display";

export default function PermissionCalculator() {
  const [decodedPermission, setDecodedPermission] = useState(801);
  const [selectedPermissions, setSelectedPermissions] = useState<MemberPermissions>({
    shareInvite: false,
    editInvite: false,
    kickMembers: false,
    managePermissions: false,

    editTrip: false,
    addEvents: false,
    editEvents: false,
    deleteEvents: false,
    editOwnEvents: false,
    deleteOwnEvents: false,
  });

  const handleCheckboxChange = (permission: keyof MemberPermissions, checked: boolean) => {
    setSelectedPermissions({ ...selectedPermissions, [permission]: checked });
  };

  const permissionsKeys = Object.keys(selectedPermissions);
  const generalPermissionsKeys = permissionsKeys.slice(0, 4);
  const tripPermissionsKeys = permissionsKeys.slice(4);

  const encoded = encodePermissions(selectedPermissions, MemberPermissionFlags);
  const decoded = decodePermissions<MemberPermissions>(decodedPermission, MemberPermissionFlags);

  return (
    <>
      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Encode</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
          <span className="text-xl">Permission: {encoded}</span>

          <div className="flex gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">General Permissions</h4>
              {generalPermissionsKeys.map((permission) => (
                <PermissionCheckbox
                  key={permission}
                  permission={permission as keyof MemberPermissions}
                  onChange={handleCheckboxChange}
                  isChecked={selectedPermissions[permission as keyof MemberPermissions]}
                />
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">Trip Permissions</h4>
              {tripPermissionsKeys.map((permission) => (
                <PermissionCheckbox
                  key={permission}
                  permission={permission as keyof MemberPermissions}
                  onChange={handleCheckboxChange}
                  isChecked={selectedPermissions[permission as keyof MemberPermissions]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Decode</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
          <Input
            type="number"
            insetLabel="Permission"
            value={decodedPermission}
            onChange={(e) => setDecodedPermission(Number(e.target.value))}
          />

          <div className="flex gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">General Permissions</h4>

              {generalPermissionsKeys.map((permission) => (
                <PermissionDisplay
                  key={permission}
                  permission={permission as keyof MemberPermissions}
                  isChecked={decoded[permission as keyof MemberPermissions]}
                />
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">Trip Permissions</h4>
              {tripPermissionsKeys.map((permission) => (
                <PermissionDisplay
                  key={permission}
                  permission={permission as keyof MemberPermissions}
                  isChecked={decoded[permission as keyof MemberPermissions]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
