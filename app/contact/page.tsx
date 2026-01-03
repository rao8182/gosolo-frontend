export default function ContactPage() {
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            Contact Us
          </h1>
  
          <p className="mt-6 text-gray-300">
            Have questions, feedback, or need support? We’ve got you.
          </p>
  
          <div className="mt-8 space-y-4 text-gray-400">
            <p>
              📧 Email:{" "}
              <span className="text-white">support@gosolo.in</span>
            </p>
            <p>
              📍 Location: India
            </p>
          </div>
  
          <div className="mt-10 p-6 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-300">
              We usually respond within 24 hours on business days.
            </p>
          </div>
        </div>
      </main>
    );
  }
  