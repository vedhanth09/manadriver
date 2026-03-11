import { useState } from "react"
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CancelJobModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

function CancelJobModal({ open, onClose, onConfirm, loading }: CancelJobModalProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    onConfirm(reason.trim())
    setReason("")
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-md">
      <ModalHeader>
        <ModalTitle>Cancel Job</ModalTitle>
        <ModalDescription>
          Are you sure you want to cancel this job? This action cannot be undone.
        </ModalDescription>
      </ModalHeader>

      <div className="space-y-2">
        <label htmlFor="cancel-reason" className="text-sm font-medium text-foreground">
          Reason (optional)
        </label>
        <Textarea
          id="cancel-reason"
          placeholder="Let the other party know why you're cancelling..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
      </div>

      <ModalFooter>
        <Button variant="secondary" size="sm" onClick={handleClose} disabled={loading}>
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? "Cancelling..." : "Confirm Cancellation"}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export { CancelJobModal }
