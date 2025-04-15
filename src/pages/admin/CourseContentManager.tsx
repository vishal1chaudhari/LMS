import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, FileText, Video, FileUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { courseService, Course } from "@/services/courseService";
import ModuleManager from "@/components/course/ModuleManager";
import LessonManager from "@/components/course/LessonManager";
import MaterialManager from "@/components/course/MaterialManager";

const CourseContentManager = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    // If user is not an admin, redirect to dashboard
    if (!isLoading && user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Fetch course details
    if (courseId) {
      fetchCourseDetails();
    }
  }, [user, isLoading, navigate, courseId]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await courseService.getCourse(courseId);
      setCourse(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch course details');
      toast({
        title: "Error",
        description: "Failed to fetch course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen pt-24">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-muted-foreground mb-6">{error || 'Course not found'}</p>
            <Button onClick={() => navigate('/admin')}>Back to Admin Dashboard</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Course Content Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              {course.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{course.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {course.level}
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {course.category}
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {course.duration}
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons" disabled={!selectedModuleId}>Lessons</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <ModuleManager 
              courseId={courseId!} 
              onModuleSelect={handleModuleSelect} 
            />
          </TabsContent>
          
          <TabsContent value="lessons" className="space-y-4">
            {selectedModuleId ? (
              <LessonManager 
                moduleId={selectedModuleId} 
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Please select a module to manage its lessons
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialManager courseId={courseId!} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default CourseContentManager; 