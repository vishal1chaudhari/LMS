
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Laptop, BookOpen, Users, Layout } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <Container>
            <div className="max-w-3xl mx-auto text-center animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                The Modern Learning Management System
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Streamlined education platform for students and administrators.
                Simple, intuitive, and designed with purpose.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Designed for Learning</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform focuses on what matters most - the educational experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="h-10 w-10" />}
                title="Comprehensive Courses"
                description="Access a wide range of well-structured courses designed to maximize learning outcomes."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="User Management"
                description="Administrators can easily manage students, instructors, and course enrollments."
              />
              <FeatureCard
                icon={<Layout className="h-10 w-10" />}
                title="Intuitive Dashboard"
                description="Clean, focused dashboards that provide just what you need without unnecessary complexity."
              />
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <Container>
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Learning?</h2>
              <p className="text-xl mb-8 text-primary-foreground/80">
                Join our platform today and experience education designed with purpose.
              </p>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-12 px-8 bg-white text-primary hover:bg-white/90"
              >
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Laptop className="h-5 w-5" />
              <span className="font-semibold">LMS Portal</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LMS Portal. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 animate-fade-in card-hover">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
