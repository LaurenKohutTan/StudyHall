<script>
  const data = `Alam, Mehreen
Betros, Jeremy
Blank, Adam
Chamberlain, Oscar
Hornblow, Aidan
Ingram, Connor
Lettie, Lucas
Lipke-Barbee, Colin
Paulsen, Anthony
Perez Martorell, Camila
Sauro, Madison
Savastano, Robert
Schmolze, Ryan
Schnarr, Caroline
Schwartz, Jessica
Schwarz, Sabrina
Schwed, Alexander
Sela, Evamaria
Senke, Claudia
Senke, Oliver
Shakthimani, Rohan
Srinivas, Ishanth
Stanzione, Gabriella
Stapleton, Kevin
Stewart, Annabel
Tan, Grace
Teslovic, Michelle
Trachtenbroit, Ella
Tyndale, Maya
Urschler, Alyssa
Valverde, Jeremy
Vopal, Emma
Wang, Jeffrey
Ward, Ryan
Way, Daniel
Weiner, Sophie
Yemula, Archit
Yermak, George
Yu, Angela
Zimnoch, Kaylin
`;

  import { savedArray } from "./stores.js";

  let students = data
    .trim()
    .split("\n")
    .filter((studentName) => !$savedArray.includes(studentName));
  let signedIn = $savedArray;
  function removeName(name) {
    new Audio("sound.wav").play();
    signedIn = [...signedIn, name];
    $savedArray = signedIn;
    students = students.filter((student) => student != name);
  }

  function reset() {
    students = data.trim().split("\n");
    signedIn = [];
    $savedArray = signedIn;
  }

  function undo() {
    students.push(signedIn[signedIn.length - 1]);
    signedIn.splice(signedIn.length - 1, 1);

    students = students.sort();
    signedIn = signedIn.sort();
    $savedArray = signedIn;
  }
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

<p>
  {$savedArray.join(", ")}
</p>
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
