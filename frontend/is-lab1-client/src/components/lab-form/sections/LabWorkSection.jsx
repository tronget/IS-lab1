import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import SectionCard from "../shared/SectionCard";

export default function LabWorkSection({
  form,
  errors,
  change,
  difficulties,
  descriptionMinRows,
  setDescriptionMinRows,
}) {
  return (
    <SectionCard title="LabWork">
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          label="Name"
          fullWidth
          value={form.name}
          onChange={(e) => change("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            label="Difficulty"
            value={form.difficulty || ""}
            onChange={(e) => change("difficulty", e.target.value)}
          >
            {difficulties.map((d) => (
              <MenuItem key={d} value={d}>
                {d || "-"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={12}>
        <TextField
          label="Description"
          fullWidth
          multiline
          maxRows={20}
          minRows={descriptionMinRows}
          value={form.description}
          onChange={(e) => change("description", e.target.value)}
          onFocus={() => setDescriptionMinRows(4)}
          onBlur={() => setDescriptionMinRows(1)}
          error={!!errors.description}
          helperText={errors.description}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          label="Minimal Point"
          fullWidth
          value={form.minimalPoint}
          onChange={(e) => change("minimalPoint", e.target.value)}
          error={!!errors.minimalPoint}
          helperText={errors.minimalPoint}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          label="Maximum Point"
          fullWidth
          value={form.maximumPoint}
          onChange={(e) => change("maximumPoint", e.target.value)}
          error={!!errors.maximumPoint}
          helperText={errors.maximumPoint}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          label="Tuned In Works"
          fullWidth
          value={form.tunedInWorks}
          onChange={(e) => change("tunedInWorks", e.target.value)}
        />
      </Grid>
    </SectionCard>
  );
}
