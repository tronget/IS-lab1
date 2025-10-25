import { TextField, Grid } from "@mui/material";
import SectionCard from "../shared/SectionCard";
import ExistingEntitySelect from "../shared/ExistingEntitySelect";

export default function DisciplineSection({ form, errors, change, options }) {
  return (
    <SectionCard title="Discipline">
      <Grid size={12}>
        <ExistingEntitySelect
          label="Discipline"
          createLabel="Create new discipline"
          mode={form.disciplineMode}
          existingId={form.disciplineExistingId}
          options={options}
          onSelect={({ mode, id }) => {
            change("disciplineMode", mode);
            change("disciplineExistingId", id);
          }}
        />
      </Grid>

      {form.disciplineMode === "new" && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Discipline name"
              fullWidth
              value={form.discipline.name}
              onChange={(e) => change("discipline.name", e.target.value)}
              error={!!errors.disciplineName}
              helperText={errors.disciplineName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Practice hours"
              fullWidth
              value={form.discipline.practiceHours}
              onChange={(e) =>
                change("discipline.practiceHours", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Self study hours"
              fullWidth
              value={form.discipline.selfStudyHours}
              onChange={(e) =>
                change("discipline.selfStudyHours", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Labs count"
              fullWidth
              value={form.discipline.labsCount}
              onChange={(e) => change("discipline.labsCount", e.target.value)}
              error={!!errors.disciplineLabs}
              helperText={errors.disciplineLabs}
            />
          </Grid>
        </>
      )}
    </SectionCard>
  );
}
