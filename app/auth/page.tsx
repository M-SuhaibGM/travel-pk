import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  return (
    // Set a deep, slate-gray background for the whole page (from the fence tones)
    <div className="grid min-h-svh lg:grid-cols-2 bg-slate-900/50">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-white">
            {/* Brand Icon Color: Use the bronze/rust tone from the lock 
              to match 'primary-foreground' below 
            */}
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#c2a16d] text-slate-900">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SmartDoc AI.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side: Show your combination lock image.
        We add a subtle 'brightness' adjustment to desaturate it 
        slightly so it doesn't distract from the form.
      */}
      <div className="relative hidden lg:block border-l border-slate-700">
        <img
          src="/background.jpg" // Replace with your actual image path
          alt="Secure Combination Lock on Fence"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.85]"
        />
        {/* Adds a slight gradient overlay to merge with the left side better */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/40 to-transparent" />
      </div>
    </div>
  )
}