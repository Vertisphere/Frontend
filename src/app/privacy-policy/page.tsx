export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="mb-4">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
        <p className="mb-8">
          At Vertisphere Solution ("Company"), we are committed to protecting
          your privacy and safeguarding your data. This Privacy Policy explains
          how we collect, use, and share your information when you use Ordrport
          ("Application"), which integrates with Intuit APIs.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              User-Provided Data: Information you provide when signing up for or
              using the Application, including your QuickBooks account data.
            </li>
            <li>
              Automatically Collected Data: Data collected through the use of
              the Application, such as usage statistics, technical logs, and
              error reports.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Use of Data</h2>
          <p className="mb-4">We use your data to:</p>
          <ul className="list-disc pl-6">
            <li>
              Facilitate integration with QuickBooks and enhance your business
              processes.
            </li>
            <li>Improve the functionality and user experience of Ordrport.</li>
            <li>
              Comply with applicable laws and Intuit's Supplier Code of Conduct.
            </li>
          </ul>
        </section>

        {/* Additional sections */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
          <p className="mb-4">We may share your data with:</p>
          <ul className="list-disc pl-6">
            <li>
              Intuit Inc.: To facilitate the integration and functionality of
              Ordrport.
            </li>
            <li>
              Service Providers: Third-party vendors who assist in operating the
              Application.
            </li>
            <li>
              Legal Authorities: If required by law or to protect our rights.
            </li>
          </ul>
        </section>

        {/* Continue with remaining sections */}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
          <p>
            For questions about this Privacy Policy, please contact us at{" "}
            <a
              href="mailto:imran@vertisphere.io"
              className="text-blue-600 hover:underline"
            >
              imran@vertisphere.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
