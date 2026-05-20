import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminPage() {

  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL;

  // FIXED
  const user = JSON.parse(
    localStorage.getItem("inspirit:user")
  );

  // ADMIN PROTECTION
  if (
    !user ||
    user.email !== adminEmail
  ) {
    return <Navigate to="/" replace />;
  }

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      category: "",
      description: "",
      badge: "",
      sizes: "",
    });

  const [images, setImages] =
    useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // CLOUDINARY
  const uploadToCloudinary =
    async () => {

      const uploadedImages = [];

      for (
        let i = 0;
        i < images.length;
        i++
      ) {
        const data = new FormData();

        data.append(
          "file",
          images[i]
        );

        data.append(
          "upload_preset",
          import.meta.env
            .VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env
              .VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const uploaded =
          await res.json();

        uploadedImages.push(
          uploaded.secure_url
        );
      }

      return uploadedImages;
    };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const imageUrls =
        await uploadToCloudinary();

      const payload = {
        ...formData,

        price: Number(
          formData.price
        ),

        sizes:
          formData.sizes
            .split(",")
            .map((s) =>
              s.trim()
            ),

        images: imageUrls,
      };

      await axios.post(
        "http://localhost:5000/api/products",
        payload
      );

      alert(
        "✅ Product Added Successfully"
      );

      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        badge: "",
        sizes: "",
      });

      setImages([]);
    } catch (error) {
      console.log(error);

      alert("❌ Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-5">

      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">

        <div className="mb-10">

          <p className="text-xs tracking-[0.4em] text-gray-500">
            ADMIN PANEL
          </p>

          <h1 className="text-5xl font-bold mt-3">
            Upload Product
          </h1>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg h-40"
          />

          <input
            type="text"
            name="badge"
            placeholder="Badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg"
          />

          <input
            type="text"
            name="sizes"
            placeholder="S,M,L,XL"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full border p-4 rounded-lg"
          />

          <input
            type="file"
            multiple
            onChange={(e) =>
              setImages(
                e.target.files
              )
            }
            className="w-full border p-4 rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg"
          >
            {loading
              ? "Uploading..."
              : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminPage;