import SignupForm from "@/app/(auth)/signup/signup-form";
import AuthLayout from "@/components/AuthLayout";
import ErrorPage from "@/components/ErrorPage";
import { SIGNUP_DISABLED } from "@/app/auth";

export const metadata = {
	title: "Sign Up | Yashraj Maher",
	description: "Create a new account",
};

export default function SignupPage() {
	if (SIGNUP_DISABLED) {
		return (
			<ErrorPage
				title="Sign Up Disabled"
				message="Account creation is currently disabled. Please sign in instead."
				backLink="/login"
				backText="Go to login"
			/>
		);
	}

	return (
		<AuthLayout>
			<SignupForm />
		</AuthLayout>
	);
}
