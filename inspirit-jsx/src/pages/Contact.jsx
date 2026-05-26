import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

const FAQ = [
  {
    q: "When does the next drop release?",
    a: "New chapters drop every 8 weeks. Subscribe to the list for the exact moment.",
  },
  {
    q: "Do you ship worldwide?",
    a: "Yes — 36 countries. Free shipping on orders over $250.",
  },
  {
    q: "How does sizing run?",
    a: "Our pieces are unisex and oversized by design. If between sizes, take your usual.",
  },
  {
    q: "Can I return a limited piece?",
    a: "Limited capsule items are final sale. Standard collection: 30-day returns.",
  },
];

function Contact() {
  const [open, setOpen] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_ylvss0p", // SERVICE ID
        "template_j5dfe8j", // TEMPLATE ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "ntiPgTjzf2tx7nCnW" // PUBLIC KEY
      );

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="bone-section pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">
          — SPEAK
        </p>

        <h1 className="mt-3 text-display text-6xl md:text-8xl leading-[0.9]">
          Reach the
          <br />
          <em className="text-[oklch(0.48_0.22_25)] not-italic">
            atelier.
          </em>
        </h1>

        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <form onSubmit={sendEmail} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-4 border border-black/15 focus:border-black outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-4 border border-black/15 focus:border-black outline-none"
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-4 border border-black/15 focus:border-black outline-none"
            />

            <textarea
              name="message"
              placeholder="Tell us everything"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-4 border border-black/15 focus:border-black outline-none resize-none"
            />

            <button className="btn-blood px-8 py-4 text-grotesk text-sm tracking-[0.3em]">
              SEND MESSAGE
            </button>
          </form>

          <div className="space-y-4">
            {[
              { i: FiMapPin, t: "ATELIER", v: "Vadapalani, Chennai" },
              { i: FiMail, t: "EMAIL", v: "inspiritclothings@gmail.com" },
              { i: FiPhone, t: "PHONE", v: "+917397284491" },
            ].map(({ i: Icon, t, v }, k) => (
              <div
                key={k}
                className="border border-black/10 p-6 flex items-start gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-[oklch(0.48_0.22_25)] text-white flex items-center justify-center shrink-0">
                  <Icon />
                </div>

                <div>
                  <p className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">
                    {t}
                  </p>

                  <p className="mt-1 text-lg">{v}</p>
                </div>
              </div>
            ))}

            <div className="aspect-[4/3] overflow-hidden border border-black/10">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=13.0827,80.2707&z=15&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-display text-4xl md:text-5xl">
            Frequent rites.
          </h2>

          <div className="mt-8 border-t border-black/10">
            {FAQ.map((f, i) => (
              <div key={i} className="border-b border-black/10">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full py-6 flex items-center justify-between text-left"
                >
                  <span className="text-display text-xl md:text-2xl">
                    {f.q}
                  </span>

                  <FiChevronDown
                    className={`transition-transform duration-500 ${
                      open === i
                        ? "rotate-180 text-[oklch(0.48_0.22_25)]"
                        : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-500 ${
                    open === i
                      ? "grid-rows-[1fr] opacity-100 pb-6"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-[oklch(0.35_0.01_20)] leading-relaxed">
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;