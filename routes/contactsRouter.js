import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { isValidId, validateBody } from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
  changeContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  isValidId,
  changeContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(changeContactSchema),
  isValidId,
  updateStatusContact
);

export default contactsRouter;
