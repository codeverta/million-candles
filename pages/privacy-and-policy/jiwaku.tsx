import Layout from "components/layout/Landing";
import Head from "next/head";
import { marked } from "marked";

const text = marked.parse(`

## Privacy Policy for Souvenir Lilin

**Effective Date**: 20-11-2024

Welcome to Souvenir Lilin! Your privacy is critically important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App"). Please read this Privacy Policy carefully to understand our practices regarding your information.

### 1. **Information We Collect**

We collect the following types of information:

#### a. **Personal Information**
- Name, email address, and profile information you provide during registration.
- Health and wellness data, including mood tracking, journal entries, and meditation preferences.

#### b. **Usage Data**
- Information about your interactions with the App, such as feature usage, session duration, and crash reports.
- Device information, including operating system, device model, and unique device identifiers.

#### c. **Location Information**
- Approximate location data (if permitted by your device settings) for features that require location, such as wellness suggestions based on time zones.

#### d. **Cookies and Similar Technologies**
- We may use cookies and other tracking technologies to enhance your experience and analyze app usage.

---

### 2. **How We Use Your Information**

We use the information we collect to:
- Provide, personalize, and improve the App’s features.
- Enable mood and wellness tracking functionality.
- Send notifications and reminders for meditation or other activities.
- Conduct analytics to understand user behavior and improve our services.
- Communicate with you regarding updates, changes, or promotional content (you can opt out at any time).

---

### 3. **How We Share Your Information**

We do not sell, trade, or rent your personal information. However, we may share your information in the following circumstances:

#### a. **With Service Providers**
- Third-party vendors who assist in delivering the App’s functionality, such as cloud storage or analytics tools.

#### b. **For Legal Obligations**
- To comply with legal requirements or protect the rights, property, or safety of Souvenir Lilin, our users, or others.

#### c. **With Your Consent**
- If we intend to share your information for other purposes, we will seek your explicit consent.

---

### 4. **Your Rights and Choices**

Depending on your location, you may have the following rights regarding your information:

#### a. **Access and Correction**
- You can view and update your personal information in the App settings.

#### b. **Data Portability**
- Request a copy of your data in a machine-readable format.

#### c. **Data Deletion**
- You can request the deletion of your personal information by contacting us at [Insert Support Email].

#### d. **Opt-Out**
- Opt out of notifications or data collection by changing your settings in the App or your device.

---

### 5. **Data Retention**

We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy, or as required by law. If you deactivate your account, we will delete your data within [Insert Timeframe].

---

### 6. **Data Security**

We implement appropriate technical and organizational measures to protect your data against unauthorized access, disclosure, alteration, or destruction. These measures include:
- Encryption of sensitive data.
- Secure servers and firewalls.
- Regular security audits.

Despite our efforts, no system is completely secure, and we cannot guarantee the absolute security of your data.

---

### 7. **Children's Privacy**

Souvenir Lilin is not intended for individuals under the age of 13 (or equivalent minimum age in your jurisdiction). We do not knowingly collect personal information from children. If we discover that we have inadvertently collected such information, we will delete it promptly.

---

### 8. **Third-Party Links**

The App may include links to third-party websites or services. We are not responsible for the privacy practices of these third parties. Please review their privacy policies before engaging with them.

---

### 9. **International Data Transfers**

If you are accessing the App from outside Indonesia, please note that your information will be transferred to and processed in Indonesia, where privacy laws may not be as comprehensive as those in your jurisdiction.

---

### 10. **Changes to This Privacy Policy**

We may update this Privacy Policy from time to time. Changes will be posted in the App, and the "Effective Date" will be revised. We encourage you to review this policy periodically.

---

### 11. **Contact Us**

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:  
`);

function About() {
  return (
    <>
      <div className="w-screen dark:bg-gray-900 bg-white text-gray-600 dark:text-white">
        <article
          className="  dark:prose-headings:text-white prose-p:text-gray-400 py-32 prose prose-xl m-auto"
          dangerouslySetInnerHTML={{ __html: text }}
        ></article>
      </div>
    </>
  );
}

About.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default About;
