<script lang="ts">
    import type { ThemeModel } from "@mix.core/mix.lib";
    import { Button } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";

    export let theme: ThemeModel = undefined;
    export let selected: boolean = false;

    const dispath = createEventDispatcher();
    const onSelectThemeEvent = 'onSelectTheme';

    function selectTheme(): void {
        dispath(onSelectThemeEvent, theme.id);
    }
</script>

<div class="theme-card">
    <div class="theme-card__title"> { theme.title } </div>
    <div class="theme-card__description"> { theme.description } </div>
    <div class="theme-card__thumbnail"> { theme.thumbnailImg } </div>

    <Button> Select </Button>
</div>

<style lang="scss">
    .theme-card {
        background-color: #fff;
        padding: var(--cds-spacing-07);
        border-radius: 5px;
        border: 1px solid #D9D9D9;

        &__title {
            font-weight: bold;
            font-size: var(--cds-heading-03-font-size);
            margin-bottom: var(--cds-spacing-05);
        }

        &__description {
            margin-bottom: var(--cds-spacing-05);
        }

        &__thumnail {
            margin-bottom: var(--cds-spacing-05);
        }
    }
</style>