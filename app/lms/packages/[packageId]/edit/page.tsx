import { notFound } from "next/navigation";

import { lmsPackages, packageSummaries } from "../../../_data/catalog";
import { PackageFormPage } from "../../package-form-page";

export function generateStaticParams() {
  return packageSummaries.map((lmsPackage) => ({ packageId: lmsPackage.id }));
}

export default async function EditPackagePage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const lmsPackage = lmsPackages.find((item) => item.id === packageId);

  if (!lmsPackage) notFound();

  return <PackageFormPage mode="edit" lmsPackage={lmsPackage} />;
}
