<script>
  import { data } from "./stores";

  let students = ["Connor Slade"];

  function removeName(name) {
    new Audio("sound.wav").play();
  }

  function reset() {}

  function undo() {}
</script>

<h1>Vail Study Hall</h1>
<button on:click={(_) => undo()}> UNDO LAST </button>

<br />
{#each students as name}
  <div class="btn-group">
    <button on:click={(_) => removeName(name)}>
      {name}
    </button>
  </div>
{/each}

<p></p>
<br /><br /><br />
<button on:click={(_) => reset()}> Reset List </button>

<style>
  .btn-group button {
    display: block;
    margin-bottom: 35px;
    padding: 15px;
    background-color: #f76027;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.8rem;
    display: block;
    font-size: 24px;
  }

  button {
    display: block;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #cccccc;
    color: black;
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    display: block;
  }
</style>
