"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";

type ProfileData = {
  name: string | null;
  bio: string | null;
  image: string | null;
  bgImage: string | null;
};

export default function ProfileActions({ profile }: { profile: ProfileData }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowEdit(true)}
        className="flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        <Settings className="h-4 w-4" />
        编辑资料
      </button>

      <ProfileEditDialog
        profile={profile}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </>
  );
}
