import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
} from "@mui/material";
import LabList from "./components/LabList.jsx";
import LabDetails from "./components/LabDetails.jsx";
import SpecialOps from "./components/SpecialOps.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useEffect } from "react";

export default function App() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;
    const path = location.pathname ?? "";
    const isAuthPage =
      path.startsWith("/login") || path.startsWith("/register");
    if (!isAuthPage) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [user, loading, location, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LabWork Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            List
          </Button>
          <Button color="inherit" component={Link} to="/special">
            Special Ops
          </Button>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ color: "secondary.main" }}>
                  {user.username} ({user.role})
                </Typography>
                <Button color="inherit" onClick={logout} disabled={loading}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Войти
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Регистрация
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Routes>
            <Route path="/" element={<LabList />} />
            <Route path="/lab/:id" element={<LabDetails />} />
            <Route
              path="/special"
              element={
                <ProtectedRoute>
                  <SpecialOps />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
