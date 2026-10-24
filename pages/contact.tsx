import Layout from "components/layout/Landing";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import {
  buildBusinessWhatsAppLink,
  buildContactInquiryWhatsAppMessage,
  buildSegmentedInquiryMessage,
} from "utils/whatsapp.cjs";
import {
  trackContactFormMailerAccepted,
  trackContactFormSubmitAttempt,
  trackWhatsAppClick,
} from "lib/gtag";
import { deliverContactInquiry } from "utils/contact-inquiry.cjs";

function Contact() {
  const { t, i18n } = useTranslation("common");
  const inquiryLocale = i18n.language?.startsWith("en") ? "en" : "id";
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    segment: "" | "shop" | "church";
    website: string;
  }>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    segment: "",
    website: "",
  });
  const errorSegment =
    formState.segment === "shop" || formState.segment === "church"
      ? formState.segment
      : null;
  const whatsappInquiryHref = errorSegment
    ? buildBusinessWhatsAppLink(
        buildContactInquiryWhatsAppMessage(formState, inquiryLocale)
      )
    : "#contact-form";
  const [formStatus, setFormStatus] = useState({
    state: "idle" as "idle" | "sending" | "success" | "error",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formStatus.state !== "sending") {
      setFormStatus({ state: "idle", message: "" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submittedForm = { ...formState };
    const segment = submittedForm.segment;
    if (segment !== "shop" && segment !== "church") return;

    setFormStatus({
      state: "sending",
      message:
        inquiryLocale === "en" ? "Sending your inquiry…" : "Mengirim inquiry…",
    });

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BASE_API ||
        "https://api.souvenirlilin.id/api/v1";
      await deliverContactInquiry({
        apiBaseUrl,
        inquiry: submittedForm,
        onAttempt: trackContactFormSubmitAttempt,
        onAccepted: trackContactFormMailerAccepted,
      });
      setFormStatus({
        state: "success",
        message:
          inquiryLocale === "en"
            ? "Your inquiry was accepted by our email server. We will follow up soon."
            : "Inquiry Anda sudah diterima server email kami. Kami akan menindaklanjutinya.",
      });
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        segment: "",
        website: "",
      });
    } catch (_error) {
      setFormStatus({
        state: "error",
        message:
          inquiryLocale === "en"
            ? "We could not send your inquiry. Please retry or use WhatsApp below."
            : "Inquiry belum terkirim. Silakan coba lagi atau hubungi kami melalui WhatsApp di bawah.",
      });
    }
  };

  const handleWhatsAppInquiryClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (formStatus.state === "sending") {
      e.preventDefault();
      return;
    }

    const form = e.currentTarget.closest("form");
    if (!form?.reportValidity()) {
      e.preventDefault();
      return;
    }

    if (errorSegment) {
      trackWhatsAppClick(errorSegment, "contact-form");
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <Head>
        <title>
          {t(
            "contact.page_title",
            "Contact Us | Handcrafted Indonesian Candles"
          )}
        </title>
        <meta
          name="description"
          content={t(
            "contact.meta_description",
            "Get in touch with our team for inquiries, custom orders, or to learn more about our handcrafted candles."
          )}
        />
      </Head>

      {/* Hero Section */}
      <motion.div
        className="w-full bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-100"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 dark:text-amber-400 mb-4">
              {t("contact.hero_title", "Contact Us")}
            </h1>
            <div className="h-1 w-24 bg-amber-500 rounded mb-6"></div>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              {t(
                "contact.hero_subtitle",
                "We'd love to hear from you. Get in touch with our team for any questions, custom orders, or feedback."
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-full bg-white dark:bg-gray-800 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-1"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-6">
                  {t("contact.info_title", "Get In Touch")}
                </h2>

                {/* Contact Details */}
                <div className="space-y-6">
                  {/* WhatsApp */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        WhatsApp
                      </p>
                      <a
                        href={buildBusinessWhatsAppLink(
                          inquiryLocale === "en"
                            ? "Hello, I have a question about your candles."
                            : "Halo, saya ingin bertanya tentang produk lilin."
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackWhatsAppClick("unclassified", "contact-info")
                        }
                        className="text-base text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        +62 815-7895-6156
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {t("contact.phone_label", "Phone")}
                      </p>
                      <a
                        href="tel:+6281578956156"
                        className="text-base text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        +62 815-7895-6156
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-6">
                  {t("contact.form_title", "Send Us a Message")}
                </h2>

                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <p className="mb-3 font-medium text-amber-900 dark:text-amber-100">
                    {inquiryLocale === "en"
                      ? "Choose the buyer path that fits you:"
                      : "Pilih jalur inquiry yang sesuai:"}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={buildBusinessWhatsAppLink(
                        buildSegmentedInquiryMessage("shop", inquiryLocale)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("shop", "contact")}
                      className="rounded-lg bg-green-700 px-4 py-3 text-center font-medium text-white hover:bg-green-800"
                    >
                      {inquiryLocale === "en"
                        ? "I represent a religious-supply shop"
                        : "Saya mewakili toko perlengkapan ibadah"}
                    </a>
                    <a
                      href={buildBusinessWhatsAppLink(
                        buildSegmentedInquiryMessage("church", inquiryLocale)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("church", "contact")}
                      className="rounded-lg bg-green-700 px-4 py-3 text-center font-medium text-white hover:bg-green-800"
                    >
                      {inquiryLocale === "en"
                        ? "I represent a church"
                        : "Saya mewakili gereja"}
                    </a>
                  </div>
                </div>

                {formStatus.message ? (
                  <div
                    role={formStatus.state === "error" ? "alert" : "status"}
                    aria-live="polite"
                    className={`mb-6 rounded-lg p-4 ${
                      formStatus.state === "error"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : formStatus.state === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
                    }`}
                  >
                    <p>{formStatus.message}</p>
                    {formStatus.state === "error" && errorSegment ? (
                      <a
                        href={buildBusinessWhatsAppLink(
                          buildSegmentedInquiryMessage(
                            errorSegment,
                            inquiryLocale
                          )
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackWhatsAppClick(
                            errorSegment,
                            "contact-form-fallback"
                          )
                        }
                        className="mt-3 inline-flex rounded-lg bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
                      >
                        {inquiryLocale === "en"
                          ? "Continue with WhatsApp"
                          : "Lanjutkan lewat WhatsApp"}
                      </a>
                    ) : null}
                  </div>
                ) : null}

                <form
                  id="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <fieldset
                    disabled={formStatus.state === "sending"}
                    className="space-y-6 disabled:opacity-70"
                  >
                    <input
                      type="text"
                      name="website"
                      value={formState.website}
                      onChange={handleChange}
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="hidden"
                    />
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {t("contact.form.name_label", "Full Name")}*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          maxLength={120}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={t(
                            "contact.form.name_placeholder",
                            "Your name"
                          )}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {t("contact.form.email_label", "Email Address")}*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          maxLength={254}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={t(
                            "contact.form.email_placeholder",
                            "your.email@example.com"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="segment"
                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {inquiryLocale === "en"
                          ? "I represent"
                          : "Saya mewakili"}
                        *
                      </label>
                      <select
                        id="segment"
                        name="segment"
                        value={formState.segment}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="" disabled>
                          {inquiryLocale === "en"
                            ? "Choose one"
                            : "Pilih salah satu"}
                        </option>
                        <option value="shop">
                          {inquiryLocale === "en"
                            ? "Religious-supply shop"
                            : "Toko perlengkapan ibadah"}
                        </option>
                        <option value="church">
                          {inquiryLocale === "en" ? "Church" : "Gereja"}
                        </option>
                      </select>
                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {t("contact.form.phone_label", "Phone Number")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          maxLength={30}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={t(
                            "contact.form.phone_placeholder",
                            "+62-xxx-xxxx"
                          )}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {t("contact.form.subject_label", "Subject")}*
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          maxLength={120}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={t(
                            "contact.form.subject_placeholder",
                            "How can we help?"
                          )}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("contact.form.message_label", "Message")}*
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        maxLength={2000}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t(
                          "contact.form.message_placeholder",
                          "Your message here..."
                        )}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <a
                        href={whatsappInquiryHref}
                        onClick={handleWhatsAppInquiryClick}
                        aria-disabled={formStatus.state === "sending"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-green-700 px-6 py-3 text-center font-medium text-white shadow-md transition hover:bg-green-800"
                      >
                        {inquiryLocale === "en"
                          ? "Open WhatsApp to send"
                          : "Buka WhatsApp untuk mengirim"}
                      </a>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                      >
                        {inquiryLocale === "en"
                          ? formStatus.state === "sending"
                            ? "Sending…"
                            : formStatus.state === "error"
                            ? "Retry sending"
                            : "Send Message"
                          : formStatus.state === "sending"
                          ? "Mengirim…"
                          : formStatus.state === "error"
                          ? "Coba kirim lagi"
                          : "Kirim Pesan"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {inquiryLocale === "en"
                        ? "WhatsApp opens with your details filled in. Tap Send in WhatsApp to deliver the inquiry."
                        : "WhatsApp akan terbuka dengan detail terisi. Tekan Kirim di WhatsApp untuk mengirim inquiry."}
                    </p>
                  </fieldset>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="w-full bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-amber-800 dark:text-amber-400">
            {inquiryLocale === "en"
              ? "Questions about products or ordering?"
              : "Ada pertanyaan tentang produk atau pemesanan?"}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {inquiryLocale === "en"
              ? "Tell us whether you represent a religious-supply shop or a church, which products you are considering, and what information you need."
              : "Ceritakan apakah Anda mewakili toko perlengkapan ibadah atau gereja, produk yang sedang dipertimbangkan, dan informasi yang dibutuhkan."}
          </p>
        </div>
      </section>
    </>
  );
}

Contact.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps({ locale = "id" }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

export default Contact;
