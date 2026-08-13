// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// function AdminPage() {
//   const API =
//     import.meta.env.VITE_API_URL ||
//     "https://inspirit-clothing-jsx-oi4h.vercel.app";

//   const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

//   const user = JSON.parse(localStorage.getItem("inspirit:user"));

//   if (!user || user.email !== adminEmail) {
//     return <Navigate to="/" replace />;
//   }

//   const [activeTab, setActiveTab] = useState("upload");
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [mainImage, setMainImage] = useState(null);
//   const [hoverImage, setHoverImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);

//   const emptyForm = {
//     name: "",
//     price: "",
//     category: "",
//     description: "",
//     badge: "",
//     sizes: "",
//     isSpecialOffer: false,
//   };

//   const [formData, setFormData] = useState(emptyForm);

//   // ======================
//   // FETCH PRODUCTS
//   // ======================
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${API}/api/products`);
//       setProducts(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ======================
//   // FETCH ORDERS
//   // ======================
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(`${API}/api/orders`);
//       setOrders(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   // ======================
//   // HANDLE CHANGE
//   // ======================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // ======================
//   // RESET FORM
//   // ======================
//   const resetForm = () => {
//     setEditingId(null);
//     setFormData(emptyForm);
//     setMainImage(null);
//     setHoverImage(null);
//     setGalleryImages([]);
//   };

//   // ======================
//   // SUBMIT PRODUCT
//   // ======================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("price", formData.price);
//       data.append("category", formData.category);
//       data.append("description", formData.description);
//       data.append("badge", formData.badge);
//       data.append("sizes", formData.sizes);
//       data.append("isSpecialOffer", formData.isSpecialOffer);

//       if (mainImage) data.append("images", mainImage);
//       if (hoverImage) data.append("images", hoverImage);
//       galleryImages.forEach((img) => data.append("images", img));

//       const isEditing = editingId && editingId !== "null" && editingId !== "";

//       if (isEditing) {
//         await axios.put(`${API}/api/products/${editingId}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Product Updated");
//       } else {
//         await axios.post(`${API}/api/products`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Product Added");
//       }

//       resetForm();
//       fetchProducts();
//     } 
//     catch (error) {
//   console.log(error);

//   console.log(error.response?.data);

//   alert(
//     error.response?.data?.message ||
//     error.message ||
//     "Server Error"
//   );
// }
//      finally {
//       setLoading(false);
//     }
//   };

//   // ======================
//   // DELETE PRODUCT
//   // ======================
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Delete product?")) return;
//     try {
//       await axios.delete(`${API}/api/products/${id}`);
//       fetchProducts();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ======================
//   // DELETE IMAGE
//   // ======================
//   const deleteImage = async (productId, publicId) => {
//     try {
//       await axios.delete(
//         `${API}/api/products/${productId}/image/${encodeURIComponent(publicId)}`
//       );
//       fetchProducts();
//       alert("Image Deleted");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ======================
//   // EDIT PRODUCT
//   // ======================
//   const editProduct = (product) => {
//     setEditingId(product._id);
//     setFormData({
//       name: product.name || "",
//       price: product.price || "",
//       category: product.category || "",
//       description: product.description || "",
//       badge: product.badge || "",
//       isSpecialOffer: product.isSpecialOffer || false,
//       sizes: Object.entries(product.sizes || {})
//         .map(([size, stock]) => `${size}:${stock}`)
//         .join(","),
//     });
//     setMainImage(null);
//     setHoverImage(null);
//     setGalleryImages([]);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     setActiveTab("upload");
//   };

//   // ======================
//   // UPDATE ORDER STATUS
//   // ======================
//   const updateOrderStatus = async (id, status) => {
//     try {
//       await axios.put(`${API}/api/orders/${id}`, { status });
//       fetchOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ======================
//   // DELETE ORDER
//   // ======================
//   const deleteOrder = async (id) => {
//     if (!window.confirm("Delete order?")) return;
//     try {
//       await axios.delete(`${API}/api/orders/${id}`);
//       fetchOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-5">
//       <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl">

