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
      id: this.id,
      name: this.name,
      students: this.students,
    };
  }
}

class State {
  classes: Class[] = [];
  current: number = -1;
  playDing: boolean = true;

  addClass(name: string, students: string[]) {
    let id = this.classes.map((c) => c.id).reduce((a, b) => Math.max(a, b), 0);
    this.classes.push(new Class(id + 1, name, students));
  }

  editClass(id: number, name: string, students: string[]) {
    let c = this.getClass(id)!;
    c.name = name;
    c.students = students;
  }

  getClass(id: number): Class | null {
    return this.classes.find((c) => c.id === id) || null;
  }

  removeClass(id: number) {
    this.classes = this.classes.filter((c) => c.id !== id);
    if (this.current === id) this.current = -1;
  }

  noClasses() {
    return this.classes.length === 0;
  }

  static fromJSON(json: any) {
    let state = new State();
    state.classes = json.classes.map(Class.fromJSON);
    state.current = json.current;
    state.playDing = json.playDing;
    return state;
  }

  toJSON() {
    return {
      classes: this.classes,
      current: this.current,
      playDing: this.playDing,
    };
  }
}

export const state = writable(loadClasses());

state.subscribe((value) =>
  localStorage.setItem("data", JSON.stringify(value.toJSON()))
);

function loadClasses(): State {
  try {
    return State.fromJSON(JSON.parse(localStorage.getItem("data")!));
  } catch {
    return new State();
  }
}
