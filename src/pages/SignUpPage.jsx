import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-[#f4ede1] px-6 py-28 text-[#2b2117]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="reveal-scroll max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Get started</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Create your account first</h1>
          <p className="mt-5 text-base leading-relaxed text-[#5a4737]">
            Sign up to unlock GEN and Showcase. After registration, you can generate, preview, and export components.
          </p>
        </div>

        <div className="fluid-panel reveal-scroll reveal-late p-4">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/gen" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
