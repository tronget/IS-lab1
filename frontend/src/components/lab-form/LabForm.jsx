import { useEffect, useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import {
  disciplineApi,
  coordinatesApi,
  personApi,
  locationApi,
} from "../../api/index.js";
import { cloneEmptyForm, difficulties, colors, countries } from "./constants.js";
import LabWorkSection from "./sections/LabWorkSection.jsx";
import DisciplineSection from "./sections/DisciplineSection.jsx";
import CoordinatesSection from "./sections/CoordinatesSection.jsx";
import AuthorSection from "./sections/AuthorSection.jsx";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function adaptInitial(initial) {
  const result = cloneEmptyForm();

  result.name = initial.name ?? "";
  result.description = initial.description ?? "";
  result.difficulty = initial.difficulty ?? "";
  result.minimalPoint = initial.minimalPoint ?? "";
  result.maximumPoint = initial.maximumPoint ?? "";
  result.tunedInWorks = initial.tunedInWorks ?? 0;

  if (initial.discipline) {
    result.disciplineMode = "existing";
    result.disciplineExistingId = initial.discipline.id ?? "";
  }
  if (initial.coordinates) {
    result.coordinatesMode = "existing";
    result.coordinatesExistingId = initial.coordinates.id ?? "";
  }
  if (initial.author) {
    result.authorMode = "existing";
    result.authorExistingId = initial.author.id ?? "";
  }

  return result;
}

export default function LabForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ? adaptInitial(initial) : cloneEmptyForm()
  );
  const [errors, setErrors] = useState({});
  const [disciplines, setDisciplines] = useState([]);
  const [coordsList, setCoordsList] = useState([]);
  const [persons, setPersons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [descriptionMinRows, setDescriptionMinRows] = useState(1);

  useEffect(() => {
    const fetchList = (request, setter) => {
      request()
        .then((response) => setter(response.data || []))
        .catch(() => setter([]));
    };

    fetchList(disciplineApi.list, setDisciplines);
    fetchList(coordinatesApi.list, setCoordsList);
    fetchList(personApi.list, setPersons);
    fetchList(locationApi.list, setLocations);
  }, []);

  useEffect(() => {
    setForm(initial ? adaptInitial(initial) : cloneEmptyForm());
    setDescriptionMinRows(1);
  }, [initial]);

  function change(path, value) {
    const parts = path.split(".");
    setForm((prev) => {
      const copy = deepClone(prev);
      let current = copy;
      for (let index = 0; index < parts.length - 1; index += 1) {
        if (current[parts[index]] == null) current[parts[index]] = {};
        current = current[parts[index]];
      }
      current[parts.at(-1)] = value;
      return copy;
    });
  }

  function validate() {
    const validationErrors = {};

    if (!form.name || String(form.name).trim() === "")
      validationErrors.name = "Name is required";
    if (!form.description || String(form.description).trim() === "")
      validationErrors.description = "Description is required";
    if (!(Number(form.minimalPoint) > 0))
      validationErrors.minimalPoint =
        "minimalPoint must be a positive number (>0)";
    if (!(Number(form.maximumPoint) > 0))
      validationErrors.maximumPoint =
        "maximumPoint must be a positive number (>0)";

    if (form.disciplineMode === "new") {
      if (!form.discipline.name || String(form.discipline.name).trim() === "")
        validationErrors.disciplineName = "Discipline name is required";
      if (
        form.discipline.labsCount !== "" &&
        Number(form.discipline.labsCount) < 0
      )
        validationErrors.disciplineLabs = "labsCount must be >= 0";
    }

    if (form.coordinatesMode === "new") {
      if (form.coordinates.x === "" || form.coordinates.x === null)
        validationErrors.coordinatesX = "Coordinates.x is required";
      if (form.coordinates.y === "" || form.coordinates.y === null)
        validationErrors.coordinatesY = "Coordinates.y is required";
      else if (Number(form.coordinates.y) > 508)
        validationErrors.coordinatesY = "Coordinates.y must be ≤ 508";
    }

    if (form.authorMode === "new") {
      if (!form.author.name || String(form.author.name).trim() === "")
        validationErrors.authorName = "Author name is required";
      if (!form.author.eyeColor)
        validationErrors.authorEye = "Eye color is required";
      if (!form.author.hairColor)
        validationErrors.authorHair = "Hair color is required";
      if (!(Number(form.author.weight) > 0))
        validationErrors.authorWeight = "Weight must be positive (>0)";
      if (!form.author.nationality)
        validationErrors.authorNationality = "Nationality is required";

      if (form.author.locationMode === "new") {
        if (form.author.location.x === "" || form.author.location.x === null)
          validationErrors.locationX = "Location.x is required";
        if (form.author.location.y === "" || form.author.location.y === null)
          validationErrors.locationY = "Location.y is required";
        if (
          !form.author.location.name ||
          String(form.author.location.name).trim() === ""
        )
          validationErrors.locationName = "Location.name is required";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: String(form.name).trim(),
      description: String(form.description).trim(),
      difficulty: form.difficulty || null,
      minimalPoint: Number(form.minimalPoint),
      maximumPoint: Number(form.maximumPoint),
      tunedInWorks: Number(form.tunedInWorks),
    };

    if (form.disciplineMode === "existing") {
      payload.discipline = { id: Number(form.disciplineExistingId) };
    } else {
      payload.discipline = {
        name: String(form.discipline.name).trim(),
        practiceHours:
          form.discipline.practiceHours === ""
            ? null
            : Number(form.discipline.practiceHours),
        selfStudyHours:
          form.discipline.selfStudyHours === ""
            ? null
            : Number(form.discipline.selfStudyHours),
        labsCount:
          form.discipline.labsCount === ""
            ? null
            : Number(form.discipline.labsCount),
      };
    }

    if (form.coordinatesMode === "existing") {
      payload.coordinates = { id: Number(form.coordinatesExistingId) };
    } else {
      payload.coordinates = {
        x: Number(form.coordinates.x),
        y: Number(form.coordinates.y),
      };
    }

    if (form.authorMode === "existing") {
      payload.author = { id: Number(form.authorExistingId) };
    } else {
      const author = {
        name: String(form.author.name).trim(),
        eyeColor: form.author.eyeColor || null,
        hairColor: form.author.hairColor || null,
        weight: Number(form.author.weight),
        nationality: form.author.nationality || null,
      };
      if (form.author.locationMode === "existing") {
        author.location = { id: Number(form.author.locationExistingId) };
      } else {
        author.location = {
          x: Number(form.author.location.x),
          y: Number(form.author.location.y),
          name: String(form.author.location.name).trim(),
        };
      }
      payload.author = author;
    }

    onSubmit(payload);
  }

  const disciplineOptions = useMemo(
    () =>
      disciplines
        .filter((disc) => disc)
        .map((disc) => ({
          value: String(disc.id ?? ""),
          label: `${disc.name} (id:${disc.id})`,
        })),
    [disciplines]
  );

  const coordinatesOptions = useMemo(
    () =>
      coordsList
        .filter((coords) => coords)
        .map((coords) => ({
          value: String(coords.id ?? ""),
          label: `x:${coords.x} y:${coords.y} (id:${coords.id})`,
        })),
    [coordsList]
  );

  const personOptions = useMemo(
    () =>
      persons
        .filter((person) => person)
        .map((person) => ({
          value: String(person.id ?? ""),
          label: `${person.name} (id:${person.id})`,
        })),
    [persons]
  );

  const locationOptions = useMemo(
    () =>
      locations
        .filter((location) => location)
        .map((location) => ({
          value: String(location.id ?? ""),
          label: `${location.name} (id:${location.id})`,
        })),
    [locations]
  );

  return (
    <form onSubmit={submit}>
      <LabWorkSection
        form={form}
        errors={errors}
        change={change}
        difficulties={difficulties}
        descriptionMinRows={descriptionMinRows}
        setDescriptionMinRows={setDescriptionMinRows}
      />

      <DisciplineSection
        form={form}
        errors={errors}
        change={change}
        options={disciplineOptions}
      />

      <CoordinatesSection
        form={form}
        errors={errors}
        change={change}
        options={coordinatesOptions}
      />

      <AuthorSection
        form={form}
        errors={errors}
        change={change}
        colors={colors}
        countries={countries}
        personOptions={personOptions}
        locationOptions={locationOptions}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
}
