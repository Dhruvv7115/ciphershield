import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with CipherShield for cybersecurity services and consultations.",
};

export default function ContactPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
            <p className="mt-4 text-lg text-slate-400">
              Have questions about our services? Our security experts are ready to help.
            </p>
            <div className="mt-12 space-y-6">
              {[
                { icon: Mail, label: "Email", value: "contact@ciphershield.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Office", value: "San Francisco, CA" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Icon className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-xl font-semibold text-white">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}