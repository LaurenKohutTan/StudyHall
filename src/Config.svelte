<script lang="ts">
  import {
    Button,
    Divider,
    Group,
    Modal,
    Text,
    TextInput,
    Textarea,
    Title,
  } from "@svelteuidev/core";
  import { FileText } from "radix-icons-svelte";

  import { classes } from "./stores";

  class ModalState {
    mode: ModelMode;
    id: number | null = null;
    name: string;
    students: string;

    constructor(mode: ModelMode, name: string, students: string[]) {
      this.mode = mode;
      this.name = name;
      this.students = students.join("\n");
    }
  }

  enum ModelMode {
    Closed,
    Editing,
    Creating,
  }

  let state = new ModalState(ModelMode.Closed, "", []);

  function modalClose() {
    classes.update((x) => {
      if (state.mode == ModelMode.Creating)
        x.add(state.name, state.students.split("\n"));
      else if (state.mode == ModelMode.Editing)
        x.edit(state.id!, state.name, state.students.split("\n"));
      return x;
    });
    state.mode = ModelMode.Closed;
  }

  function removeClass(id: number) {
    classes.update((x) => {
      x.remove(id);
      return x;
    });
  }

  function editClass(id: number) {
    let c = $classes.get(id)!;
    state = new ModalState(ModelMode.Editing, c.name, c.students);
    state.id = id;
  }
</script>

<Title>StudyHall Config</Title>
<Divider />

<Button variant="outline" on:click={() => (state.mode = ModelMode.Creating)}>
  Create New Class
</Button>

<br />

<Title order={2}>Classes</Title>
{#if $classes.isEmpty()}
  <Text>No classes yet.</Text>
{:else}
  {#each $classes.classes as i}
    <Group>
      <Text>{`${i.name} (${i.students.length} students)`}</Text>
      <Button variant="outline" on:click={() => editClass(i.id)}>Edit</Button>
      <Button variant="outline" on:click={() => removeClass(i.id)}>
        Delete
      </Button>
    </Group>
  {/each}
{/if}

<Modal
  opened={state.mode != ModelMode.Closed}
  on:close={() => (state.mode = ModelMode.Closed)}
  title={state.mode == ModelMode.Creating ? "Create Class" : "Edit Class"}
  size="lg"
>
  <TextInput icon={FileText} placeholder="Class name" bind:value={state.name} />
  <br />

  <Textarea
    label="List of students. One on each line, in `Last Name, First Name` format."
    resize="vertical"
    bind:value={state.students}
  ></Textarea>
  <br />

  <Button variant="outline" on:click={modalClose}>
    {state.mode == ModelMode.Creating ? "Create" : "Save"}
  </Button>
</Modal>
