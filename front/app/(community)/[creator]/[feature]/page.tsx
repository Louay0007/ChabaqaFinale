import { redirect } from "next/navigation"

export default function FeaturePage({
  params,
}: {
  params: { creator: string; feature: string }
}) {
  // Redirect old URL structure to new community details page
  // Old: /louay-rjili/system-admin1
  // New: /community/system-admin1
  redirect(`/community/${params.feature}`)
}
