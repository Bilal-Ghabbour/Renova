import { body } from "express-validator";

// Produktvalidierung
export const productValidator = [
  body("title").notEmpty().withMessage("Titel ist erforderlich"),
  body("description").notEmpty().withMessage("Beschreibung ist erforderlich"),
  body("price")
    .isNumeric()
    .withMessage("Preis muss eine Zahl sein")
    .notEmpty()
    .withMessage("Preis ist erforderlich"),
    body("category").notEmpty().withMessage("Kategorie ist erforderlich"),
   
];