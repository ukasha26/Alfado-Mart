import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F3F4F6] border-t border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-black uppercase">
              Alfado Mart
            </h2>
            <p className="mt-3 text-sm text-[#2A2A2A] leading-relaxed max-w-sm">
              Modern online shopping with quick checkout, secure contact options,
              and customer support for your orders.
            </p>
          </div>

          <div id="contact">
            <h3 className="text-sm font-semibold tracking-wider text-black uppercase">
              Contact & Social
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#2A2A2A]">
              <a
                href="mailto:alfadomart2003@gmail.com"
                className="inline-flex min-w-0 items-center gap-2 break-all transition-colors hover:text-black"
              >
                <Mail size={16} />
                alfadomart2003@gmail.com
              </a>
              <a
                href="https://www.instagram.com/alfadomart.store/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-black transition-colors"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590013257873"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-black transition-colors"
              >
                <Facebook size={16} />
                Facebook
              </a>
              <a
                href="https://wa.me/923346605354?text=Hello%20Alfado%20Mart%2C%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-black transition-colors"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                WhatsApp
              </a>
            </div>
          </div>

          <div id="privacy-policy">
            <h3 className="text-sm font-semibold tracking-wider text-black uppercase">
              Privacy Policy
            </h3>
            <p className="mt-3 text-sm text-[#2A2A2A] leading-relaxed">
              We only use the details you share to process orders, contact you
              about delivery, and improve customer support. Your information is
              not sold and is only shared with trusted services needed to fulfill
              your order.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-[#E5E7EB] flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-center md:text-left">
          <p className="text-[11px] md:text-xs text-[#2A2A2A] font-normal">
            &copy; 2026 ALFADO MART. All rights reserved.
          </p>
          <p className="text-[11px] md:text-xs text-[#2A2A2A] font-normal">
            Developed with care
          </p>
        </div>
      </div>
    </footer>
  );
}
