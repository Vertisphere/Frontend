export default function EULAPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-8">
          End User License Agreement (EULA)
        </h1>
        <p className="mb-4">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
        <p className="mb-8">
          This End User License Agreement ("Agreement") is a legal agreement
          between you ("User") and Vertisphere Solution ("Company") for the use
          of Ordrport ("Application"), which integrates with Intuit APIs. By
          accessing or using the Application, you agree to be bound by the terms
          of this Agreement.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. License Grant</h2>
          <p className="mb-4">
            Vertisphere Solution grants you a non-exclusive, non-transferable,
            revocable license to use Ordrport solely for the purposes of
            enhancing, streamlining, or improving your QuickBooks experience, or
            facilitating a business process in compliance with the Intuit API
            guidelines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Restrictions</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6">
            <li>
              Modify, reverse-engineer, or create derivative works of the
              Application.
            </li>
            <li>
              Use the Application for any purpose other than those explicitly
              permitted by this Agreement.
            </li>
            <li>
              Violate any applicable laws or third-party rights while using the
              Application.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Use of Intuit APIs</h2>
          <p className="mb-4">
            Ordrport integrates with Intuit APIs to enhance your QuickBooks
            experience. You must comply with all applicable terms and policies
            of Intuit, including their Supplier Code of Conduct and API
            guidelines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Data Handling</h2>
          <p className="mb-4">
            Ordrport may sync, transfer, or process your QuickBooks data to
            facilitate your business processes. By using the Application, you
            consent to such actions in accordance with our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Disclaimer</h2>
          <p className="mb-4">
            The Application is provided "as is" without warranties of any kind.
            Vertisphere Solution disclaims all liability for damages arising
            from your use of the Application or your reliance on its
            functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
          <p className="mb-4">
            Vertisphere Solution may terminate this Agreement at any time if you
            breach its terms or violate applicable laws. Upon termination, you
            must cease all use of the Application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
          <p className="mb-4">
            This Agreement is governed by the laws of Ontario, Canada, excluding
            its conflicts of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
          <p>
            For any questions about this Agreement, please contact us at{" "}
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
