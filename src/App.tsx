import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";
import ClassSelection from "./pages/ClassSelection";
import AppLayout from "./components/layouts/AppLayout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/timetable", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Timetable />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/class-selection",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ClassSelection />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/attendance",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Attendance />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/announcements",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Announcements />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;