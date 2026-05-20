import { useNavigate } from "react-router-dom";
import AuthShell from "@/components/site/AuthShell";
import { useApp } from "@/context/AppContext";
import { signInWithGoogle } from "@/firebase";
import { FcGoogle } from "react-icons/fc";

function Register() {
  const nav = useNavigate();
  const { login } = useApp();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();

      const user = result.user; // Firebase user object

      login(user.email, user.displayName);

      nav("/account");
    } catch (err) {
      console.log("Google login error:", err);
    }
  };

  return (
    <AuthShell
      title="Join the house."
      subtitle="Sign in with Google to continue."
    >
      <div className="space-y-5">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 text-sm tracking-[0.2em] hover:opacity-90 transition"
        >
          <FcGoogle className="text-xl" />
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </AuthShell>
  );
}

export default Register;