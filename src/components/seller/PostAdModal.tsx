import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import type { Product } from "../../types/product";
import { CameraIcon, CheckIcon, CloseIcon } from "../icons";
import Loader from "../Loader";
import "./seller.css";

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newProduct: Product) => void;
}

const CATEGORIES = [
  "Others",
  "Mobiles & Tablets",
  "Electronics & Appliances",
  "Vehicles & Bikes",
  "Furniture & Living",
  "Audio & Sound",
  "Computers & Laptops",
  "Cameras & Optics",
  "Fashion & Wearables",
  "Books & Hobbies",
];

const CONDITIONS = [
  { id: "brand-new", label: "Brand New", desc: "Sealed, untouched" },
  { id: "like-new", label: "Like New", desc: "Flawless condition" },
  { id: "gently-used", label: "Gently Used", desc: "Minor normal wear" },
  { id: "for-parts", label: "For Parts", desc: "Needs repair" },
];

export function PostAdModal({ isOpen, onClose, onPublish }: PostAdModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Others");
  const [condition, setCondition] = useState("Like New");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [location, setLocation] = useState("Bandra West, Mumbai");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => titleInputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setImages((prev) => [...prev, ...newUrls]);
      if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
    }
    if (e.target) e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please provide an item title";
    if (!price || Number(price) <= 0)
      errs.price = "Please enter a valid price in ₹";
    if (!location.trim()) errs.location = "Please specify a locality / city";
    if (images.length === 0) errs.images = "Please upload at least one photo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newProduct: Product = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      description:
        description.trim() ||
        `${condition} item located in ${location}. Contact seller for quick local meetup.`,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      image: images[0] || "/products/headphones.svg",
      badge: "New",
      sellerStatus: "online",
      sellerActiveText: "Online Now",
      location: location.trim(),
      distance: "0.5 km",
    };

    setTimeout(() => {
      onPublish(newProduct);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <>
      {isSubmitting && <Loader fullPage />}
      <div
        className="modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-ad-title"
      >
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Sheet Handle */}
          <div className="modal-sheet-handle-bar" aria-hidden="true">
            <span className="modal-sheet-handle" />
          </div>

          {/* Modal Header */}
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">
              <span className="modal-eyebrow-dot" />
              Free Classifieds · Instant Post
            </p>
            <h2 id="post-ad-title" className="modal-title">
              Sell anything locally
            </h2>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Photo Section */}
          <div className="form-section">
            <label className="form-label">
              Upload Photos <span className="form-required">*</span>
            </label>
            <div
              className={`photo-dropzone photo-dropzone--full ${errors.images ? "has-error" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="visually-hidden"
              />
              <CameraIcon width={24} height={24} />
              <span className="photo-dropzone-cta">
                {images.length > 0
                  ? "+ Add more photos"
                  : "Click to select photos"}
              </span>
              <span className="photo-dropzone-hint">
                PNG, JPG, WEBP (Select one or multiple photos)
              </span>
            </div>
            {errors.images ? (
              <p className="form-error">{errors.images}</p>
            ) : null}

            {/* Selected Images Listed Below Input in Square Shape with Remove Button */}
            {images.length > 0 ? (
              <div className="selected-photos-grid">
                {images.map((imgUrl, index) => (
                  <div key={index} className="selected-photo-card">
                    <img src={imgUrl} alt={`Upload ${index + 1}`} />
                    {index === 0 ? (
                      <span className="photo-cover-tag">Cover</span>
                    ) : null}
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <CloseIcon width={12} height={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Title & Category */}
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="ad-title" className="form-label">
                Item title <span className="form-required">*</span>
              </label>
              <input
                id="ad-title"
                ref={titleInputRef}
                type="text"
                className={`form-input ${errors.name ? "has-error" : ""}`}
                placeholder="e.g. iPhone 15 Pro, Royal Enfield, Solid Wood Desk"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {errors.name ? <p className="form-error">{errors.name}</p> : null}
            </div>

            <div className="form-field">
              <label htmlFor="ad-category" className="form-label">
                Category
              </label>
              <select
                id="ad-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition Selector */}
          <div className="form-section">
            <label className="form-label">Item condition</label>
            <div className="condition-chips">
              {CONDITIONS.map((cond) => (
                <button
                  type="button"
                  key={cond.id}
                  className={`condition-chip ${condition === cond.label ? "is-active" : ""}`}
                  onClick={() => setCondition(cond.label)}
                >
                  <span className="condition-chip-label">{cond.label}</span>
                  <span className="condition-chip-desc">{cond.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Negotiation in ₹ */}
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="ad-price" className="form-label">
                Price (₹) <span className="form-required">*</span>
              </label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">₹</span>
                <input
                  id="ad-price"
                  type="number"
                  min="1"
                  step="1"
                  className={`form-input currency-input ${errors.price ? "has-error" : ""}`}
                  placeholder="e.g. 14,999"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price)
                      setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                />
              </div>
              {errors.price ? (
                <p className="form-error">{errors.price}</p>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="ad-compare-price" className="form-label">
                Compare at / Original (₹)
              </label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">₹</span>
                <input
                  id="ad-compare-price"
                  type="number"
                  min="1"
                  step="1"
                  className="form-input currency-input"
                  placeholder="e.g. 19,999 (optional)"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Negotiable Toggle & Location */}
          <div className="form-grid-2 form-grid-valign">
            <div className="form-field">
              <label htmlFor="ad-location" className="form-label">
                Locality / City <span className="form-required">*</span>
              </label>
              <input
                id="ad-location"
                type="text"
                className={`form-input ${errors.location ? "has-error" : ""}`}
                placeholder="e.g. Bandra West, Mumbai"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: "" }));
                }}
              />
              {errors.location ? (
                <p className="form-error">{errors.location}</p>
              ) : null}
            </div>

            <div className="negotiation-toggle-field">
              <label className="toggle-switch-label">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                />
                <span className="toggle-switch-box" />
                <span className="toggle-switch-text">
                  <strong>Price is negotiable</strong>
                  <small>Invites buyers to send reasonable offers</small>
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="ad-description" className="form-label">
              Description &amp; inclusions
            </label>
            <textarea
              id="ad-description"
              rows={3}
              className="form-textarea"
              placeholder="Mention bill, box, accessories, warranty, or preferred meeting spot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-button modal-button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="modal-button modal-button--primary"
            >
              {isSubmitting ? (
                <span>Publishing listing...</span>
              ) : (
                <>
                  <CheckIcon width={14} height={14} />
                  <span>Publish Listing to Feed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
