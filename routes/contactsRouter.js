import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  changeContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), changeContact);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(changeContactSchema),
  updateStatusContact
);

export default contactsRouter;
