import { Stack, Typography, Divider, Grid } from "@mui/material";

export default function InfoCard({ title, size, children }) {
  return (
    <Grid
      size={size ?? { xs: 12, md: 4 }}
      boxShadow={2}
      p={1.5}
      borderRadius={1}
    >
      <Stack spacing={1}>
        {title ? (
          <>
            <Typography variant="subtitle1">{title}</Typography>
            <Divider />
          </>
        ) : null}
        {children}
      </Stack>
    </Grid>
  );
}
