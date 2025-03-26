
import Container from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container className="flex flex-col items-center justify-center">
        <LoginForm />
      </Container>
    </div>
  );
};

export default Login;
