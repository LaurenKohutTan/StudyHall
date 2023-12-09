<script>
  import { Router, Route } from "svelte-routing";
  import Config from "./Config.svelte";
  import SignIn from "./SignIn.svelte";
</script>

<Router>
  <Route path="/" component={SignIn} />
  <Route path="/config" component={Config} />
</Router>
