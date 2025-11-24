import { useCallback, useEffect, useRef, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tooltip,
  LinearProgress,
  Alert,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HistoryIcon from "@mui/icons-material/History";
import { importApi } from "../api/index.js";
import { formatDateTime } from "../utils/formatters.js";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_COLOR = {
  SUCCESS: "success",
  FAILED: "error",
  STARTED: "info",
};

export default function ImportHistory() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    setError(null);
    importApi
      .history(page, rowsPerPage)
      .then((r) => {
        const data = r?.data;
        setItems(data?.content ?? []);
        setTotal(data?.totalElements ?? 0);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err?.response?.data?.message || "Не удалось загрузить историю импорта"
        );
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [fetchHistory, user]);

  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    setSelectedFile(file || null);
    setError(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    importApi
      .upload(selectedFile)
      .then(() => {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchHistory();
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message || "Не удалось запустить импорт");
      })
      .finally(() => setUploading(false));
  };

  const renderStatus = (row) => {
    const status = row?.status ?? "-";
    const chip = (
      <Chip
        size="small"
        label={status}
        color={STATUS_COLOR[status] ?? "default"}
        variant="outlined"
      />
    );

    if (status === "FAILED" && row?.errorMessage) {
      return <Tooltip title={row.errorMessage}>{chip}</Tooltip>;
    }
    return chip;
  };

  if (!user) {
    return (
      <Paper sx={{ p: 3, mt: 2 }} elevation={3}>
        <Alert severity="info">
          Чтобы просматривать историю импорта и загружать файлы, выполните вход.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }} elevation={3}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <HistoryIcon color="action" />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          История импорта
        </Typography>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? selectedFile.name : "Выбрать файл"}
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          Запустить
        </Button>
        <IconButton onClick={fetchHistory} disabled={loading} color="primary">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: "relative" }}>
        {loading && (
          <LinearProgress
            sx={{ position: "absolute", top: -8, left: 0, right: 0 }}
          />
        )}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={80}>ID</TableCell>
                <TableCell width={140}>Статус</TableCell>
                <TableCell width={180}>Пользователь</TableCell>
                <TableCell width={160}>Файл</TableCell>
                <TableCell width={160}>Добавлено</TableCell>
                <TableCell width={180}>Создана</TableCell>
                <TableCell width={180}>Завершена</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    История пуста.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{renderStatus(row)}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.fileName || "-"}</TableCell>
                    <TableCell>
                      {row.status === "SUCCESS" ? row.insertedRecords : "—"}
                    </TableCell>
                    <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(row.finishedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        component="div"
        page={page}
        count={total}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
