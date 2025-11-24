import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Неверное имя или пароль";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            Вход в систему
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            name="username"
            label="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
          />
          <TextField
            name="password"
            label="Пароль"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            Войти
          </Button>
          <Typography variant="body2" textAlign="center">
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
