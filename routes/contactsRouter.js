import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", changeContact);

contactsRouter.patch("/:id/favorite", updateStatusContact);

export default contactsRouter;
