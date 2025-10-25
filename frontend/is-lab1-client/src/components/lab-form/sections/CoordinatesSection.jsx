import { TextField, Grid } from "@mui/material";
import SectionCard from "../shared/SectionCard";
import ExistingEntitySelect from "../shared/ExistingEntitySelect";

export default function CoordinatesSection({ form, errors, change, options }) {
  return (
    <SectionCard title="Coordinates">
      <Grid size={12}>
        <ExistingEntitySelect
          label="Coordinates"
          createLabel="Create new coordinates"
          mode={form.coordinatesMode}
          existingId={form.coordinatesExistingId}
          options={options}
          onSelect={({ mode, id }) => {
            change("coordinatesMode", mode);
            change("coordinatesExistingId", id);
          }}
        />
      </Grid>

      {form.coordinatesMode === "new" && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Coordinates X"
              fullWidth
              value={form.coordinates.x}
              onChange={(e) => change("coordinates.x", e.target.value)}
              error={!!errors.coordinatesX}
              helperText={errors.coordinatesX}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Coordinates Y"
              fullWidth
              value={form.coordinates.y}
              onChange={(e) => change("coordinates.y", e.target.value)}
              error={!!errors.coordinatesY}
              helperText={errors.coordinatesY}
            />
          </Grid>
        </>
      )}
    </SectionCard>
  );
}
