import React, { useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://inspirit-clothing-jsx-oi4h.vercel.app";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "",
    description: "",
    badge: "",
    isSpecialOffer: false,
    sizes: {},
  });

  const [mainImage, setMainImage] = useState(null);

  const [hoverImage, setHoverImage] = useState(null);

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================
  // CHECK FILE SIZE
  // =====================================

  const validateFile = (file) => {
    if (!file) {
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(
        `${file.name} is too large.\n\nMaximum allowed size is 10 MB.`
      );

      return false;
    }

    return true;
  };

  // =====================================
  // MAIN IMAGE
  // =====================================

  const handleMainImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    setMainImage(file);
  };

  // =====================================
  // HOVER IMAGE
  // =====================================

  const handleHoverImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    setHoverImage(file);
  };

  // =====================================
  // GALLERY IMAGES
  // =====================================

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) =>
      validateFile(file)
    );

    setGalleryImages(validFiles);
  };

  // =====================================
  // TEXT INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // VALIDATE MAIN IMAGE
    // -------------------------------

    if (!mainImage) {
      alert("Please select a main image.");
      return;
    }

    // -------------------------------
    // FINAL SIZE CHECK
    // -------------------------------

    if (!validateFile(mainImage)) {
      return;
    }

    if (
      hoverImage &&
      !validateFile(hoverImage)
    ) {
      return;
    }

    for (const file of galleryImages) {
      if (!validateFile(file)) {
        return;
      }
    }

    try {
      setLoading(true);

      const data = new FormData();

      // -------------------------------
      // PRODUCT DATA
      // -------------------------------

      data.append(
        "name",
        formData.name
      );

      data.append(
        "slug",
        formData.slug
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "badge",
        formData.badge
      );

      data.append(
        "isSpecialOffer",
        formData.isSpecialOffer
      );

      data.append(
        "sizes",
        JSON.stringify(formData.sizes)
      );

      // -------------------------------
      // MAIN IMAGE
      // -------------------------------

      data.append(
        "mainImage",
        mainImage
      );

      // -------------------------------
      // HOVER IMAGE
      // -------------------------------

      if (hoverImage) {
        data.append(
          "hoverImage",
          hoverImage
        );
      }

      // -------------------------------
      // GALLERY
      // -------------------------------

      galleryImages.forEach((file) => {
        data.append(
          "galleryImages",
          file
        );
      });

      console.log(
        "Uploading product..."
      );

      const response = await axios.post(
        `${API}/api/products`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          // Axios timeout
          timeout: 120000,
        }
      );

      console.log(
        "UPLOAD SUCCESS:",
        response.data
      );

      alert(
        "Product uploaded successfully!"
      );

      // -------------------------------
      // RESET
      // -------------------------------

      setMainImage(null);

      setHoverImage(null);

      setGalleryImages([]);

      setFormData({
        name: "",
        slug: "",
        price: "",
        category: "",
        description: "",
        badge: "",
        isSpecialOffer: false,
        sizes: {},
      });
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      if (
        error.response?.status === 413
      ) {
        alert(
          "Upload failed: file size is too large. Maximum is 10 MB per image."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to upload product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* NAME */}

        <div>
          <label>
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />
        </div>

        {/* SLUG */}

        <div>
          <label>
            Slug
          </label>

          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />
        </div>

        {/* PRICE */}

        <div>
          <label>
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label>
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label>
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3"
            rows="5"
          />
        </div>

        {/* BADGE */}

        <div>
          <label>
            Badge
          </label>

          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full border p-3"
          />
        </div>

        {/* SPECIAL OFFER */}

        <div>
          <label>
            <input
              type="checkbox"
              name="isSpecialOffer"
              checked={
                formData.isSpecialOffer
              }
              onChange={handleChange}
            />

            <span className="ml-2">
              Special Offer
            </span>
          </label>
        </div>

        {/* MAIN IMAGE */}

        <div>
          <label>
            Main Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleMainImage
            }
          />

          <p className="text-sm text-gray-500">
            Maximum: 10 MB
          </p>

          {mainImage && (
            <p>
              Selected:{" "}
              {mainImage.name}
            </p>
          )}
        </div>

        {/* HOVER IMAGE */}

        <div>
          <label>
            Hover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleHoverImage
            }
          />

          <p className="text-sm text-gray-500">
            Maximum: 10 MB
          </p>

          {hoverImage && (
            <p>
              Selected:{" "}
              {hoverImage.name}
            </p>
          )}
        </div>

        {/* GALLERY */}

        <div>
          <label>
            Gallery Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleGalleryImages
            }
          />

          <p className="text-sm text-gray-500">
            Maximum: 10 MB per image
          </p>

          {galleryImages.length > 0 && (
            <div>
              Selected{" "}
              {galleryImages.length}{" "}
              gallery images
            </div>
          )}
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white"
        >
          {loading
            ? "Uploading..."
            : "Upload Product"}
        </button>
      </form>
    </div>
  );
}

export default AdminPage;