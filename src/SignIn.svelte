<script lang="ts">
  import {
    Divider,
    NativeSelect,
    Title,
    Text,
    Group,
    Button,
    Modal,
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

  let showSignedIn = false;
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

  function signIn(student: string) {
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
    state.update((x) => {
      let student = x.getClass(selected)?.signedIn.pop();
      x.getClass(selected)!.signOut(student!);
      return x;
    });
  }
</script>

<svelte:head>
  <title>Study Hall &mdash; Sign In</title>
</svelte:head>

<Title>Study Hall Sign In</Title>
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
  <Button
    variant="outline"
    on:click={() => (showSignedIn = true)}
    disabled={!selectedClass}
  >
    View Signed In
  </Button>
  <Button variant="outline" on:click={resetAll}>Reset All</Button>
  <Button
    variant="outline"
    on:click={undo}
    disabled={selectedClass?.signedIn.length == 0}>Undo</Button
  >
</Group>

{#if selectedClass}
  <Divider />
  {#if selectedClass.allSignedIn()}
    <Text>All students signed in.</Text>
  {:else if $state.separateByLast}
    {#each selectedClass.freshStudentsByLast() as group}
      <Title order={2}>{group.letter}</Title>
      <Divider variant="dashed" />
      <Group>
        {#each group.students as student}
          <Button variant="filled" size="md" on:click={() => signIn(student)}>
            {student}
          </Button>
        {/each}
      </Group>
      <br />
    {/each}
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

<Modal
  opened={showSignedIn}
  title="Signed In"
  size="lg"
  overflow="inside"
  on:close={() => (showSignedIn = false)}
>
  {#if selectedClass}
    <ul>
      {#each selectedClass.signedIn as student}
        <li><Text>{student}</Text></li>
      {/each}
    </ul>
  {/if}
</Modal>
