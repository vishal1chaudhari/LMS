
import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Clock, Users } from "lucide-react";

// Mock course data
const ALL_COURSES = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science and programming.",
    instructor: "Dr. John Smith",
    duration: "8 weeks",
    students: 245,
    level: "Beginner",
    category: "Computer Science",
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    description: "Build your foundation in HTML, CSS, and JavaScript.",
    instructor: "Jane Doe",
    duration: "6 weeks",
    students: 189,
    level: "Beginner",
    category: "Web Development",
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    description: "Master essential computer science concepts for problem-solving.",
    instructor: "Prof. Alan Turing",
    duration: "10 weeks",
    students: 156,
    level: "Intermediate",
    category: "Computer Science",
  },
  {
    id: "4",
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and applications.",
    instructor: "Dr. Ada Lovelace",
    duration: "12 weeks",
    students: 134,
    level: "Intermediate",
    category: "Data Science",
  },
  {
    id: "5",
    title: "Mobile App Development with React Native",
    description: "Learn to build cross-platform mobile applications.",
    instructor: "Steve Jobs",
    duration: "8 weeks",
    students: 112,
    level: "Intermediate",
    category: "Mobile Development",
  },
  {
    id: "6",
    title: "Advanced Database Systems",
    description: "Deep dive into database design, optimization, and management.",
    instructor: "Dr. Edgar Codd",
    duration: "10 weeks",
    students: 78,
    level: "Advanced",
    category: "Database Systems",
  },
];

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

  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All Categories" || course.category === selectedCategory;
    
    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Container>
        <header className="mb-10 animate-slide-down">
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse all available courses and find the perfect match for your learning goals.
          </p>
        </header>

        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="input-base px-4 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="input-base px-4 py-2"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredCourses.length} of {ALL_COURSES.length} courses
            </p>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-6">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLevel("All Levels");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLevel("All Levels");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

const CourseCard = ({ course }: { course: typeof ALL_COURSES[0] }) => {
  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground mb-1">
          {course.category} • {course.level}
        </div>
        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.students} students
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </span>
          </div>
          <div className="font-medium text-foreground">
            Instructor: {course.instructor}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const CourseListItem = ({ course }: { course: typeof ALL_COURSES[0] }) => {
  return (
    <Card className="card-hover animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div className="p-4 flex-1">
          <div className="text-sm text-muted-foreground mb-1">
            {course.category} • {course.level}
          </div>
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-muted-foreground my-2">{course.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.students} students
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </span>
            <span>Instructor: {course.instructor}</span>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center md:border-l">
          <Button asChild>
            <Link to={`/courses/${course.id}`}>View Course</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Courses;
