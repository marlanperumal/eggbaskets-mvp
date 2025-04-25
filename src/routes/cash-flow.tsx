import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cash-flow')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cash-flow"!</div>
}
