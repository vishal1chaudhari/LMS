
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Mock course data
const ENROLLED_COURSES = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science and programming.",
    progress: 75,
    instructor: "Dr. John Smith",
    totalLessons: 12,
    completedLessons: 9,
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    description: "Build your foundation in HTML, CSS, and JavaScript.",
    progress: 40,
    instructor: "Jane Doe",
    totalLessons: 10,
    completedLessons: 4,
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    description: "Master essential computer science concepts for problem-solving.",
    progress: 20,
    instructor: "Prof. Alan Turing",
    totalLessons: 15,
    completedLessons: 3,
  },
];

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(ENROLLED_COURSES);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    // If user is admin, redirect to admin dashboard
    if (!isLoading && user?.role === "admin") {
      navigate("/admin");
      return;
    }

    // Simulate loading courses data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container>
        <header className="mb-10 animate-slide-down">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name}. Here's your learning progress.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Enrolled Courses" 
            value={enrolledCourses.length} 
            icon={<BookOpen className="h-6 w-6" />} 
            description="Total courses you're taking"
          />
          <StatCard 
            title="Total Hours" 
            value="45" 
            icon={<Clock className="h-6 w-6" />}
            description="Learning hours completed" 
          />
          <StatCard 
            title="Certificates" 
            value="1" 
            icon={<Award className="h-6 w-6" />}
            description="Earned achievements" 
          />
        </div>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Courses</h2>
            <Button asChild variant="outline">
              <a href="/courses">Browse More Courses</a>
            </Button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border animate-fade-in">
              <h3 className="text-xl font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Button asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  description: string; 
}) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CourseCard = ({ course }: { course: typeof ENROLLED_COURSES[0] }) => {
  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Instructor:</span>
            <span className="font-medium text-foreground">{course.instructor}</span>
          </div>
          <div className="flex justify-between">
            <span>Lessons:</span>
            <span className="font-medium text-foreground">
              {course.completedLessons} / {course.totalLessons}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={`/courses/${course.id}`}>Continue Learning</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;