//         {/* NAV */}
//         <div className="flex gap-4 mb-10 flex-wrap">
//           <button
//             onClick={() => setActiveTab("upload")}
//             className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
//               activeTab === "upload"
//                 ? "bg-black text-white"
//                 : "border hover:bg-gray-50"
//             }`}
//           >
//             {editingId ? "✏️ Editing Product" : "Add Product"}
//           </button>
//           <button
//             onClick={() => setActiveTab("products")}
//             className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
//               activeTab === "products"
//                 ? "bg-black text-white"
//                 : "border hover:bg-gray-50"
//             }`}
//           >
//             View Products ({products.length})
//           </button>
//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
//               activeTab === "orders"
//                 ? "bg-black text-white"
//                 : "border hover:bg-gray-50"
//             }`}
//           >
//             View Orders ({orders.length})
//           </button>
//           {editingId && (
//             <button
//               onClick={resetForm}
//               className="px-6 py-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-semibold transition-colors"
//             >
//               ✕ Cancel Edit
//             </button>
//           )}
//         </div>

//         {/* ======================== */}
//         {/* ADD / EDIT PRODUCT FORM  */}
//         {/* ======================== */}
//         {activeTab === "upload" && (
//           <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

//             {editingId && (
//               <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
//                 ✏️ You are editing an existing product. Leave image fields empty to keep current images.
//               </div>
//             )}

//             <input
//               type="text"
//               name="name"
//               placeholder="Product Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg"
//               required
//             />

//             <input
//               type="number"
//               name="price"
//               placeholder="Price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg"
//               required
//             />

//             <input
//               type="text"
//               name="category"
//               placeholder="Category (e.g. T-Shirts)"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg"
//               required
//             />

//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg h-40"
//             />

//             <input
//               type="text"
//               name="badge"
//               placeholder="Badge (e.g. NEW, HOT)"
//               value={formData.badge}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg"
//             />

//             <input
//               type="text"
//               name="sizes"
//               placeholder="Sizes & Stock — e.g. S:2,M:3,L:4,XL:1"
//               value={formData.sizes}
//               onChange={handleChange}
//               className="w-full border p-4 rounded-lg"
//             />

//             {/* SPECIAL OFFER */}
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 id="offer"
//                 checked={formData.isSpecialOffer}
//                 onChange={(e) =>
//                   setFormData({ ...formData, isSpecialOffer: e.target.checked })
//                 }
//                 className="w-5 h-5"
//               />
//               <label htmlFor="offer" className="font-semibold">
//                 Special Offer Product
//               </label>
//             </div>

//             {/* MAIN IMAGE */}
//             <div>
//               <label className="font-bold block mb-2">
//                 Main Image {editingId && <span className="text-gray-400 font-normal text-sm">(leave empty to keep current)</span>}
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setMainImage(e.target.files[0])}
//                 className="w-full border p-4 rounded-lg"
//               />
//               {mainImage && (
//                 <img
//                   src={URL.createObjectURL(mainImage)}
//                   alt=""
//                   className="h-48 w-40 object-cover mt-4 rounded-lg"
//                 />
//               )}
//             </div>

//             {/* HOVER IMAGE */}
//             <div>
//               <label className="font-bold block mb-2">
//                 Hover Image {editingId && <span className="text-gray-400 font-normal text-sm">(leave empty to keep current)</span>}
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setHoverImage(e.target.files[0])}
//                 className="w-full border p-4 rounded-lg"
//               />
//               {hoverImage && (
//                 <img
//                   src={URL.createObjectURL(hoverImage)}
//                   alt=""
//                   className="h-48 w-40 object-cover mt-4 rounded-lg"
//                 />
//               )}
//             </div>

//             {/* GALLERY */}
//             <div>
//               <label className="font-bold block mb-2">
//                 Gallery Images {editingId && <span className="text-gray-400 font-normal text-sm">(leave empty to keep current)</span>}
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) => setGalleryImages(Array.from(e.target.files))}
//                 className="w-full border p-4 rounded-lg"
//               />
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
//                 {galleryImages.map((img, i) => (
//                   <img
//                     key={i}
//                     src={URL.createObjectURL(img)}
//                     alt=""
//                     className="h-40 w-full object-cover rounded-lg"
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 bg-black text-white py-4 rounded-lg font-semibold disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
//               </button>
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-8 py-4 border rounded-lg font-semibold hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         )}

//         {/* ============= */}
//         {/* PRODUCTS LIST */}
//         {/* ============= */}
//         {activeTab === "products" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {products.length === 0 && (
//               <div className="col-span-full text-center py-20 text-gray-400">
//                 <p className="text-5xl mb-4">🛍</p>
//                 <p className="text-lg font-medium">No products yet</p>
//               </div>
//             )}

