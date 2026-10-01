import { Link } from "react-router";
import { Phone } from "lucide-react";

/* Shared CTA strip reused by both service hubs */
export default function ServiceCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-[#1b5e20] rounded-3xl px-8 py-12 text-white text-center">
      <h3 className="text-2xl font-extrabold mb-3">{title}</h3>
      <p className="text-green-100 mb-7 max-w-xl mx-auto">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/contact"
          className="bg-white text-green-800 font-bold px-7 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm"
        >
          Talk to an advisor
        </Link>
        <a
          href="tel:+2348000000000"
          className="border-2 border-white/70 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm inline-flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" /> +234 800 000 0000
        </a>
      </div>
    </div>
  );
}