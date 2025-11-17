import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import SectionCard from "../shared/SectionCard.jsx";
import ExistingEntitySelect from "../shared/ExistingEntitySelect.jsx";

export default function AuthorSection({
  form,
  errors,
  change,
  colors,
  countries,
  personOptions,
  locationOptions,
}) {
  return (
    <SectionCard title="Author (Person)">
      <Grid size={12}>
        <ExistingEntitySelect
          label="Author"
          createLabel="Create new person"
          mode={form.authorMode}
          existingId={form.authorExistingId}
          options={personOptions}
          onSelect={({ mode, id }) => {
            change("authorMode", mode);
            change("authorExistingId", id);
          }}
        />
      </Grid>

      {form.authorMode === "new" && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Author name"
              fullWidth
              value={form.author.name}
              onChange={(e) => change("author.name", e.target.value)}
              error={!!errors.authorName}
              helperText={errors.authorName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel>Eye Color</InputLabel>
              <Select
                label="Eye Color"
                value={form.author.eyeColor || ""}
                onChange={(e) => change("author.eyeColor", e.target.value)}
              >
                {colors.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c || "-"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel>Hair Color</InputLabel>
              <Select
                label="Hair Color"
                value={form.author.hairColor || ""}
                onChange={(e) => change("author.hairColor", e.target.value)}
              >
                {colors.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c || "-"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              label="Weight"
              fullWidth
              value={form.author.weight}
              onChange={(e) => change("author.weight", e.target.value)}
              error={!!errors.authorWeight}
              helperText={errors.authorWeight}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel>Nationality</InputLabel>
              <Select
                label="Nationality"
                value={form.author.nationality || ""}
                onChange={(e) => change("author.nationality", e.target.value)}
              >
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c || "-"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1">Location for Author</Typography>
          </Grid>

          <Grid size={12}>
            <ExistingEntitySelect
              label="Location"
              createLabel="Create new location"
              mode={form.author.locationMode}
              existingId={form.author.locationExistingId}
              options={locationOptions}
              onSelect={({ mode, id }) => {
                change("author.locationMode", mode);
                change("author.locationExistingId", id);
              }}
            />
          </Grid>

          {form.author.locationMode === "new" && (
            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Location X (Double)"
                  fullWidth
                  value={form.author.location.x}
                  onChange={(e) => change("author.location.x", e.target.value)}
                  error={!!errors.locationX}
                  helperText={errors.locationX}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Location Y (Long)"
                  fullWidth
                  value={form.author.location.y}
                  onChange={(e) => change("author.location.y", e.target.value)}
                  error={!!errors.locationY}
                  helperText={errors.locationY}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Location name"
                  fullWidth
                  value={form.author.location.name}
                  onChange={(e) =>
                    change("author.location.name", e.target.value)
                  }
                  error={!!errors.locationName}
                  helperText={errors.locationName}
                />
              </Grid>
            </>
          )}
        </>
      )}
    </SectionCard>
  );
}
