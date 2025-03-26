
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
import { Pencil, Plus, Trash2, Users, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Mock data
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    joinDate: "2023-04-15",
    enrolledCourses: 3,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    joinDate: "2023-05-22",
    enrolledCourses: 2,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    joinDate: "2023-06-10",
    enrolledCourses: 1,
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    joinDate: "2023-07-05",
    enrolledCourses: 4,
  },
];

const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    instructor: "Dr. John Smith",
    students: 24,
    createdAt: "2023-03-10",
    status: "Active",
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    instructor: "Jane Doe",
    students: 18,
    createdAt: "2023-04-05",
    status: "Active",
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    instructor: "Prof. Alan Turing",
    students: 15,
    createdAt: "2023-05-20",
    status: "Draft",
  },
  {
    id: "4",
    title: "Machine Learning Basics",
    instructor: "Dr. Ada Lovelace",
    students: 12,
    createdAt: "2023-06-15",
    status: "Active",
  },
];

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);

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

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      joinDate: new Date().toISOString().split("T")[0],
      enrolledCourses: 0,
    };
    
    setStudents([...students, newUser]);
    setAddUserDialogOpen(false);
    form.reset();
    
    toast({
      title: "Success",
      description: `User ${newUser.name} has been added.`,
    });
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newCourse = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get("title") as string,
      instructor: formData.get("instructor") as string,
      students: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Draft" as const,
    };
    
    setCourses([...courses, newCourse]);
    setAddCourseDialogOpen(false);
    form.reset();
    
    toast({
      title: "Success",
      description: `Course "${newCourse.title}" has been added.`,
    });
  };

  const handleDeleteUser = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been successfully removed.",
    });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast({
      title: "Course Deleted",
      description: "The course has been successfully removed.",
    });
  };

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your LMS portal, users, and courses.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={<Users className="h-6 w-6" />}
            description="Registered students"
          />
          <StatCard
            title="Total Courses"
            value={courses.length}
            icon={<BookOpen className="h-6 w-6" />}
            description="Available courses"
          />
        </div>

        <Tabs defaultValue="users" className="animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Users</CardTitle>
                  <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Add User</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account in the system.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUser}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>User Role</Label>
                            <div className="flex space-x-4">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="role-student"
                                  name="role"
                                  value="student"
                                  defaultChecked
                                  className="mr-2"
                                />
                                <Label htmlFor="role-student">Student</Label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="role-admin"
                                  name="role"
                                  value="admin"
                                  className="mr-2"
                                />
                                <Label htmlFor="role-admin">Admin</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAddUserDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Add User</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.joinDate}</TableCell>
                          <TableCell>{student.enrolledCourses}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteUser(student.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Courses</CardTitle>
                  <Dialog open={addCourseDialogOpen} onOpenChange={setAddCourseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Add Course</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                          Create a new course in the system.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCourse}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="Introduction to..."
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instructor">Instructor</Label>
                            <Input
                              id="instructor"
                              name="instructor"
                              placeholder="Dr. John Smith"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                              id="description"
                              name="description"
                              className="input-base min-h-24"
                              placeholder="Course description..."
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAddCourseDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Create Course</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.title}
                          </TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>{course.createdAt}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {course.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default Admin;
