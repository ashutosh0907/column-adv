import { CameraIcon, PlusIcon } from '../icons'
import './marketplace.css'

interface FloatingSellButtonProps {
  onOpenSellModal: () => void
}

export function FloatingSellButton({ onOpenSellModal }: FloatingSellButtonProps) {
  return (
    <button
      type="button"
      className="floating-sell-btn"
      onClick={onOpenSellModal}
      aria-label="Post a free ad to sell an item"
    >
      <CameraIcon width={18} height={18} className="floating-sell-btn__camera" />
      <span className="floating-sell-btn__text">
        <PlusIcon width={12} height={12} className="floating-sell-btn__plus" />
        <span>Sell</span>
      </span>
    </button>
  )
}

