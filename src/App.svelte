<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Config from "./Config.svelte";
  import Home from "./Home.svelte";
  import { SvelteUIProvider } from "@svelteuidev/core";
</script>

<SvelteUIProvider>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/config" component={Config} />
  </Router>
</SvelteUIProvider>
