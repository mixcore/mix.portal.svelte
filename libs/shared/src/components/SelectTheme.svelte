<script lang="ts">
    import type { ThemeModel } from '@mix.core/mix.lib';
    import ThemeCard from './ThemeCard.svelte';

    const themeList: ThemeModel[] = [
        {
            id: '1',
            title: 'Mix Agency',
            description: 'Default theme provide by MixCore Team',
            thumbnailImg: ''
        }
    ]

    let selectedTheme: string = themeList[0].id;

    function onThemeSelected(event: CustomEvent<string>): void {
        selectedTheme = event.detail;
    }
</script>

<div class="select-theme">
    <div class="select-theme__title">Select a  theme for your website: </div>

    <div class="select-theme__theme-list">
            {#each themeList as theme }
                <ThemeCard theme={theme}
                           selected={selectedTheme == theme.id}
                           on:onSelectTheme={onThemeSelected}></ThemeCard>
            {/each}
    </div>
</div>
<style lang="scss">
    .select-theme {
        &__title {
            margin-bottom: var(--cds-spacing-05);
        }
    }
</style>