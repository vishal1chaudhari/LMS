import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2, Users, BookOpen, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { courseService, Course } from "@/services/courseService";
import StudentRegistration from "@/components/admin/StudentRegistration";

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
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

    // Fetch courses
    fetchCourses();
  }, [user, isLoading, navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const newCourse = {
        title: formData.get("title") as string,
        instructor: formData.get("instructor") as string,
        description: formData.get("description") as string,
        duration: formData.get("duration") as string,
        level: formData.get("level") as Course['level'],
        category: formData.get("category") as string,
        status: "Draft" as const,
        students: 0,
      };
      
      await courseService.createCourse(newCourse);
      await fetchCourses(); // Refresh the courses list
      setAddCourseDialogOpen(false);
      form.reset();
      
      toast({
        title: "Success",
        description: `Course "${newCourse.title}" has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await courseService.deleteCourse(id);
      await fetchCourses(); // Refresh the courses list
      toast({
        title: "Success",
        description: "Course has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchCourses}>Retry</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Courses"
            value={courses.length}
            icon={<BookOpen className="h-6 w-6" />}
            description="Active courses in the system"
          />
          <StatCard
            title="Total Students"
            value={0}
            icon={<Users className="h-6 w-6" />}
            description="Enrolled students"
          />
          <StatCard
            title="Total Revenue"
            value={0}
            icon={<Users className="h-6 w-6" />}
            description="Total revenue from courses"
          />
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Courses</h2>
              <Dialog open={addCourseDialogOpen} onOpenChange={setAddCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>
                      Create a new course in the LMS portal.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCourse}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input id="instructor" name="instructor" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" name="duration" required />
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <select
                          id="level"
                          name="level"
                          className="w-full p-2 border rounded"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" required />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="submit">Add Course</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>{course.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Students</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Register New Student</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentRegistration />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Student management functionality coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Admin;