//             {products.map((p) => {
//               const sizes = Object.entries(p.sizes || {});
//               const imageLabels = ["Main", "Hover"];

//               return (
//                 <div
//                   key={p._id}
//                   className="rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col"
//                 >
//                   {/* MAIN IMAGE */}
//                   <div className="relative">
//                     <img
//                       src={p.images?.[0]?.url}
//                       alt={p.name}
//                       className="w-full h-60 object-cover bg-gray-100"
//                     />
//                     <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
//                       {p.badge && (
//                         <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black text-white tracking-wide">
//                           {p.badge}
//                         </span>
//                       )}
//                       {p.isSpecialOffer && (
//                         <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600 text-red-50 tracking-wide">
//                           OFFER
//                         </span>
//                       )}
//                     </div>
//                     <div className="absolute top-3 right-3">
//                       <span className="text-sm font-semibold bg-white border border-gray-200 rounded-full px-3 py-1">
//                         ₹{p.price}
//                       </span>
//                     </div>
//                   </div>

//                   {/* BODY */}
//                   <div className="p-5 flex flex-col flex-1">
//                     <div className="mb-3">
//                       <h2 className="text-base font-bold leading-tight">{p.name}</h2>
//                       <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
//                         {p.category}
//                       </p>
//                     </div>

//                     {sizes.length > 0 && (
//                       <div className="flex gap-1.5 flex-wrap mb-4">
//                         {sizes.map(([size, stock]) => (
//                           <span
//                             key={size}
//                             className={`text-xs px-2 py-0.5 rounded border font-medium ${
//                               Number(stock) === 0
//                                 ? "bg-red-50 border-red-200 text-red-600"
//                                 : "bg-gray-50 border-gray-200 text-gray-600"
//                             }`}
//                           >
//                             {size}: {stock}
//                           </span>
//                         ))}
//                       </div>
//                     )}

//                     {/* IMAGES GRID */}
//                     <div className="mb-4">
//                       <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
//                         Images ({p.images?.length || 0})
//                       </p>
//                       <div className="grid grid-cols-3 gap-2">
//                         {p.images?.map((img, index) => (
//                           <div key={img.public_id} className="relative group aspect-square">
//                             <img
//                               src={img.url}
//                               alt=""
//                               className="w-full h-full object-cover rounded-lg bg-gray-100"
//                             />
//                             {index < 2 && (
//                               <span
//                                 className={`absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
//                                   index === 0
//                                     ? "bg-black text-white"
//                                     : "bg-white border border-gray-200 text-gray-600"
//                                 }`}
//                               >
//                                 {imageLabels[index]}
//                               </span>
//                             )}
//                             <button
//                               onClick={() => deleteImage(p._id, img.public_id)}
//                               className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
//                               title="Delete image"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
//                                 <line x1="18" y1="6" x2="6" y2="18" />
//                                 <line x1="6" y1="6" x2="18" y2="18" />
//                               </svg>
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* ACTIONS */}
//                     <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
//                       <button
//                         onClick={() => editProduct(p)}
//                         className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                         </svg>
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteProduct(p._id)}
//                         className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-semibold transition-colors"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <polyline points="3 6 5 6 21 6" />
//                           <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//                           <path d="M10 11v6M14 11v6" />
//                           <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//                         </svg>
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* =========== */}
//         {/* ORDERS LIST */}
//         {/* =========== */}
//         {activeTab === "orders" && (
//           <div className="space-y-5">
//             {orders.length === 0 && (
//               <div className="text-center py-20 text-gray-400">
//                 <p className="text-5xl mb-4">📦</p>
//                 <p className="text-lg font-medium">No orders yet</p>
//               </div>
//             )}

//             {orders.map((order) => {
//               const initials =
//                 `${order.customer?.firstName?.[0] || ""}${order.customer?.lastName?.[0] || ""}`.toUpperCase() || "?";

//               const statusStyles = {
//                 Pending: "bg-amber-100 text-amber-800",
//                 Processing: "bg-blue-100 text-blue-800",
//                 Shipped: "bg-purple-100 text-purple-800",
//                 Delivered: "bg-green-100 text-green-800",
//               };

