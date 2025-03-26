
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Mock course data
const COURSE_DETAILS = {
  id: "1",
  title: "Introduction to Computer Science",
  description:
    "This course provides a comprehensive introduction to computer science and programming. You'll learn fundamental concepts, problem-solving techniques, and basic programming skills. Through hands-on exercises and projects, you'll gain practical experience with algorithms, data structures, and software development principles.",
  instructor: "Dr. John Smith",
  instructorTitle: "Professor of Computer Science",
  instructorBio:
    "Dr. Smith has over 15 years of experience teaching computer science at leading universities. He specializes in algorithms and computational theory.",
  duration: "8 weeks",
  students: 245,
  level: "Beginner",
  category: "Computer Science",
  rating: 4.8,
  reviewCount: 125,
  lastUpdated: "June 15, 2023",
  modules: [
    {
      title: "Introduction to Computing",
      lessons: [
        "What is Computer Science?",
        "History of Computing",
        "Binary and Number Systems",
        "Computing Hardware and Software",
      ],
      duration: "1 week",
    },
    {
      title: "Programming Fundamentals",
      lessons: [
        "Variables and Data Types",
        "Control Structures",
        "Functions and Methods",
        "Basic Input and Output",
      ],
      duration: "2 weeks",
    },
    {
      title: "Data Structures",
      lessons: [
        "Arrays and Lists",
        "Stacks and Queues",
        "Maps and Dictionaries",
        "Introduction to Algorithm Complexity",
      ],
      duration: "2 weeks",
    },
    {
      title: "Problem-Solving Techniques",
      lessons: [
        "Algorithmic Thinking",
        "Debugging Strategies",
        "Testing and Validation",
        "Documentation and Style",
      ],
      duration: "2 weeks",
    },
    {
      title: "Final Project",
      lessons: ["Project Planning", "Implementation", "Testing", "Presentation"],
      duration: "1 week",
    },
  ],
  learningOutcomes: [
    "Understand fundamental computer science concepts",
    "Write basic programs to solve computational problems",
    "Apply algorithmic thinking to break down complex problems",
    "Analyze and implement simple data structures",
    "Debug and test software systematically",
  ],
  prerequisites: [
    "Basic computer literacy",
    "No prior programming experience required",
    "High school mathematics",
  ],
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<typeof COURSE_DETAILS | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch course details
    const timer = setTimeout(() => {
      setCourse(COURSE_DETAILS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll in this course.",
        variant: "destructive",
      });
      return;
    }

    setEnrolled(true);
    toast({
      title: "Enrollment Successful",
      description: `You have been enrolled in ${course?.title}.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container>
        <Link
          to="/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.level}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.students} students
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {course.lastUpdated}
              </span>
            </div>

            <p className="text-foreground mb-8">{course.description}</p>

            <Tabs defaultValue="content" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <div className="border rounded-lg overflow-hidden">
                  <Accordion type="multiple" className="w-full">
                    {course.modules.map((module, index) => (
                      <AccordionItem key={index} value={`module-${index}`}>
                        <AccordionTrigger className="px-4 py-3 hover:bg-secondary/50">
                          <div className="flex justify-between w-full text-left items-center pr-4">
                            <div>
                              <span className="font-medium">
                                Module {index + 1}: {module.title}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons • {module.duration}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0">
                          <div className="bg-secondary/30 py-1">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="px-6 py-3 border-b last:border-b-0 flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">
                                    {lessonIndex + 1}. {lesson}
                                  </span>
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {enrolled ? (
                                    <Link
                                      to="#"
                                      className="text-primary hover:underline"
                                    >
                                      Start
                                    </Link>
                                  ) : (
                                    "Locked"
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent value="outcomes">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    What You'll Learn
                  </h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mt-8 mb-4">
                    Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="instructor">
                <div className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold flex-shrink-0">
                      {course.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{course.instructor}</h3>
                      <p className="text-muted-foreground mb-4">{course.instructorTitle}</p>
                      <p>{course.instructorBio}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="animate-fade-in">
            <div className="sticky top-24 border rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="text-3xl font-bold mb-4">Free</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Full course access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>24/7 support</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full py-6 text-base"
                  onClick={handleEnroll}
                  disabled={enrolled}
                >
                  {enrolled ? "Already Enrolled" : "Enroll Now"}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  30-day satisfaction guarantee
                </div>
              </div>
              
              <div className="bg-secondary/50 p-6 border-t">
                <h3 className="font-semibold mb-4">This course includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                    <span>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} on-demand lessons</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                    <span>{course.duration} of content</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CourseDetail;
