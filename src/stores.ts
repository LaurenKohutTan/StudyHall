import { writable } from "svelte/store";

class Class {
  id: number;
  name: string;
  students: string[];
  signedIn: string[] = [];

  constructor(id: number, name: string, students: string[]) {
    this.id = id;
    this.name = name;
    this.students = students;
    this.students.sort();
  }

  static fromJSON(json: any) {
    let c = new Class(json.id, json.name, json.students);
    c.signedIn = json.signedIn ?? [];
    return c;
  }

  freshStudentsByLast(): { letter: string; students: string[] }[] {
    let out: { letter: string; students: string[] }[] = [];
    let working: string[] = [];
    let last = "";

    const flush = () => {
      if (working.length > 0) out.push({ letter: last[0], students: working });
      working = [];
    };

    for (let s of this.students) {
      if (this.signedIn.includes(s)) continue;
      if (s[0] !== last[0] && working.length > 0) flush();
      working.push(s);
      last = s;
    }

    flush();
    return out;
  }

  freshStudents(): string[] {
    return this.students.filter((s) => !this.signedIn.includes(s));
  }

  signIn(student: string) {
    if (!this.signedIn.includes(student)) this.signedIn.push(student);
  }

  signOut(student: string) {
    this.signedIn = this.signedIn.filter((s) => s !== student);
  }

  allSignedIn() {
    return this.freshStudents().length === 0;
  }

  resetAll() {
    this.signedIn = [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      students: this.students,
      signedIn: this.signedIn,
    };
  }
}

class State {
  classes: Class[] = [];
  current: number = -1;
  playDing: boolean = true;
  separateByLast: boolean = true;

  sortClasses() {
    this.classes.sort((a, b) => a.name.localeCompare(b.name));
    this.classes.forEach((c) => c.students.sort());
  }

  addClass(name: string, students: string[]) {
    let id = this.classes.map((c) => c.id).reduce((a, b) => Math.max(a, b), 0);
    this.classes.push(new Class(id + 1, name, students));
    this.sortClasses();
  }

  editClass(id: number, name: string, students: string[]) {
    let c = this.getClass(id)!;
    c.name = name;
    c.students = students;
    this.sortClasses();
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
    state.separateByLast = json.separateByLast;
    return state;
  }

  toJSON() {
    return {
      classes: this.classes,
      current: this.current,
      playDing: this.playDing,
      separateByLast: this.separateByLast,
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
