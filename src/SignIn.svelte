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

  let classList = Array.from(
    $state.classes.map((x) => {
      return { label: x.name, value: x.id.toString() };
    })
  );
  let selected = "";
  $: selectedClass = $state.classes.find((x) => x.id == parseInt(selected));

  const DING = new Audio("sound.wav");
  function playDing() {
    if (!$state.playDing) return;
    (DING.cloneNode() as HTMLAudioElement).play();
  }
</script>

<Title>StudyHall Sign In</Title>
<Divider />

<Text>Select a class below, then click each student name to sign them in.</Text>
<br />

<Group>
  <NativeSelect
    data={classList}
    icon={Person}
    placeholder="Select a class"
    bind:value={selected}
    style="width: 100%"
  />
  <Button variant="outline" on:click={() => navigate("/config")}>Config</Button>
  <Button variant="outline">Undo</Button>
  <Button variant="outline">Reset All</Button>
</Group>

{#if selectedClass}
  <Divider />
  <Group>
    {#each selectedClass.students as student}
      <Button variant="filled" size="md" on:click={playDing}>
        {student}
      </Button>
    {/each}
  </Group>
{/if}
