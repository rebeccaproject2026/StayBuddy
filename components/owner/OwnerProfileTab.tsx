"use client";

import ProfileSection from "./ProfileSection";
import type { OwnerProfileTabProps } from "./types";

export default function OwnerProfileTab({ user, tc, language, isDark }: OwnerProfileTabProps) {
  return <ProfileSection user={user} tc={tc} language={language} isDark={isDark} />;
}
