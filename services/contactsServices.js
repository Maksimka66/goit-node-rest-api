export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, {
      encoding: "utf-8",
    });
    return JSON.parse(data);
  } catch (error) {
    throw error;
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
  const contacts = await listContacts();
  const markedContact = contacts.find((contact) => contact.id === contactId);
  return markedContact ? markedContact : null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  const newList = contacts.filter((contact) => contact.id !== contactId);

  await writeContacts(newList);

  return removedContactIndex !== -1 ? contacts[removedContactIndex] : null;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };

  await writeContacts([...contacts, newContact]);

  return newContact;
}
