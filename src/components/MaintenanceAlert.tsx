import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MaintenanceAlert() {
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Server Maintenance</AlertTitle>
      <AlertDescription>
        Our servers are currently undergoing maintenance. Please check back later. We apologize for any inconvenience.
      </AlertDescription>
    </Alert>
  )
}