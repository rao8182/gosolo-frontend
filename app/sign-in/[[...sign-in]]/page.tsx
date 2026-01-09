import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#1a1a1a] border border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-white/5 border-white/20 text-white",
              formButtonPrimary: "bg-primary hover:bg-orange-600 text-black",
              footerActionLink: "text-primary hover:text-orange-600",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-primary",
            },
          }}
        />
      </div>
    </main>
  );
}
