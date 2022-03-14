<script lang="ts">
  import type { ThemeModel } from '@mix.core/mix.lib';
  import { Button } from 'carbon-components-svelte';
  import ThemeCard from './ThemeCard.svelte';
  import { ArrowRight16 } from 'carbon-icons-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const onThemeSubmitEvt = 'onThemeSubmit';
  const themeList: ThemeModel[] = [{
      id: '1',
      title: 'Mix Agency',
      description: 'Default theme provide by MixCore Team',
      thumbnailImg: '/images/theme-indicator.png',
  }];
  let selectedTheme: string = themeList[0].id;

  function onThemeSelected(event: CustomEvent<string>): void {
    selectedTheme = event.detail;
  }

  function onThemeSubmited(): void {
      let theme = themeList.find(t => t.id === selectedTheme);
      if (theme) {
          dispatch(onThemeSubmitEvt, theme);
      }
  }
</script>

<div class="select-theme">
  <div class="select-theme__title">Select a theme for your website:</div>

  <div class="select-theme__theme-list">
    <div class="row">
      {#each themeList as theme}
        <div class="col-md-3">
          <ThemeCard
            {theme}
            selected={selectedTheme == theme.id}
            on:onSelectTheme={onThemeSelected}
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="select-theme__action">
    <Button icon={ArrowRight16} on:click={onThemeSubmited}>Let Started</Button>
  </div>
</div>

<style lang="scss">
  .select-theme {
    &__title {
      margin-bottom: var(--cds-spacing-05);
    }

    &__theme-list {
      margin-bottom: var(--cds-spacing-05);
    }
  }
</style>
