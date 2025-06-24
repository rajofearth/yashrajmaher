import SignupForm from "./signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Yashraj Maher",
  description: "Create a new account",
};

export default function SignupPage() {
  return <SignupForm />;
}