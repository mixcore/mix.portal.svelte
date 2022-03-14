<script lang="ts">
    import { Button } from "carbon-components-svelte";

</script>

<div id="notfound">
  <div class="notfound">
    <div class="notfound-404">
      <h1>404</h1>
    </div>
    <h2>WE ARE SORRY, SOMETHING ERROR!</h2>
    <p>
      The page you are looking for might have been removed had its name changed
      or is temporarily unavailable.
    </p>
    <div class="notfound-btn">
        <Button> Try again </Button>
    </div>
  </div>
</div>

<style lang="scss">
  #notfound {
    position: relative;
    height: 100vh;
  }

  #notfound .notfound {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .notfound {
    max-width: 920px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
  }

  .notfound .notfound-404 {
    position: absolute;
    height: 100px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .notfound .notfound-404 h1 {
    font-family: 'Maven Pro', sans-serif;
    color: #ececec;
    font-weight: 900;
    font-size: 276px;
    margin: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .notfound h2 {
    font-family: 'Maven Pro', sans-serif;
    font-size: 46px;
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0px;
  }

  .notfound p {
    font-family: 'Maven Pro', sans-serif;
    font-size: 16px;
    color: #000;
    font-weight: 400;
    text-transform: uppercase;
    margin-top: 15px;
  }

  .notfound-btn {
      margin-top: 50px;
  }

  @media only screen and (max-width: 480px) {
    .notfound .notfound-404 h1 {
      font-size: 162px;
    }
    .notfound h2 {
      font-size: 26px;
    }
  }
</style>
