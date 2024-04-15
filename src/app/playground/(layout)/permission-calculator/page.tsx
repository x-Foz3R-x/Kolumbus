"use client";

import { useState } from "react";
import Link from "next/link";

import { decodePermissions, encodePermissions } from "@/db/utils";
import { MemberPermissions, MemberPermissionsTemplate } from "@/types";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function PermissionCalculator() {
  const [decodedPermission, setDecodedPermission] = useState(801);
  const [selectedPermissions, setSelectedPermissions] = useState<MemberPermissions>({
    shareInvite: false,
    createInvite: false,
    kickMembers: false,
    managePermissions: false,

    editTrip: false,
    addEvents: false,
    editEvents: false,
    deleteEvents: false,
    editOwnEvents: false,
    deleteOwnEvents: false,
  });

  const handleCheckboxChange = (permission: keyof MemberPermissions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [permission]: event.target.checked,
    });
  };

  const permissionsKeys = Object.keys(selectedPermissions);
  const generalPermissionsKeys = permissionsKeys.slice(0, 4);
  const tripPermissionsKeys = permissionsKeys.slice(4);

  const encoded = encodePermissions(selectedPermissions, MemberPermissionsTemplate);
  const decoded = decodePermissions<MemberPermissions>(decodedPermission, MemberPermissionsTemplate);

  const PermissionCheckbox = ({ permission }: { permission: keyof MemberPermissions }) => (
    <label
      htmlFor={permission}
      className={cn(
        "flex w-52 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2",
        selectedPermissions[permission] && "border-kolumblue-200 bg-kolumblue-100",
      )}
    >
      <input
        id={permission}
        type="checkbox"
        checked={selectedPermissions[permission]}
        onChange={handleCheckboxChange(permission)}
        className="hidden"
      />
      {camelCaseToWords(permission)}
    </label>
  );

  const PermissionDisplay = ({ permission }: { permission: keyof MemberPermissions }) => (
    <div
      key={permission}
      className={cn(
        "w-52 rounded-md border px-3 py-2",
        decoded[permission] ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100",
      )}
    >
      {camelCaseToWords(permission)}: {decoded[permission] ? "Yes" : "No"}
    </div>
  );

  return (
    <div className="h-screen w-screen bg-gray-50">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-center text-lg font-medium">
        Permission Calculator
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl shadow-borderXL" />
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="h-3 w-3 cursor-default rounded-full border-[0.5px] border-yellow-600 bg-red-500"
          />
          <span className="h-3 w-3 rounded-full border-[0.5px] border-yellow-600 bg-yellow-500" />
          <span className="h-3 w-3 rounded-full border-[0.5px] border-green-600 bg-green-500" />
        </div>

        <h2 className="font-medium text-gray-800">Calculator</h2>
      </div>

      <main
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 flex min-w-min items-center justify-center gap-8 overflow-auto rounded-b-xl bg-white"
      >
        <div>
          <h2 className="font-belanosima text-lg font-semibold text-gray-500">Encode</h2>
          <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
            <h3 className="text-xl">Permission: {encoded}</h3>

            <div className="flex gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">General Permissions</h4>
                {generalPermissionsKeys.map((permission) => (
                  <PermissionCheckbox key={permission} permission={permission as keyof MemberPermissions} />
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Trip Permissions</h4>
                {tripPermissionsKeys.map((permission) => (
                  <PermissionCheckbox key={permission} permission={permission as keyof MemberPermissions} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-belanosima text-lg font-semibold text-gray-500">Decode</h2>
          <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
            <Input
              type="number"
              label="Permission"
              variant="insetLabel"
              value={decodedPermission}
              onInput={(e) => setDecodedPermission(Number(e.currentTarget.value))}
            />

            <div className="flex gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">General Permissions</h4>

                {generalPermissionsKeys.map((permission) => (
                  <PermissionDisplay key={permission} permission={permission as keyof MemberPermissions} />
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Trip Permissions</h4>
                {tripPermissionsKeys.map((permission) => (
                  <PermissionDisplay key={permission} permission={permission as keyof MemberPermissions} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function camelCaseToWords(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}
