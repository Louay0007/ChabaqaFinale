import React from 'react'
import SessionsPageContent from '@/app/(community)/[slug]/(loggedUser)/sessions/components/SessionsPageContent'


export default async function SessionsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  

  return <SessionsPageContent slug={slug} />
}