<script>
    import { MixLogo } from '@mix.core/shared';
</script>

<div class="account">
    <div class="container">
        <div class="row">
            <div class="col-md-5 col-sm-12">
                <div class="account__mix-logo">
                   <MixLogo></MixLogo>
                </div>

                <div class="account__form-container">
                    <slot></slot>
                </div>
            </div>

            <div class="col-md-7 col-sm-12">
                <img class="w-100 h-100" src="/images/carbon-img-concept.svg" alt="mix-concept">
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .account {
        width: 100vw;
        height: 100vh;
        overflow: auto;
        padding: 20px;

        &__form-container {
            margin-top: var(--cds-spacing-10);
        }
    }
</style>