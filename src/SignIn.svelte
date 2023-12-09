<script lang="ts">
  import {
    Divider,
    NativeSelect,
    Title,
    Text,
    Group,
    Button,
  } from "@svelteuidev/core";
  import { state } from "./stores";
  import { Person } from "radix-icons-svelte";
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";

  let classList = Array.from(
    $state.classes.map((x) => {
      return { label: x.name, value: x.id.toString() };
    })
  );

  let selectedRaw = "";
  let selected = -1;
  onMount(() => {
    if ($state.current) selectedRaw = $state.current.toString();
  });
  $: selectedClass = $state.classes.find((x) => x.id == selected);
  $: (() => {
    let current = parseInt(selectedRaw);
    if (current) {
      selected = current;
      state.update((x) => {
        x.current = current;
        return x;
      });
    }
  })();

  const DING = new Audio("sound.wav");
  function playDing() {
    if (!$state.playDing) return;
    (DING.cloneNode() as HTMLAudioElement).play();
  }

  let recent: string[] = [];
  function signIn(student: string) {
    recent.push(student);
    state.update((x) => {
      x.getClass(selected)!.signIn(student);
      return x;
    });
    playDing();
  }

  function resetAll() {
    state.update((x) => {
      x.getClass(selected)!.resetAll();
      return x;
    });
  }

  function undo() {
    let student = recent.pop();
    state.update((x) => {
      x.getClass(selected)!.signOut(student!);
      return x;
    });
  }
</script>

<Title>StudyHall Sign In</Title>
<Divider />

<Text
  >Select a class below, then click each student name to sign them in.
  {#if selectedClass?.signedIn.length != 0}
    {selectedClass?.signedIn.length} of {selectedClass?.students.length} students
    signed in so far.
  {/if}
</Text>
<br />

<Group>
  <NativeSelect
    data={classList}
    icon={Person}
    placeholder="Select a class"
    bind:value={selectedRaw}
    style="width: 100%"
  />
  <Button variant="outline" on:click={() => navigate("/config")}>Config</Button>
  <Button variant="outline" on:click={resetAll}>Reset All</Button>
  <Button variant="outline" on:click={undo}>Undo</Button>
</Group>

{#if selectedClass}
  <Divider />
  {#if selectedClass.allSignedIn()}
    <Text>All students signed in.</Text>
  {:else}
    <Group>
      {#each selectedClass.freshStudents() as student}
        <Button variant="filled" size="md" on:click={() => signIn(student)}>
          {student}
        </Button>
      {/each}
    </Group>
  {/if}
{/if}
