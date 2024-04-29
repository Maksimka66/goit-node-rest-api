import { json } from "express";
import {
  getContactById,
  listContacts,
  removeContact,
} from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
  const allContacts = listContacts();

  res.status(200).send(allContacts);
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  const definiteContact = getContactById(id);
  id
    ? res.status(200).send(definiteContact)
    : res.status(404).send(JSON.stringify({ message: "Not found" }));
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const deletedContact = removeContact(id);
  id
    ? res.status(200).send(deletedContact)
    : res.status(404).send(JSON.stringify({ message: "Not found" }));
};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
