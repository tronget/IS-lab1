import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Button,
  TextField,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { labApi } from "../api/index.js";
import { formatDateTime } from "../utils/formatters.js";

export default function SpecialOps() {
  const [sum, setSum] = useState(null);
  const [groups, setGroups] = useState([]);
  const [countRes, setCountRes] = useState(null);
  const [tunedVal, setTunedVal] = useState(0);
  const [labId, setLabId] = useState("");
  const [discId, setDiscId] = useState("");
  const [expanded, setExpanded] = useState(null);
  const nav = useNavigate();

  const hasGroups = groups && groups.length > 0;

  const sortedGroups = useMemo(() => {
    if (!hasGroups) return [];
    return groups.slice().sort((a, b) => {
      const da = a?.description ?? "";
      const db = b?.description ?? "";
      return da.localeCompare(db);
    });
  }, [groups, hasGroups]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Sum of maximumPoint</Typography>
        <Button
          sx={{ mt: 1 }}
          onClick={() =>
            labApi
              .sumMaxPoints()
              .then((r) => setSum(r.data))
              .catch(() => alert("Not implemented on server"))
          }
        >
          Calculate
        </Button>
        {sum !== null && <div>Sum = {sum}</div>}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Group by description</Typography>
        <Button
          sx={{ mt: 1 }}
          onClick={() =>
            labApi
              .groupByDescription()
              .then((r) => {
                const payload = Array.isArray(r.data) ? r.data : [];
                setGroups(payload);
                setExpanded(null);
              })
              .catch(() => alert("Not implemented on server"))
          }
        >
          Run
        </Button>

        {hasGroups ? (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {sortedGroups.map((group, idx) => {
              const label = group?.description ?? "-";
              const labWorks = Array.isArray(group?.labWorks)
                ? group.labWorks
                : [];
              const isExpanded = expanded === idx;
              return (
                <Accordion
                  key={`${label}-${idx}`}
                  expanded={isExpanded}
                  onChange={(_, next) => setExpanded(next ? idx : null)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">{label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {labWorks.length} lab(s)
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    {labWorks.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No lab works in this group.
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {labWorks.map((lw, labIdx) => {
                          if (!lw) return null;
                          const key = lw.id ?? `lab-${labIdx}`;
                          const name = lw.name ?? "Unnamed lab";
                          return (
                            <ListItem key={key} disablePadding divider>
                              <ListItemButton
                                onClick={() => nav(`/lab/${lw.id}`)}
                              >
                                <ListItemText
                                  primary={`${name}${
                                    lw.id ? ` (ID: ${lw.id})` : ""
                                  }`}
                                  secondary={`Difficulty: ${
                                    lw.difficulty ?? "-"
                                  } · Min: ${lw.minimalPoint ?? "-"} · Max: ${
                                    lw.maximumPoint ?? "-"
                                  } · Created: ${formatDateTime(
                                    lw.creationDate
                                  )}`}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No groups loaded yet.
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Count by tunedInWorks</Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <TextField
              type="number"
              value={tunedVal}
              onChange={(e) => setTunedVal(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              onClick={() =>
                labApi
                  .countByTunedInWorks(tunedVal)
                  .then((r) => setCountRes(r.data))
                  .catch(() => alert("Not implemented on server"))
              }
            >
              Count
            </Button>
          </Grid>
        </Grid>
        {countRes !== null && <div>Count = {countRes}</div>}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">
          Add / Remove lab to/from discipline
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <TextField
              placeholder="labId"
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder="disciplineId"
              value={discId}
              onChange={(e) => setDiscId(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              onClick={() =>
                labApi
                  .addToDiscipline(labId, discId)
                  .then(() => alert("Added"))
                  .catch((err) => {
                    alert(err.response?.data || err);
                  })
              }
            >
              Add
            </Button>
            <Button
              sx={{ ml: 1 }}
              onClick={() =>
                labApi
                  .removeFromDiscipline(labId, discId)
                  .then(() => alert("Removed"))
                  .catch((err) => alert(err.response?.data || err))
              }
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
