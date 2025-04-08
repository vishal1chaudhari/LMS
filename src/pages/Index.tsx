import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  Calendar, 
  BookUser
} from "lucide-react";
import TestConnection from "@/components/TestConnection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <Container>
            <div className="max-w-3xl mx-auto text-center animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                LMS Galaxy: Transforming Education
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                An innovative learning platform that connects students, instructors, and administrators seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="outline" className="h-12 px-8">
                  <Link to="/courses">Explore Courses</Link>
                </Button>
                <Button asChild size="lg" className="h-12 px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Test Connection Section */}
        <section className="py-12">
          <Container>
            <div className="max-w-md mx-auto">
              <TestConnection />
            </div>
          </Container>
        </section>

        {/* Key Features Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to succeed in your learning journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="h-10 w-10" />}
                title="Comprehensive Courses"
                description="Access a wide range of courses designed by industry experts and experienced educators."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Expert Instructors"
                description="Learn from professionals with real-world experience in their respective fields."
              />
              <FeatureCard
                icon={<UserCheck className="h-10 w-10" />}
                title="Interactive Learning"
                description="Engage with course content through quizzes, assignments, and interactive discussions."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10" />}
                title="Flexible Schedule"
                description="Learn at your own pace with 24/7 access to course materials and resources."
              />
              <FeatureCard
                icon={<BookUser className="h-10 w-10" />}
                title="Progress Tracking"
                description="Monitor your learning progress with detailed analytics and performance insights."
              />
            </div>
          </Container>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <Container>
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Ready to Unlock Your Potential?</h2>
              <p className="text-xl mb-8 text-primary-foreground/80">
                Join thousands of learners transforming their careers through continuous education.
              </p>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-12 px-8 bg-white text-primary hover:bg-white/90"
              >
                <Link to="/login">Sign In Now</Link>
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
              <BookOpen className="h-5 w-5" />
              <span className="font-semibold">LMS Galaxy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LMS Galaxy. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
