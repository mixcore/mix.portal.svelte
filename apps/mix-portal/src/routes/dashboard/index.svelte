<script context="module">
    export const ssr = false;
</script>

<script lang="ts">
    import { Column, AspectRatio, Tile, Row, Grid } from "carbon-components-svelte";
    import Application from "carbon-pictograms-svelte/lib/Application.svelte";
    import RedHatApplications from "carbon-pictograms-svelte/lib/RedHatApplications.svelte";
    import ConsumerEngagementFoodJourney from "carbon-pictograms-svelte/lib/ConsumerEngagementFoodJourney.svelte";
</script>

<div class="dashboard">
    <h3 class="dashboard__header">Dashboard </h3>

    <Grid fullWidth>
      <Row>
        <Column>
            <AspectRatio ratio="16x9">
                <div class="dashboard-item">
                    <Tile>
                        <div class="dashboard-item__pictogram">
                            <RedHatApplications></RedHatApplications>  
                        </div>
                        <h5 class="dashboard-item__title">Posts</h5>
                        <div class="dashboard-item__description"></div>
                        <div class="dashboard-item__action">Go to Modules</div>
                    </Tile>
                </div>
            </AspectRatio>
        </Column>

        <Column>
            <AspectRatio ratio="16x9">
                <div class="dashboard-item">
                    <Tile>
                        <div class="dashboard-item__pictogram">
                            <Application></Application>
                        </div>
                        <h5 class="dashboard-item__title">Pages</h5>
                        <div class="dashboard-item__description"></div>
                        <div class="dashboard-item__action">Go to Modules</div>
                    </Tile>
                </div>
            </AspectRatio>
        </Column>

        <Column>
            <AspectRatio ratio="16x9">
                <div class="dashboard-item">
                    <Tile>
                        <div class="dashboard-item__pictogram">
                            <ConsumerEngagementFoodJourney/>
                        </div>
                        <h5 class="dashboard-item__title">Modules</h5>
                        <div class="dashboard-item__description"></div>
                        <div class="dashboard-item__action">Go to Modules</div>
                    </Tile>
                </div>
            </AspectRatio>
        </Column>
      </Row>  
    </Grid>
    
</div>

<style lang="css">
    .dashboard__header {
        margin-top: 1rem;
        margin-bottom: 2rem;
        width: 100%;
        text-align: center;
    }

    .dashboard-item__title {
        margin-bottom: var(--cds-spacing-04);
    }

    .dashboard-item__pictogram {
        margin-bottom: 2rem;
    }
</style>