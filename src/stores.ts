import { writable } from "svelte/store";

class Class {
  name: string;
  students: string[];

  constructor(name: string, students: string[]) {
    this.name = name;
    this.students = students;
  }

  static fromJSON(json: any) {
    return new Class(json.name, json.students);
  }

  toJSON() {
    return {
      name: this.name,
      students: this.students,
    };
  }
}

export const data = writable(loadClass());

data.subscribe((value) =>
  localStorage.setItem("data", JSON.stringify(value.toJSON()))
);

function loadClass(): Class {
  try {
    return Class.fromJSON(JSON.parse(localStorage.getItem("data") ?? ""));
  } catch {
    return new Class("Class", []);
  }
}
