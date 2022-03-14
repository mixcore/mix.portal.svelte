<script lang="ts">
    import { MixPostService } from "@mix.core/mix.lib";
    import { environment, MixApi, MixPageHeading } from "@mix.core/shared";
    import { Accordion, AccordionItem, Button, FormGroup, Tab, TabContent, Tabs, TextArea, TextInput } from "carbon-components-svelte";
    import { RichTextEditor } from "@mix.core/shared";
    import { onMount } from "svelte";

    const mixPostService = new MixPostService(environment.baseUrl);

    onMount(() => {
        MixApi.get(mixPostService.getDefaultPostEndpoint).then((res) => {
            console.log(res);
        })
    })
</script>

<div class="create-post">
    <div class="container">
        <div class="row page-toolbar">
            <div class="col-md-6 col-sm-12">
                <MixPageHeading mainTitle='Post'
                                description='Create new'></MixPageHeading>
            </div>
            <div class="col-md-6 col-sm-12 d-flex justify-content-end">
                <Button> Create </Button>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-sm-12 mix-widget">
                <Tabs>
                    <Tab label="Main Information" />
                    <Tab label="SEO" />
                    <div slot="content">
                      <TabContent>
                        <FormGroup legendText="Title">
                            <TextInput id="username"
                                       name="username"
                                       placeholder="Your Post Title Here . . ."/>
                        </FormGroup>
        
                        <FormGroup legendText="Excerpt">
                            <TextInput id="username"
                                       name="username"/>
                        </FormGroup>
        
                        <FormGroup legendText="Content body">
                            <RichTextEditor></RichTextEditor>
                        </FormGroup>
        
                        <FormGroup legendText="Source Url">
                            <TextInput id="username"
                                       name="username"/>
                        </FormGroup>
                      </TabContent>
                      <TabContent>On development</TabContent>
                    </div>
                  </Tabs>
            </div>
            <div class="col-md-4 col-sm-12">
                <Accordion>
                    <AccordionItem title="Basic Informations">
                        <p>On development</p>
                    </AccordionItem>
                    <AccordionItem title="Languages">
                        <p>On development</p>
                    </AccordionItem>
                    <AccordionItem title="Images">
                        <p>On development</p>
                    </AccordionItem>
                    <AccordionItem title="Url Aliass">
                        <p>On development</p>
                    </AccordionItem>
                    <AccordionItem title="Categories">
                        <p>On development</p>
                    </AccordionItem>
                    <AccordionItem title="Tags">
                        <p>On development</p>
                    </AccordionItem>
                  </Accordion>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .page-toolbar {
        margin-top: 10px;
        margin-bottom: 50px;
        display: flex;
        align-items: center;
    }
</style>