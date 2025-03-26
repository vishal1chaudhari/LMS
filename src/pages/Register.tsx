
import Container from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";

const Register = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container className="flex flex-col items-center justify-center">
        <LoginForm isRegister />
      </Container>
    </div>
  );
};

export default Register;
