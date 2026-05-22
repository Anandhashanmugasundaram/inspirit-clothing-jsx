import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminPage() {
  const API = import.meta.env.VITE_API_URL || "https://inspirit-clothing-jsx.onrender.com";

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const user = JSON.parse(localStorage.getItem("inspirit:user"));

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState("upload");

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  // NEW IMAGES
  const [mainImage, setMainImage] = useState(null);

  const [hoverImage, setHoverImage] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    badge: "",
    sizes: "",
  });

  // ======================
  // FETCH PRODUCTS
  // ======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // FETCH ORDERS
  // ======================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`);

      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ======================
  // HANDLE CHANGE
  // ======================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SUBMIT PRODUCT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);

      data.append("price", formData.price);

      data.append("category", formData.category);

      data.append("description", formData.description);

      data.append("badge", formData.badge);

      data.append("sizes", formData.sizes);

      // MAIN IMAGE
      if (mainImage) {
        data.append("images", mainImage);
      }

      // HOVER IMAGE
      if (hoverImage) {
        data.append("images", hoverImage);
      }

      // GALLERY
      galleryImages.forEach((img) => {
        data.append("images", img);
      });

      // UPDATE
      console.log("EDITING ID:", editingId);

      // UPDATE
      if (editingId && editingId !== "null") {
        await axios.put(`${API}/api/products/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Updated");
      }

      // CREATE
      else {
        await axios.post(`${API}/api/products`, data, );

        alert("Product Added");
      }

      // RESET
      setEditingId(null);

      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        badge: "",
        sizes: "",
      });

      setMainImage(null);

      setHoverImage(null);

      setGalleryImages([]);

      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE PRODUCT
  // ======================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await axios.delete(`${API}/api/products/${id}`);

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // DELETE IMAGE
  // ======================
  const deleteImage = async (productId, publicId) => {
    try {
      await axios.delete(`${API}/api/products/${productId}/image/${publicId}`);

      fetchProducts();

      alert("Image Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // EDIT PRODUCT
  // ======================
  const editProduct = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      badge: product.badge,

      sizes: Object.entries(product.sizes || {})
        .map(([size, stock]) => `${size}:${stock}`)
        .join(","),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setActiveTab("upload");
  };

  // ======================
  // UPDATE ORDER STATUS
  // ======================
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/orders/${id}`, { status });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // DELETE ORDER
  // ======================
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete order?")) return;

    try {
      await axios.delete(`${API}/api/orders/${id}`);

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl">
        {/* NAV */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setActiveTab("upload")}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Add Product
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className="px-6 py-3 border rounded-lg"
          >
            View Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="px-6 py-3 border rounded-lg"
          >
            View Orders
          </button>
        </div>

        {/* ADD PRODUCT */}
        {activeTab === "upload" && (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="S:2,M:3,L:4,XL:1,XXL:0"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
            />
            {/* MAIN IMAGE */}
            <div>
              <label className="font-bold block mb-2">Main Image</label>

              <input
                type="file"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="w-full border p-4 rounded-lg"
              />

              {mainImage && (
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt=""
                  className="h-48 w-40 object-cover mt-4 rounded-lg"
                />
              )}
            </div>

            {/* HOVER IMAGE */}
            <div>
              <label className="font-bold block mb-2">Hover Image</label>

              <input
                type="file"
                onChange={(e) => setHoverImage(e.target.files[0])}
                className="w-full border p-4 rounded-lg"
              />

              {hoverImage && (
                <img
                  src={URL.createObjectURL(hoverImage)}
                  alt=""
                  className="h-48 w-40 object-cover mt-4 rounded-lg"
                />
              )}
            </div>

            {/* GALLERY */}
            <div>
              <label className="font-bold block mb-2">Gallery Images</label>

              <input
                type="file"
                multiple
                onChange={(e) => setGalleryImages(Array.from(e.target.files))}
                className="w-full border p-4 rounded-lg"
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="h-40 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-lg"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </form>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl overflow-hidden bg-white"
              >
                <img
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-bold">{p.name}</h2>

                  <p className="mt-2">₹{p.price}</p>

                  {/* PRODUCT IMAGES */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    {p.images?.map((img, index) => (
                      <div key={img.public_id} className="relative">
                        <img
                          src={img.url}
                          alt=""
                          className="h-32 w-full object-cover rounded-lg"
                        />

                        {/* LABEL */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                          {index === 0 && "MAIN IMAGE"}

                          {index === 1 && "HOVER IMAGE"}

                          {index >= 2 && `GALLERY ${index - 1}`}
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteImage(
                              p._id,
                              encodeURIComponent(img.public_id),
                            )
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => editProduct(p)}
                      className="flex-1 bg-black text-white py-3 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
  <div className="space-y-8">
    {orders.map((order) => (
      <div
        key={order._id}
        className="border rounded-3xl bg-white overflow-hidden"
      >
        {/* TOP */}
        <div className="p-6 border-b bg-gray-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Order ID
            </p>

            <h2 className="font-bold mt-1 break-all">
              {order._id}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Total
            </p>

            <h3 className="text-3xl font-black mt-1">
              ₹{order.total}
            </h3>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={order.status}
              onChange={(e) =>
                updateOrderStatus(order._id, e.target.value)
              }
              className="border px-4 py-3 rounded-xl font-medium"
            >
              <option>Pending</option>

              <option>Processing</option>

              <option>Shipped</option>

              <option>Delivered</option>
            </select>

            {order.status === "Delivered" && (
              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-red-600 text-white px-5 py-3 rounded-xl"
              >
                Delete Order
              </button>
            )}
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="p-6 border-b">
          <h3 className="text-2xl font-black mb-5">
            Customer Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gray-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">Name</p>

              <h4 className="font-bold text-xl mt-1">
                {order.customer?.firstName}{" "}
                {order.customer?.lastName}
              </h4>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500">Email</p>

              <h4 className="font-medium mt-1 break-all">
                {order.userEmail}
              </h4>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>

              <h4 className="font-medium mt-1">
                {order.customer?.address},{" "}
                {order.customer?.city},{" "}
                {order.customer?.postalCode},{" "}
                {order.customer?.country}
              </h4>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="p-6">
          <h3 className="text-2xl font-black mb-5">
            Ordered Products
          </h3>

          <div className="space-y-5">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="border rounded-2xl p-4 flex flex-col md:flex-row gap-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full md:w-32 h-40 object-cover rounded-2xl bg-gray-100"
                />

                <div className="flex-1">
                  <h4 className="text-2xl font-bold">
                    {item.name}
                  </h4>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                      Qty:
                      <span className="font-bold ml-1">
                        {item.qty}
                      </span>
                    </div>

                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                      Size:
                      <span className="font-bold ml-1">
                        {item.size}
                      </span>
                    </div>

                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                      Price:
                      <span className="font-bold ml-1">
                        ₹{item.price}
                      </span>
                    </div>

                    <div className="bg-black text-white px-4 py-2 rounded-xl">
                      Total:
                      <span className="font-bold ml-1">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}

export default AdminPage;
