export const difficulties = ["", "VERY_EASY", "NORMAL", "VERY_HARD"];
export const colors = ["", "RED", "YELLOW", "ORANGE", "WHITE"];
export const countries = [
  "",
  "USA",
  "FRANCE",
  "CHINA",
  "ITALY",
  "THAILAND",
];

export const emptyForm = {
  name: "",
  description: "",
  difficulty: "",
  minimalPoint: "",
  maximumPoint: "",
  tunedInWorks: 0,

  disciplineMode: "new",
  disciplineExistingId: "",
  discipline: {
    name: "",
    practiceHours: "",
    selfStudyHours: "",
    labsCount: "",
  },

  coordinatesMode: "new",
  coordinatesExistingId: "",
  coordinates: { x: "", y: "" },

  authorMode: "new",
  authorExistingId: "",
  author: {
    name: "",
    eyeColor: "",
    hairColor: "",
    weight: "",
    nationality: "",
    locationMode: "new",
    locationExistingId: "",
    location: { x: "", y: "", name: "" },
  },
};

export function cloneEmptyForm() {
  return JSON.parse(JSON.stringify(emptyForm));
}
