import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function ExistingEntitySelect({
  label,
  mode,
  existingId,
  options = [],
  createLabel,
  onSelect,
  formControlProps,
}) {
  const handleChange = (event) => {
    const value = event.target.value;

    if (value === "new") {
      onSelect({ mode: "new", id: "" });
      return;
    }

    onSelect({ mode: "existing", id: value });
  };

  const selectValue = mode === "existing" ? existingId || "" : "new";

  return (
    <FormControl fullWidth {...formControlProps}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={selectValue} onChange={handleChange}>
        <MenuItem value="new">{createLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
