import { Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import LabList from "./components/LabList.jsx";
import LabDetails from "./components/LabDetails.jsx";
import SpecialOps from "./components/SpecialOps.jsx";

export default function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LabWork Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            List
          </Button>
          <Button color="inherit" component={Link} to="/special">
            Special Ops
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Routes>
            <Route path="/" element={<LabList />} />
            <Route path="/lab/:id" element={<LabDetails />} />
            <Route path="/special" element={<SpecialOps />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
