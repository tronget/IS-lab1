import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await register({ username: form.username, password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Не удалось зарегистрироваться";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            Регистрация
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
            helperText="Минимум 6 символов"
          />
          <TextField
            name="confirm"
            label="Повторите пароль"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            Создать аккаунт
          </Button>
          <Typography variant="body2" textAlign="center">
            Уже есть аккаунт? <Link to="/login">Войдите</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
