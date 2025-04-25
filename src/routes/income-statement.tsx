import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/income-statement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/income-statement"!</div>
}
