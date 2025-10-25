
import { Button } from "@/components/ui/button"

interface NavigationButtonsProps {
  currentStep: number
  stepsLength: number
  setCurrentStep: (step: number) => void
  handleSubmit: () => void
  formData: {
    isActive: boolean
  }
}

export function NavigationButtons({
  currentStep,
  stepsLength,
  setCurrentStep,
  handleSubmit,
  formData,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
        disabled={currentStep === 1}
      >
        Previous
      </Button>

      <div className="flex items-center space-x-2">
        {currentStep < stepsLength ? (
          <Button
            onClick={() => setCurrentStep(Math.min(stepsLength, currentStep + 1))}
            className="bg-sessions-500 hover:bg-sessions-600"
          >
            Next Step
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-sessions-500 hover:bg-sessions-600">
            {formData.isActive ? "Create & Publish Session" : "Save as Draft"}
          </Button>
        )}
      </div>
    </div>
  )
}