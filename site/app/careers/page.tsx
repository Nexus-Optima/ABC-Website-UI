import type { Metadata } from "next";
import CareersRoles from "@/components/CareersRoles";
import { getOpenRoles } from "@/lib/api";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const roles = await getOpenRoles();
  return <CareersRoles roles={roles} />;
}
