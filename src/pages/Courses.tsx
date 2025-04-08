import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Award } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { courseService, Course } from "@/services/courseService";
import { toast } from "@/components/ui/use-toast";

const CATEGORIES = [
  "All Categories",
  "Computer Science",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Database Systems",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All Categories" || course.category === selectedCategory;
    
    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
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
    <div className="min-h-screen pt-24 pb-12">
      <Container>
        <header className="mb-10 animate-slide-down">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground mt-2">
            Browse and enroll in our wide range of courses.
          </p>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedLevel}
            onValueChange={setSelectedLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {course.students} students
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Award className="h-4 w-4 mr-2" />
                    {course.level}
                  </div>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link to={`/courses/${course._id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Courses;
