import SignupForm from "@/app/(auth)/signup/signup-form";
import AuthLayout from "@/components/AuthLayout";

export const metadata = {
	title: "Sign Up | Yashraj Maher",
	description: "Create a new account",
};

export default function SignupPage() {
	return (
		<AuthLayout>
			<SignupForm />
		</AuthLayout>
	);
}
