import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, {
      encoding: "utf-8",
    });

    return JSON.parse(data);
  } catch (error) {
    return error;
  }
}

async function writeContacts(contacts) {
  try {
    const data = await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, undefined, 2)
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const markedContact = contacts.find((contact) => contact.id === contactId);
    return markedContact ? markedContact : null;
  } catch (error) {
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const removedContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    const newList = contacts.filter((contact) => contact.id !== contactId);

    await writeContacts(newList);

    return removedContactIndex !== -1 ? contacts[removedContactIndex] : null;
  } catch (error) {
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };

    await writeContacts([...contacts, newContact]);

    return newContact;
  } catch (error) {
    return null;
  }
}

export async function updateContact(id, data) {
  try {
    const contacts = await listContacts();
    const updatedContact = contacts.find((contact) => contact.id === id);
    for (const key in updatedContact) {
      updatedContact[key] = data[key];
    }
    return updatedContact;
  } catch (error) {
    return null;
  }
}
