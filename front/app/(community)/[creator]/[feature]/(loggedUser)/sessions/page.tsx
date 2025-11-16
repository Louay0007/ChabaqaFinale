import React from 'react'
import SessionsPageContent from '@/app/(community)/[creator]/[feature]/(loggedUser)/sessions/components/SessionsPageContent'

export default async function SessionsPage({ 
  params 
}: { 
  params: Promise<{ feature: string }> 
}) {
  const { feature } = await params

  return <SessionsPageContent slug={feature} />
}