//               return (
//                 <div
//                   key={order._id}
//                   className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
//                 >
//                   {/* HEADER */}
//                   <div className="bg-black px-5 py-4 flex flex-wrap items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
//                         {initials}
//                       </div>
//                       <div>
//                         <p className="text-white font-semibold text-sm leading-tight">
//                           {order.customer?.firstName} {order.customer?.lastName}
//                         </p>
//                         <p className="text-zinc-500 text-xs font-mono mt-0.5">
//                           #{order._id.slice(-10)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
//                         {order.status}
//                       </span>
//                       <span className="text-zinc-500 text-xs">
//                         {new Date(order.createdAt).toLocaleString("en-IN", {
//                           day: "numeric", month: "short", year: "numeric",
//                           hour: "2-digit", minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                   </div>

//                   {/* INFO GRID */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 border-b border-gray-100">
//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Contact</p>
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <span className="text-gray-400">✉</span>
//                           {order.customer?.email}
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <span className="text-gray-400">📞</span>
//                           {order.customer?.phone}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Shipping Address</p>
//                       <p className="text-sm text-gray-600 leading-relaxed">
//                         {order.customer?.address}<br />
//                         {order.customer?.city}, {order.customer?.state}<br />
//                         {order.customer?.country} — {order.customer?.postalCode}
//                       </p>
//                     </div>

//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Payment</p>
//                       <div className="space-y-1.5">
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>Subtotal</span>
//                           <span>₹{order.subtotal?.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>Shipping</span>
//                           <span className={order.shipping === 0 ? "text-green-600 font-medium" : ""}>
//                             {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
//                           </span>
//                         </div>
//                         <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
//                           <span>Total</span>
//                           <span>₹{order.total?.toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* ITEMS */}
//                   <div className="p-5 border-b border-gray-100">
//                     <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
//                       Items ({order.items?.length})
//                     </p>
//                     <div className="space-y-3">
//                       {order.items?.map((item, i) => (
//                         <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
//                           <img
//                             src={item.image || "/placeholder.png"}
//                             alt={item.name}
//                             onError={(e) => (e.target.src = "/placeholder.png")}
//                             className="h-16 w-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <p className="font-semibold text-sm truncate">{item.name}</p>
//                             <div className="flex gap-2 mt-1.5 flex-wrap">
//                               <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
//                                 Size: {item.size}
//                               </span>
//                               <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
//                                 Qty: {item.qty}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right flex-shrink-0">
//                             <p className="text-xs text-gray-400">₹{item.price} × {item.qty}</p>
//                             <p className="font-bold text-sm mt-0.5">
//                               ₹{(item.price * item.qty).toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* ACTIONS */}
//                   <div className="px-5 py-4 bg-gray-50 flex items-center gap-3 flex-wrap">
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white"
//                     >
//                       <option>Pending</option>
//                       <option>Processing</option>
//                       <option>Shipped</option>
//                       <option>Delivered</option>
//                     </select>

//                     {order.status === "Delivered" && (
//                       <button
//                         onClick={() => deleteOrder(order._id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
//                       >
//                         Delete Order
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminPage;



import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";

