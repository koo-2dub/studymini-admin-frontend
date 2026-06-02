import { notFound } from "next/navigation";

import { GroupFormPage } from "../../group-form-page";
import { lmsGroups } from "../../data";

export function generateStaticParams() {
  return lmsGroups.map((group) => ({ groupId: group.id }));
}

export default async function EditGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const group = lmsGroups.find((item) => item.id === groupId);

  if (!group) notFound();

  return <GroupFormPage mode="edit" group={group} />;
}
