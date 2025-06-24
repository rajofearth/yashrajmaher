import LoginForm from "./login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Your App",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return <LoginForm />;
}