function AdminPage() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx-oi4h.vercel.app";

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

  const [mainImage, setMainImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const emptyForm = {
    name: "",
    price: "",
    category: "",
    description: "",
    badge: "",
    sizes: "",
    isSpecialOffer: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  // ======================
  // COMPRESS IMAGE
  // ======================
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      console.log(
        `${file.name}: ${(file.size / 1024 / 1024).toFixed(2)} MB → ` +
          `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      );

      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      return file;
    }
  };

  // ======================
  // FETCH PRODUCTS
  // ======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);
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
      console.log("FETCH ORDERS ERROR:", error);
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
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================
  // RESET FORM
  // ======================
  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMainImage(null);
    setHoverImage(null);
    setGalleryImages([]);
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
      data.append("isSpecialOffer", formData.isSpecialOffer);

      // ======================
      // COMPRESS MAIN IMAGE
      // ======================
      if (mainImage) {
        console.log("Compressing main image...");

        const compressedMain = await compressImage(mainImage);

        data.append("images", compressedMain);
      }

      // ======================
      // COMPRESS HOVER IMAGE
      // ======================
      if (hoverImage) {
        console.log("Compressing hover image...");

        const compressedHover = await compressImage(hoverImage);

        data.append("images", compressedHover);
      }

      // ======================
      // COMPRESS GALLERY IMAGES
      // ======================
      for (const img of galleryImages) {
        console.log(`Compressing gallery image: ${img.name}`);

        const compressedGallery = await compressImage(img);

        data.append("images", compressedGallery);
      }

      // ======================
      // SHOW TOTAL ORIGINAL SIZE
      // ======================
      let totalSize = 0;

      if (mainImage) {
        totalSize += mainImage.size;
      }

      if (hoverImage) {
        totalSize += hoverImage.size;
      }

      galleryImages.forEach((img) => {
        totalSize += img.size;
      });

      console.log(
        "Original total image size:",
        (totalSize / 1024 / 1024).toFixed(2),
        "MB"
      );

      // ======================
      // CHECK EDITING
      // ======================
      const isEditing =
        editingId &&
        editingId !== "null" &&
        editingId !== "";

      // ======================
      // UPDATE PRODUCT
      // ======================
      if (isEditing) {
        await axios.put(
          `${API}/api/products/${editingId}`,
          data
        );

        alert("Product Updated");
      }

      // ======================
      // CREATE PRODUCT
      // ======================
      else {
        await axios.post(
          `${API}/api/products`,
          data
        );

        alert("Product Added");
      }

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Server Error"
      );
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

      await fetchProducts();
    } catch (error) {
      console.log("DELETE PRODUCT ERROR:", error);
    }
  };

  // ======================
  // DELETE IMAGE
  // ======================
  const deleteImage = async (productId, publicId) => {
    try {
      await axios.delete(
        `${API}/api/products/${productId}/image/${encodeURIComponent(
          publicId
        )}`
      );

      await fetchProducts();

      alert("Image Deleted");
    } catch (error) {
      console.log("DELETE IMAGE ERROR:", error);
    }
  };

  // ======================
  // EDIT PRODUCT
  // ======================
  const editProduct = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      badge: product.badge || "",
      isSpecialOffer: product.isSpecialOffer || false,

      sizes: Object.entries(product.sizes || {})
        .map(([size, stock]) => `${size}:${stock}`)
        .join(","),
    });

    setMainImage(null);
    setHoverImage(null);
    setGalleryImages([]);

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
      await axios.put(
        `${API}/api/orders/${id}`,
        { status }
      );

      await fetchOrders();
    } catch (error) {
      console.log("UPDATE ORDER ERROR:", error);
    }
  };

  // ======================
  // DELETE ORDER
  // ======================
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete order?")) return;

    try {
      await axios.delete(
        `${API}/api/orders/${id}`
      );

      await fetchOrders();
    } catch (error) {
      console.log("DELETE ORDER ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl">

        {/* ====================== */}
        {/* NAVIGATION */}
        {/* ====================== */}

        <div className="flex gap-4 mb-10 flex-wrap">

          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "upload"
                ? "bg-black text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            {editingId
              ? "✏️ Editing Product"
              : "Add Product"}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "products"
                ? "bg-black text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            View Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            View Orders ({orders.length})
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-semibold transition-colors"
            >
              ✕ Cancel Edit
            </button>
          )}
        </div>

        {/* ====================== */}
        {/* ADD / EDIT PRODUCT */}
        {/* ====================== */}

        {activeTab === "upload" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-2xl"
          >

            {editingId && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
                ✏️ You are editing an existing product.
                Leave image fields empty to keep current
                images.
              </div>
            )}

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
              required
            />

            {/* PRICE */}

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
              required
            />

            {/* CATEGORY */}

            <input
              type="text"
              name="category"
              placeholder="Category (e.g. T-Shirts)"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
              required
            />

            {/* DESCRIPTION */}

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg h-40"
            />

            {/* BADGE */}

            <input
              type="text"
              name="badge"
              placeholder="Badge (e.g. NEW, HOT)"
              value={formData.badge}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
            />

            {/* SIZES */}

            <input
              type="text"
              name="sizes"
              placeholder="Sizes & Stock — e.g. S:2,M:3,L:4,XL:1"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full border p-4 rounded-lg"
            />

            {/* SPECIAL OFFER */}

            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                id="offer"
                checked={formData.isSpecialOffer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isSpecialOffer:
                      e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

              <label
                htmlFor="offer"
                className="font-semibold"
              >
                Special Offer Product
              </label>
            </div>

            {/* MAIN IMAGE */}

            <div>

              <label className="font-bold block mb-2">
                Main Image{" "}
                {editingId && (
                  <span className="text-gray-400 font-normal text-sm">
                    (leave empty to keep current)
                  </span>
                )}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setMainImage(
                    e.target.files?.[0] || null
                  )
                }
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

              <label className="font-bold block mb-2">
                Hover Image{" "}
                {editingId && (
                  <span className="text-gray-400 font-normal text-sm">
                    (leave empty to keep current)
                  </span>
                )}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setHoverImage(
                    e.target.files?.[0] || null
                  )
                }
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

              <label className="font-bold block mb-2">
                Gallery Images{" "}
                {editingId && (
                  <span className="text-gray-400 font-normal text-sm">
                    (leave empty to keep current)
                  </span>
                )}
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setGalleryImages(
                    Array.from(e.target.files || [])
                  )
                }
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

            {/* SUBMIT */}

            <div className="flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-4 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Compressing & Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 border rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        )}

        {/* ====================== */}
        {/* PRODUCTS LIST */}
        {/* ====================== */}

        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {products.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🛍</p>
                <p className="text-lg font-medium">
                  No products yet
                </p>
              </div>
            )}

            {products.map((p) => {

              const sizes = Object.entries(
                p.sizes || {}
              );

              const imageLabels = [
                "Main",
                "Hover",
              ];

              return (
                <div
                  key={p._id}
                  className="rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col"
                >

                  {/* MAIN IMAGE */}

                  <div className="relative">

                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="w-full h-60 object-cover bg-gray-100"
                    />

                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">

                      {p.badge && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black text-white tracking-wide">
                          {p.badge}
                        </span>
                      )}

                      {p.isSpecialOffer && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600 text-red-50 tracking-wide">
                          OFFER
                        </span>
                      )}

                    </div>

                    <div className="absolute top-3 right-3">

                      <span className="text-sm font-semibold bg-white border border-gray-200 rounded-full px-3 py-1">
                        ₹{p.price}
                      </span>

                    </div>
                  </div>

                  {/* BODY */}

                  <div className="p-5 flex flex-col flex-1">

                    <div className="mb-3">

                      <h2 className="text-base font-bold leading-tight">
                        {p.name}
                      </h2>

                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                        {p.category}
                      </p>

                    </div>

                    {sizes.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-4">

                        {sizes.map(([size, stock]) => (
                          <span
                            key={size}
                            className={`text-xs px-2 py-0.5 rounded border font-medium ${
                              Number(stock) === 0
                                ? "bg-red-50 border-red-200 text-red-600"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            {size}: {stock}
                          </span>
                        ))}

                      </div>
                    )}

                    {/* IMAGES */}

                    <div className="mb-4">

                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                        Images ({p.images?.length || 0})
                      </p>

                      <div className="grid grid-cols-3 gap-2">

                        {p.images?.map(
                          (img, index) => (
                            <div
                              key={img.public_id}
                              className="relative group aspect-square"
                            >

                              <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover rounded-lg bg-gray-100"
                              />

                              {index < 2 && (
                                <span
                                  className={`absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                    index === 0
                                      ? "bg-black text-white"
                                      : "bg-white border border-gray-200 text-gray-600"
                                  }`}
                                >
                                  {imageLabels[index]}
                                </span>
                              )}

                              <button
                                onClick={() =>
                                  deleteImage(
                                    p._id,
                                    img.public_id
                                  )
                                }
                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete image"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-2.5 h-2.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                >
                                  <line
                                    x1="18"
                                    y1="6"
                                    x2="6"
                                    y2="18"
                                  />

                                  <line
                                    x1="6"
                                    y1="6"
                                    x2="18"
                                    y2="18"
                                  />
                                </svg>
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">

                      <button
                        onClick={() =>
                          editProduct(p)
                        }
                        className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />

                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>

                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(p._id)
                        }
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />

                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />

                          <path d="M10 11v6M14 11v6" />

                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>

                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ====================== */}
        {/* ORDERS */}
        {/* ====================== */}

        {activeTab === "orders" && (
          <div className="space-y-5">

            {orders.length === 0 && (
              <div className="text-center py-20 text-gray-400">

                <p className="text-5xl mb-4">
                  📦
                </p>

                <p className="text-lg font-medium">
                  No orders yet
                </p>

              </div>
            )}

            {orders.map((order) => {

              const initials =
                `${order.customer?.firstName?.[0] || ""}${
                  order.customer?.lastName?.[0] || ""
                }`.toUpperCase() || "?";

              const statusStyles = {
                Pending:
                  "bg-amber-100 text-amber-800",

                Processing:
                  "bg-blue-100 text-blue-800",

                Shipped:
                  "bg-purple-100 text-purple-800",

                Delivered:
                  "bg-green-100 text-green-800",
              };

              return (
                <div
                  key={order._id}
                  className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
                >

                  {/* HEADER */}

                  <div className="bg-black px-5 py-4 flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                        {initials}
                      </div>

                      <div>

                        <p className="text-white font-semibold text-sm leading-tight">
                          {order.customer?.firstName}{" "}
                          {order.customer?.lastName}
                        </p>

                        <p className="text-zinc-500 text-xs font-mono mt-0.5">
                          #{order._id.slice(-10)}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          statusStyles[
                            order.status
                          ] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>

                      <span className="text-zinc-500 text-xs">
                        {new Date(
                          order.createdAt
                        ).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                    </div>
                  </div>

                  {/* INFO GRID */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 border-b border-gray-100">

                    {/* CONTACT */}

                    <div className="bg-gray-50 rounded-xl p-4">

                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                        Contact
                      </p>

                      <div className="space-y-2">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-gray-400">
                            ✉
                          </span>

                          {order.customer?.email}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-gray-400">
                            📞
                          </span>

                          {order.customer?.phone}
                        </div>

                      </div>
                    </div>

                    {/* SHIPPING */}

                    <div className="bg-gray-50 rounded-xl p-4">

                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                        Shipping Address
                      </p>

                      <p className="text-sm text-gray-600 leading-relaxed">

                        {order.customer?.address}
                        <br />

                        {order.customer?.city},{" "}
                        {order.customer?.state}

                        <br />

                        {order.customer?.country} —{" "}
                        {order.customer?.postalCode}

                      </p>
                    </div>

                    {/* PAYMENT */}

                    <div className="bg-gray-50 rounded-xl p-4">

                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                        Payment
                      </p>

                      <div className="space-y-1.5">

                        <div className="flex justify-between text-sm text-gray-500">

                          <span>
                            Subtotal
                          </span>

                          <span>
                            ₹
                            {order.subtotal?.toFixed(
                              2
                            )}
                          </span>

                        </div>

                        <div className="flex justify-between text-sm text-gray-500">

                          <span>
                            Shipping
                          </span>

                          <span
                            className={
                              order.shipping ===
                              0
                                ? "text-green-600 font-medium"
                                : ""
                            }
                          >
                            {order.shipping ===
                            0
                              ? "FREE"
                              : `₹${order.shipping}`}
                          </span>

                        </div>

                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">

                          <span>
                            Total
                          </span>

                          <span>
                            ₹
                            {order.total?.toFixed(
                              2
                            )}
                          </span>

                        </div>

                      </div>
                    </div>
                  </div>

                  {/* ITEMS */}

                  <div className="p-5 border-b border-gray-100">

                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                      Items ({order.items?.length})
                    </p>

                    <div className="space-y-3">

                      {order.items?.map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                          >

                            <img
                              src={
                                item.image ||
                                "/placeholder.png"
                              }
                              alt={item.name}
                              onError={(e) =>
                                (e.target.src =
                                  "/placeholder.png")
                              }
                              className="h-16 w-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">

                              <p className="font-semibold text-sm truncate">
                                {item.name}
                              </p>

                              <div className="flex gap-2 mt-1.5 flex-wrap">

                                <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
                                  Size:{" "}
                                  {item.size}
                                </span>

                                <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
                                  Qty:{" "}
                                  {item.qty}
                                </span>

                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">

                              <p className="text-xs text-gray-400">
                                ₹{item.price} ×{" "}
                                {item.qty}
                              </p>

                              <p className="font-bold text-sm mt-0.5">
                                ₹
                                {(
                                  item.price *
                                  item.qty
                                ).toFixed(2)}
                              </p>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="px-5 py-4 bg-gray-50 flex items-center gap-3 flex-wrap">

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white"
                    >
                      <option>
                        Pending
                      </option>

                      <option>
                        Processing
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>
                    </select>

                    {order.status ===
                      "Delivered" && (
                      <button
                        onClick={() =>
                          deleteOrder(
                            order._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Delete Order
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;