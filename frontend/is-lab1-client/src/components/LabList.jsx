import { useEffect, useState, useCallback, useMemo } from "react";
import { labApi, subscribeToWs } from "../api";
import {
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import LabForm from "./LabForm";

function getNested(obj, path) {
  if (!path) return undefined;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

export default function LabList() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterField, setFilterField] = useState("name");
  const [filterValue, setFilterValue] = useState("");
  const [sort, setSort] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    labApi
      .list(paginationModel.page, paginationModel.pageSize)
      .then((r) => {
        setItems(r.data.content || []);
        setTotal(r.data.totalElements || 0);
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to load list");
      })
      .finally(() => setLoading(false));
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    const unsub = subscribeToWs((msg) => {
      // msg can be an object (labwork) or a string like 'deleted:ID'
      if (typeof msg === "string" && msg.startsWith("deleted:")) {
        const id = Number(msg.replace("deleted:", ""));
        setItems((prev) => prev.filter((i) => i.id !== id));
        return;
      }

      const lw = msg;
      setItems((prev) => {
        const exists = prev.find((p) => p.id === lw.id);
        if (exists) return prev.map((p) => (p.id === lw.id ? lw : p));
        return [...prev, lw];
      });
    });
    return unsub;
  }, []);

  const processedItems = useMemo(() => {
    let result = items.slice();
    if (filterValue) {
      result = result.filter((it) => {
        const val = getNested(it, filterField);
        return val != null && String(val) === String(filterValue);
      });
    }
    if (sort) {
      const [field, dir] = sort.split(",");
      result.sort((a, b) => {
        const va = getNested(a, field);
        const vb = getNested(b, field);
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        if (va < vb) return dir === "asc" ? -1 : 1;
        if (va > vb) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [items, filterField, filterValue, sort]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setDialogOpen(true);
  }
  function handleDelete(id) {
    if (!confirm("Delete?")) {
      return;
    }
    labApi
      .remove(id)
      .then(() => {
        alert("Delete successful");
      })
      .catch(() => alert("Delete failed"));
  }

  function handleSave(payload) {
    const action = editing
      ? labApi.update(editing.id, payload)
      : labApi.create(payload);
    action
      .then(() => setDialogOpen(false))
      .catch((e) => {
        alert("Error: " + (e?.response?.data?.message || e.message));
      });
  }

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        return <Link to={`/lab/${params.row.id}`}>{params.value}</Link>;
      },
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
      valueGetter: (description) => description || "-",
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 140,
      valueGetter: (difficulty) => difficulty || "-",
    },
    {
      field: "minimalPoint",
      headerName: "Minimal Point",
      type: "number",
      width: 140,
      valueGetter: (minimalPoint) => minimalPoint || "-",
    },
    {
      field: "maximumPoint",
      headerName: "Maximum Point",
      type: "number",
      width: 150,
      valueGetter: (maximumPoint) => maximumPoint || "-",
    },
    {
      field: "tunedInWorks",
      headerName: "Tuned In Works",
      type: "number",
      width: 150,
      valueGetter: (tunedInWorks) => tunedInWorks || "-",
    },
    {
      field: "creationDate",
      headerName: "Creation Date",
      minWidth: 200,
      valueGetter: (creationDate) => {
        if (!creationDate) return "-";
        const d = new Date(creationDate);
        return Number.isNaN(d.getTime()) ? creationDate : d.toLocaleString();
      },
    },
    {
      field: "author",
      headerName: "Author",
      minWidth: 160,
      valueGetter: (author) => author.name || "-",
    },
    {
      field: "discipline",
      headerName: "Discipline",
      minWidth: 160,
      valueGetter: (discipline) => discipline.name || "-",
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      minWidth: 140,
      valueGetter: (coords) => {
        if (!coords) return "-";
        return `{${coords.x}, ${coords.y}}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => openEdit(params.row)}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <MenuItem value="name">name</MenuItem>
            <MenuItem value="description">description</MenuItem>
            <MenuItem value="author.name">author.name</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <TextField
            placeholder="Filter (full match)"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => {
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
          >
            Apply
          </Button>
        </Grid>
        <Grid item sx={{ ml: "auto" }}>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Sort (none)</MenuItem>
            <MenuItem value="name,asc">name ↑</MenuItem>
            <MenuItem value="name,desc">name ↓</MenuItem>
            <MenuItem value="maximumPoint,desc">maxPoint ↓</MenuItem>
          </Select>
          <Button variant="contained" sx={{ ml: 2 }} onClick={openCreate}>
            Create
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={processedItems}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={total}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Lab" : "Create Lab"}</DialogTitle>
        <DialogContent>
          <LabForm
            initial={editing}
            onSubmit={handleSave}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
