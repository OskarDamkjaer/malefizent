<script lang="ts">
  import { createField } from "./game";
  import Spot from "./Spot.svelte";
  const field = createField();
</script>

<main>
  {#each field as row}
    <div class="row">
      {#each row as spot}
        <Spot {spot} />
      {/each}
    </div>
  {/each}
</main>

<style>
  .row {
    display: flex;
  }
</style>
