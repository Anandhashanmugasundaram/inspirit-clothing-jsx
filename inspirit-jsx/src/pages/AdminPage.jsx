import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminPage() {
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

  const [images, setImages] = useState([]);

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
      const res = await axios.get("http://localhost:5000/api/products");

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
      const res = await axios.get("http://localhost:5000/api/orders");

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

      images.forEach((img) => {
        data.append("images", img);
      });

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        alert("Product Updated");
      } else {
        await axios.post("http://localhost:5000/api/products", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Added");
      }

      setEditingId(null);

      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        badge: "",
        sizes: "",
      });

      setImages([]);

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
      await axios.delete(`http://localhost:5000/api/products/${id}`);

      fetchProducts();
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
      sizes: product.sizes.join(","),
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
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });

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
      await axios.delete(`http://localhost:5000/api/orders/${id}`);

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
              placeholder="S,M,L,XL"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
            />

            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full border p-4 rounded-lg"
            />

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
                  src={p.images?.[0]}
                  alt={p.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-bold">{p.name}</h2>

                  <p className="mt-2">₹{p.price}</p>

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
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{order.userEmail}</h2>

                    <p className="text-gray-500 mt-2">₹{order.total}</p>
                  </div>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>

                {/* PRODUCTS */}
                <div className="mt-5 space-y-3">
                  {order.products?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border p-3 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="h-20 w-20 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-bold">{item.name}</h3>

                        <p>
                          Qty:
                          {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* STATUS */}
                <div className="mt-6">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="border p-3 rounded-lg"
                  >
                    <option>Pending</option>

                    <option>Processing</option>

                    <option>Shipped</option>

                    <option>Delivered</option>
                  </select>
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
