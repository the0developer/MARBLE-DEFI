import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import { Dashboard } from '../features/dashboard'
import { PageHeader } from '../components/Layout/PageHeader'
import { styled } from 'components/theme'

export default function Home() {
  const [fullWidth, setFullWidth] = React.useState(true)
  return (
    <AppLayout fullWidth={fullWidth}>
      <PageHeader title="Dashboard" subtitle="" />
      <Dashboard />
    </AppLayout>
  )
}

const Container = styled('div', {})
