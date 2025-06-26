import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/app/(auth)/login/login-form";

export const metadata = {
	title: "Sign In | Yashraj Maher",
	description: "Sign in to your account",
};

export default function LoginPage() {
	return (
		<AuthLayout>
			<LoginForm />
		</AuthLayout>
	);
}
