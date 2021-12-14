<script lang="ts">
    import ThemeCard from './ThemeCard.svelte';
</script>

<div class="select-theme">
    <div class="select-theme__title">Select a  theme for your website: </div>

    <div class="select-theme__theme-list">
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <ThemeCard></ThemeCard>
            </div>
        </div>
    </div>
</div>
<style lang="scss">
    .select-theme {
        &__title {
            margin-bottom: var(--cds-spacing-05);
        }
    }
</style>