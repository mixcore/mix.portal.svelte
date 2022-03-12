<script context="module">
    export const ssr = false;
</script>

<script lang="ts">
    import Application from "carbon-pictograms-svelte/lib/Application.svelte";
    import RedHatApplications from "carbon-pictograms-svelte/lib/RedHatApplications.svelte";
    import ConsumerEngagementFoodJourney from "carbon-pictograms-svelte/lib/ConsumerEngagementFoodJourney.svelte";
    import KeyUsers from "carbon-pictograms-svelte/lib/KeyUsers.svelte";
    import SelectProduct from "carbon-pictograms-svelte/lib/SelectProduct.svelte";
    import ConnectApplications from "carbon-pictograms-svelte/lib/ConnectApplications.svelte";

    import { onMount } from "svelte";
    import { DashboardInformation, MixSharedService } from "@mix.core/mix.lib";
    import { environment, MixApi } from "@mix.core/shared";

    let dashBoardData: DashboardInformation;
    let sharedSrv = new MixSharedService(environment.baseUrl);

    onMount(() => {
        MixApi.get<DashboardInformation>(sharedSrv.getSharedDashboardInfoEndpoint)
              .then(res => dashBoardData = res)
              .catch(err => {});
    })
</script>

<div class="dashboard">
    <div class="container">
            <div class="row">
                <div class="col">
                    <h3 class="dashboard__header">Dashboard </h3>
                </div>
            </div>
    </div>

    <div class="container">
        <div class="row gx-3 gy-3">
            <div class="col-md-3 col-sm-12">

                    <div class="dashboard-item">
                        
                            <div class="dashboard-item__pictogram">
                                <RedHatApplications></RedHatApplications>  
                            </div>
                            <h5 class="dashboard-item__title">{dashBoardData?.totalPost ?? 0} Posts</h5>
                            <div class="dashboard-item__description"></div>
                            <div class="dashboard-item__action">Go to Modules</div>
                        
                    </div>

            </div>

            <div class="col-md-3 col-sm-12">

                    <div class="dashboard-item">
                        
                            <div class="dashboard-item__pictogram">
                                <Application></Application>
                            </div>
                            <h5 class="dashboard-item__title">{dashBoardData?.totalPage ?? 0} Pages</h5>
                            <div class="dashboard-item__description"></div>
                            <div class="dashboard-item__action">Go to Modules</div>
                        
                    </div>

            </div>

            <div class="col-md-3 col-sm-12">

                    <div class="dashboard-item">
                        
                            <div class="dashboard-item__pictogram">
                                <ConsumerEngagementFoodJourney/>
                            </div>
                            <h5 class="dashboard-item__title">{dashBoardData?.totalModule ?? 0} Modules</h5>
                            <div class="dashboard-item__description"></div>
                            <div class="dashboard-item__action">Go to Modules</div>
                        
                    </div>

            </div>

            <div class="col-md-3 col-sm-12">

                    <div class="dashboard-item">
                        
                            <div class="dashboard-item__pictogram">
                                <KeyUsers/>
                            </div>
                            <h5 class="dashboard-item__title">{dashBoardData?.totalUser ?? 0} Users</h5>
                            <div class="dashboard-item__description"></div>
                            <div class="dashboard-item__action">Go to Users</div>
                        
                    </div>

            </div>

            <div class="col-md-3 col-sm-12">
                <div class="dashboard-item">
                     
                        <div class="dashboard-item__pictogram">
                                <SelectProduct/>
                        </div>
                        <h5 class="dashboard-item__title">{dashBoardData?.totalProduct ?? 0} Products</h5>
                        <div class="dashboard-item__description"></div>
                        <div class="dashboard-item__action">Go to Products</div>
                    
                </div>
            </div>

            <div class="col-md-9 col-sm-12">
                <div class="dashboard-item">
                     
                        <div class="dashboard-item__pictogram">
                            <ConnectApplications/>
                        </div>
                        <h5 class="dashboard-item__title">{dashBoardData?.totalProduct ?? 0} News</h5>
                    
                </div>
            </div>
        </div>
    </div>
    
</div>

<style lang="scss">
    .dashboard__header {
        margin-top: 1rem;
        margin-bottom: 2rem;
    }

    .dashboard-item {
        height: 100%;
        background-color: var(--cds-ui-01, #f4f4f4);
        padding: var(--cds-spacing-07   );

        &__title {
            margin-bottom: var(--cds-spacing-04);
        }

        &__pictogram {
            margin-bottom: 2rem;
        }
    }
</style>