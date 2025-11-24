import { Paper, Typography, Grid } from "@mui/material";

export default function SectionCard({ title, children, containerProps }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
      <Typography variant="h6">{title}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} {...(containerProps ?? {})}>
        {children}
      </Grid>
    </Paper>
  );
}
