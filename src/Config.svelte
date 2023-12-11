<script lang="ts">
  import {
    Button,
    Checkbox,
    Divider,
    Group,
    Modal,
    Space,
    Text,
    TextInput,
    Textarea,
    Title,
  } from "@svelteuidev/core";
  import { FileText, Plus } from "radix-icons-svelte";
  import { navigate } from "svelte-routing";

  import { state } from "./stores";

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

  let modalState = new ModalState(ModelMode.Closed, "", []);

  function modalClose() {
    let students = modalState.students.trim().split("\n");
    state.update((x) => {
      if (modalState.mode == ModelMode.Creating)
        x.addClass(modalState.name, students);
      else if (modalState.mode == ModelMode.Editing)
        x.editClass(modalState.id!, modalState.name, students);
      return x;
    });
    modalState.mode = ModelMode.Closed;
  }

  function removeClass(id: number) {
    state.update((x) => {
      x.removeClass(id);
      return x;
    });
  }

  function newClass() {
    modalState = new ModalState(ModelMode.Creating, "", []);
  }

  function editClass(id: number) {
    let c = $state.getClass(id)!;
    modalState = new ModalState(ModelMode.Editing, c.name, c.students);
    modalState.id = id;
  }
</script>

<svelte:head>
  <title>Study Hall &mdash; Config</title>
</svelte:head>

<Title>Study Hall Config</Title>
<Divider />

<Group>
  <Button variant="outline" on:click={() => navigate("/")}>Home</Button>
  <Button variant="outline" on:click={newClass}>
    <Plus />
    <Space w={5} />
    New Class
  </Button>
</Group>
<br />

<Title order={2}>Classes</Title>
<br />

{#if $state.noClasses()}
  <Text>No classes yet.</Text>
  <br />
{:else}
  {#each $state.classes as i}
    <Group>
      <Text>{`${i.name} (${i.students.length} students)`}</Text>
      <Button variant="outline" on:click={() => editClass(i.id)}>Edit</Button>
      <Button variant="outline" on:click={() => removeClass(i.id)}>
        Delete
      </Button>
    </Group>
    <br />
  {/each}
{/if}

<Title order={2}>Miscellaneous</Title>
<br />

<Text>
  <Checkbox
    label="Play ding sound when signing in"
    bind:checked={$state.playDing}
  />
  <br />
  <Checkbox
    label="Separate by first letter of last name"
    bind:checked={$state.separateByLast}
  />
</Text>

<Modal
  opened={modalState.mode != ModelMode.Closed}
  on:close={() => (modalState.mode = ModelMode.Closed)}
  title={modalState.mode == ModelMode.Creating ? "Create Class" : "Edit Class"}
  size="lg"
>
  <TextInput
    icon={FileText}
    placeholder="Class name"
    bind:value={modalState.name}
  />
  <br />

  <Textarea
    label="List of students. One on each line, in `Last Name, First Name` format."
    resize="vertical"
    bind:value={modalState.students}
  ></Textarea>
  <br />

  <Button variant="outline" on:click={modalClose}>
    {modalState.mode == ModelMode.Creating ? "Create" : "Save"}
  </Button>
</Modal>
