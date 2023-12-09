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

export const data = writable(
  Class.fromJSON(JSON.parse(localStorage.getItem("data") ?? ""))
);

data.subscribe((value) =>
  localStorage.setItem("data", JSON.stringify(value.toJSON()))
);
