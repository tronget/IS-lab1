import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { labApi } from "../api/index";
import {
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";

import LabForm from "./lab-form/LabForm";
import InfoCard from "./common/InfoCard";
import { formatDateTime } from "../utils/formatters";

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
        <InfoCard title="Lab overview" size={{ xs: 12, md: 8 }}>
          <DetailRow label="Description" value={lab.description} />
          <DetailRow label="Difficulty" value={lab.difficulty} />
          <DetailRow label="Minimal point" value={lab.minimalPoint} />
          <DetailRow label="Maximum point" value={lab.maximumPoint} />
          <DetailRow label="Tuned-in works" value={lab.tunedInWorks} />
          <DetailRow label="Created" value={formatDateTime(lab.creationDate)} />
        </InfoCard>

        <InfoCard title="Discipline">
          <DetailRow label="ID" value={discipline.id} />
          <DetailRow label="Name" value={discipline.name} />
          <DetailRow label="Practice hours" value={discipline.practiceHours} />
          <DetailRow
            label="Self-study hours"
            value={discipline.selfStudyHours}
          />
          <DetailRow label="Labs count" value={discipline.labsCount} />
        </InfoCard>

        <InfoCard title="Coordinates">
          <DetailRow label="ID" value={coordinates.id} />
          <DetailRow label="X" value={coordinates.x} />
          <DetailRow label="Y" value={coordinates.y} />
        </InfoCard>

        <InfoCard title="Author">
          <DetailRow label="ID" value={author.id} />
          <DetailRow label="Name" value={author.name} />
          <DetailRow label="Eye color" value={author.eyeColor} />
          <DetailRow label="Hair color" value={author.hairColor} />
          <DetailRow label="Weight" value={author.weight} />
          <DetailRow label="Nationality" value={author.nationality} />
        </InfoCard>

        <InfoCard title="Author location">
          <DetailRow label="ID" value={location.id} />
          <DetailRow label="Name" value={location.name} />
          <DetailRow label="X" value={location.x} />
          <DetailRow label="Y" value={location.y} />
        </InfoCard>
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
