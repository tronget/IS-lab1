import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { labApi } from "../api";
import {
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
} from "@mui/material";
import LabForm from "./LabForm";

export default function LabDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    labApi
      .get(id)
      .then((r) => setLab(r.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  function onDelete() {
    if (!confirm("Delete?")) return;
    labApi
      .remove(id)
      .then(() => nav("/"))
      .catch(() => alert("Delete failed"));
  }
  function onUpdate(payload) {
    labApi
      .update(id, payload)
      .then(() => {
        setEditOpen(false);
        labApi.get(id).then((r) => setLab(r.data));
      })
      .catch((err) =>
        alert("Update failed: " + (err?.response?.data?.message || err.message))
      );
  }

  if (loading) return <div>Loading...</div>;
  if (!lab) return <div>Not found</div>;

  function formatDate(value) {
    if (!value) return "-";
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString();
    } catch {
      return String(value);
    }
  }

  const coordinates = lab.coordinates ?? {};
  const author = lab.author ?? {};
  const location = author.location ?? {};
  const discipline = lab.discipline ?? {};

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {lab.name} (id: {lab.id})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Lab overview</Typography>
            <Divider />
            <DetailRow label="Description" value={lab.description} />
            <DetailRow label="Difficulty" value={lab.difficulty} />
            <DetailRow label="Minimal point" value={lab.minimalPoint} />
            <DetailRow label="Maximum point" value={lab.maximumPoint} />
            <DetailRow label="Tuned-in works" value={lab.tunedInWorks} />
            <DetailRow label="Created" value={formatDate(lab.creationDate)} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Coordinates</Typography>
            <Divider />
            <DetailRow label="ID" value={coordinates.id} />
            <DetailRow label="X" value={coordinates.x} />
            <DetailRow label="Y" value={coordinates.y} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Author</Typography>
            <Divider />
            <DetailRow label="ID" value={author.id} />
            <DetailRow label="Name" value={author.name} />
            <DetailRow label="Eye color" value={author.eyeColor} />
            <DetailRow label="Hair color" value={author.hairColor} />
            <DetailRow label="Weight" value={author.weight} />
            <DetailRow label="Nationality" value={author.nationality} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Author location</Typography>
            <Divider />
            <DetailRow label="ID" value={location.id} />
            <DetailRow label="Name" value={location.name} />
            <DetailRow label="X" value={location.x} />
            <DetailRow label="Y" value={location.y} />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Discipline</Typography>
            <Divider />
            <DetailRow label="ID" value={discipline.id} />
            <DetailRow label="Name" value={discipline.name} />
            <DetailRow
              label="Practice hours"
              value={discipline.practiceHours}
            />
            <DetailRow
              label="Self-study hours"
              value={discipline.selfStudyHours}
            />
            <DetailRow label="Labs count" value={discipline.labsCount} />
          </Stack>
        </Grid>
      </Grid>

      <div style={{ marginTop: 16 }}>
        <Button
          variant="outlined"
          onClick={() => setEditOpen(true)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          Delete
        </Button>
      </div>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <LabForm
            initial={lab}
            onSubmit={onUpdate}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

function DetailRow({ label, value }) {
  return (
    <Typography variant="body2">
      <strong>{label}:</strong> {value ?? "-"}
    </Typography>
  );
}
