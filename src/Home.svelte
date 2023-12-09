<script lang="ts">
  import { Text } from "@svelteuidev/core";
  import { Link } from "svelte-routing";
  import SignIn from "./SignIn.svelte";
  import { classes } from "./stores";
</script>

{#if $classes.isEmpty()}
  <Text>
    You have no classes. Create one in <Link to="/config">settings</Link>.
  </Text>
{:else}
  <SignIn />
{/if}
