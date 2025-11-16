import { redirect } from "next/navigation"

interface CreatorPageProps {
  params: {
    creator: string
  }
}

export default function CreatorPage({ params }: CreatorPageProps) {
  // Redirect to explore page for now
  // In the future, this could be a creator profile page
  redirect('/explore')
}
