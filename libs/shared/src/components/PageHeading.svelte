<script lang="ts">
  export let mainTitle: string = '';
  export let description: string = '';
</script>

<div class="mix-page-heading">
  <h1>
    {mainTitle}
    <span> {description} </span>
  </h1>
</div>

<style>
  .mix-page-heading {
      position: relative;
  }

  .mix-page-heading h1 {
    text-transform: capitalize;
    display: flex;
    flex-direction: column-reverse;
    padding-bottom: 10px;
  }

  .mix-page-heading h1:before {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 35px;
    height: 3px;
    content: '';
    background-color: #f06;
  }

  .mix-page-heading h1 span {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    padding-left: 0.25em;
    color: rgba(0, 0, 0, 0.7);
  }
</style>
