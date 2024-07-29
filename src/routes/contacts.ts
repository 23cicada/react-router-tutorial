/**
 * localForage 是一个 JavaScript 库，通过简单类似 localStorage API 的异步存储来改进你的 Web 应用程序的离线体验。它能存储多种类型的数据，而不仅仅是字符串。
 * localForage 有一个优雅降级策略，若浏览器不支持 IndexedDB 或 WebSQL，则使用 localStorage。在所有主流浏览器中都可用：Chrome，Firefox，IE 和 Safari（包括 Safari Mobile）。
 */
import localforage from "localforage";

/**
 * match-sorter 可以简化 JavaScript 应用中模糊搜索和排序的实现过程。
 */
import { matchSorter } from "match-sorter";

/**
 * 为本地 Array.sort() 创建比较器函数的实用程序。允许按多个属性排序。
 */
import sortBy from "sort-by";

export type Contacts = {
  id: string;
  createdAt: number;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactsEdit = {
  first?: string;last?: string;
  twitter?: string;
  notes?: string;
  avatar?: string;favorite?: boolean;
};

export async function getContacts(query?: string) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: Contacts[] | null = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {contacts = matchSorter(contacts, query, { keys: ["first", "last"] });}
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts = await localforage.getItem<Contacts[]>("contacts");
  const contact = contacts?.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id: string, updates: ContactsEdit) {
  await fakeNetwork();
  const contacts = (await localforage.getItem<Contacts[]>("contacts"))!;
  const contact = contacts?.find((contact) => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  const contacts = (await localforage.getItem<Contacts[]>("contacts"))!;
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Contacts[]) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string) {
  if (!key) {
    fakeCache = {};
  } else {
    if (fakeCache[key]) {
      return;
    }

    fakeCache[key] = true;
  }

  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
