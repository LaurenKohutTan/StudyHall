import { writable } from "svelte/store";

class Class {
  id: number;
  name: string;
  students: string[];

  constructor(id: number, name: string, students: string[]) {
    this.id = id;
    this.name = name;
    this.students = students;
  }

  static fromJSON(json: any) {
    return new Class(json.id, json.name, json.students);
  }

  toJSON() {
    return {
      name: this.name,
      students: this.students,
    };
  }
}

class Classes {
  classes: Class[];
  current: number;

  constructor(classes: Class[], current: number) {
    this.classes = classes;
    this.current = current;
  }

  add(name: string, students: string[]) {
    let id = this.classes.map((c) => c.id).reduce((a, b) => Math.max(a, b), 0);
    this.classes.push(new Class(id + 1, name, students));
  }

  edit(id: number, name: string, students: string[]) {
    let c = this.get(id)!;
    c.name = name;
    c.students = students;
  }

  get(id: number): Class | null {
    return this.classes.find((c) => c.id === id) || null;
  }

  remove(id: number) {
    this.classes = this.classes.filter((c) => c.id !== id);
    if (this.current === id) this.current = -1;
  }

  isEmpty() {
    return this.classes.length === 0;
  }

  static fromJSON(json: any) {
    return new Classes(json.classes.map(Class.fromJSON), json.current);
  }

  toJSON() {
    return {
      classes: this.classes,
      current: this.current,
    };
  }
}

export const classes = writable(loadClasses());

classes.subscribe((value) =>
  localStorage.setItem("data", JSON.stringify(value.toJSON()))
);

function loadClasses(): Classes {
  try {
    return Classes.fromJSON(JSON.parse(localStorage.getItem("data")!));
  } catch {
    return new Classes([], -1);
  }
}
