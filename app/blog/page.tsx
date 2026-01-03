export default function BlogPage() {
    return (
      <main className="min-h-screen pt-32 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            GO SOLO Blog
          </h1>
  
          <p className="mt-6 text-gray-300">
            Insights on performance, focus, recovery, gaming, and modern hustle.
          </p>
  
          <div className="mt-10 space-y-6">
            {/* Static placeholders for v1 */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold">
                Why Clean Energy Beats Energy Drinks
              </h2>
              <p className="mt-2 text-gray-400">
                Understanding crashes, stimulants, and sustainable focus.
              </p>
            </div>
  
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold">
                Late-Night Focus: How to Stay Sharp Without Burnout
              </h2>
              <p className="mt-2 text-gray-400">
                Productivity tips for gamers, coders, and students.
              </p>
            </div>
          </div>
  
          <p className="mt-10 text-sm text-gray-500">
            More articles coming soon.
          </p>
        </div>
      </main>
    );
  }
  