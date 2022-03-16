<script lang="ts">
    import { WatsonHealthZoomPan20 } from "carbon-icons-svelte";
    import { TextAlignCenter16 } from "carbon-icons-svelte";
    import { TextAlignLeft16 } from "carbon-icons-svelte";
    import { TextAlignRight16 } from "carbon-icons-svelte";
    import { TooltipDefinition } from "carbon-components-svelte";

    import { onMount, onDestroy } from 'svelte'

    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import Table from '@tiptap/extension-table'
    import TableRow from '@tiptap/extension-table-row'
    import TableCell from '@tiptap/extension-table-cell'
    import TableHeader from '@tiptap/extension-table-header'
    import Underline from '@tiptap/extension-underline';
    import TextAlign from '@tiptap/extension-text-align';

    let element
    let editor: Editor

    onMount(() => {
        editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
            Table.configure({
              resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            TextAlign.configure({
              types: ['heading', 'paragraph'],
              alignments: ['left', 'right', 'center'],
              defaultAlignment: 'left'
            })
        ],
        content: '<p>Hello World! 🌍️ </p>',
        onTransaction: () => {
            editor = editor
            console.log(editor.getHTML());
        },
      })
    })

    function toggleHeading(level: 1 | 2 | 3): void {
      editor.chain().focus().toggleHeading({level: level}).run();
    }

    function toggleText(): void {
      editor.chain().focus().setParagraph().run();
    }

    function boldText(): void {
      editor.chain().focus().toggleBold().run();
    }

    function toggleItalic(): void {
      editor.chain().focus().toggleItalic().run();
    }

    function toggleStrike(): void {
      editor.chain().focus().toggleStrike().run();
    }

    function toggleUnderline(): void {
      editor.chain().focus().toggleUnderline().run();
    }

    function toggleCodeBlock(): void {
      editor.chain().focus().toggleCodeBlock().run();
    }

    function addTable(): void {
      editor.commands.insertTable()
    }

    function formatTing(value: 'left' | 'right' | 'center'): void {
      editor.chain().focus().setTextAlign(value).run();
    }

    onDestroy(() => {
        if (editor) {
          editor.destroy()
        }
    })
</script>


<div class="editor">
  {#if editor}
    <div class="editor__toolbar">
      <TooltipDefinition tooltipText="Heading Level 1">
        <div on:click={() => toggleHeading(1)}
             class="editor__button {editor.isActive('heading', {level: 1}) ? 'is-active' : ''}">
             H1
        </div>
      </TooltipDefinition>
            
      <TooltipDefinition tooltipText="Heading Level 2">
        <div on:click={() => toggleHeading(2)}
             class="editor__button {editor.isActive('heading', {level: 2}) ? 'is-active' : ''}">
            H2
        </div>
      </TooltipDefinition>
          
      <TooltipDefinition tooltipText="Heading Level 3">
        <div on:click={() => toggleHeading(3)}
             class="editor__button {editor.isActive('heading', {level: 3}) ? 'is-active' : ''}">
            H3
        </div>
      </TooltipDefinition>

      <div on:click={() => toggleText()}
        class="editor__button {editor.isActive('bold') ? 'is-active' : ''}">
          Text
      </div>

      <div class="editor__separator"></div>

      <div on:click={boldText}
           class="editor__button --bold {editor.isActive('bold') ? 'is-active' : ''}">
          B
      </div>

      <div on:click={toggleItalic}
           class="editor__button --italic {editor.isActive('italic') ? 'is-active' : ''}">
          I
      </div>

      <div on:click={toggleStrike}
           class="editor__button --strike {editor.isActive('strike') ? 'is-active' : ''}">
          N
      </div>

      <div on:click={toggleUnderline}
           class="editor__button --underline {editor.isActive('underline') ? 'is-active' : ''}">
          U
      </div>

      <div class="editor__separator"></div>

      <div on:click={() => formatTing('left')}
            class="editor__button {editor.isActive('textAlign', {alignment: 'left'}) ? 'is-active' : ''}">
          <TextAlignLeft16 />
      </div>

      <div on:click={() => formatTing('center')}
        class="editor__button {editor.isActive('textAlign', {alignment: 'center'}) ? 'is-active' : ''}">
          <TextAlignCenter16 />
      </div>

      <div on:click={() => formatTing('right')}
        class="editor__button {editor.isActive('textAlign', {alignment: 'right'}) ? 'is-active' : ''}">
        <TextAlignRight16 />
      </div>

      <div class="editor__separator"></div>

      <div on:click={addTable}
           class="editor__button {editor.isActive('strike') ? 'is-active' : ''}">
           &#8862;
      </div>

      <div on:click={toggleCodeBlock}
           class="editor__button {editor.isActive('strike') ? 'is-active' : ''}">
           &#60; &#62;
      </div>

    </div>
  {/if}

  <div class="editor__content">
      <div class="editor__html" bind:this={element} />
  </div>

  <div class="editor__floating-toolbar">
      <div class="editor__button" style="margin-right: 0;"><WatsonHealthZoomPan20 /></div>
  </div>
</div>

<style lang="scss" global>
  .editor {
    border-bottom: 1px solid gray;
    position: relative;

    &__separator {
      display: block;
      content: '';
      width: 10px;
      box-shadow: rgb(55 53 47 / 9%) 1px 0px 0px;
      background-color: rgba(55, 53, 47, 0.08);
    }

    &__button {
      transition: background 20ms ease-in 0s;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px 8px;
      white-space: nowrap;
      box-shadow: rgb(55 53 47 / 9%) 1px 0px 0px;
      margin-right: 1px;
      min-width: 30px;
      

      &.--bold {
        font-weight: bold;
      }

      &.--italic {
        font-style: italic;
      }

      &.--strike {
        text-decoration: line-through;
      }

      &.--underline {
        text-decoration: underline;
      }

      &:hover {
        background-color: rgba(55, 53, 47, 0.08);
      }

      &.is-active {
        opacity: 0.3;
      }
    }

    &__floating-toolbar {
       position: absolute;
       bottom: 10px;
       right: 10px;
    }

    &__toolbar {
      height: auto;
      display: inline-flex;
      align-items: stretch;
      height: 32px;
      background: white;
      font-size: 14px;
      line-height: 1.2;
      border-radius: 3px;
      box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
      pointer-events: auto;
    }

    &__content {
      border-top: 1px solid black;
      margin-top: 10px;
      height: 200px;
      padding: 10px;
    }

    &__html {
      height: 100%;

      .ProseMirror {
        height: 100%;
        overflow: auto;
        outline: none;

        &::-webkit-scrollbar {
          width: 0.7em;
        }
        
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
        }
      }
    }

  .ProseMirror {
      table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;

          td,
          th {
            border: 2px solid #ced4da;
            box-sizing: border-box;
            min-width: 1em;
            padding: 3px 5px;
            position: relative;
            vertical-align: top;

            > * {
              margin-bottom: 0;
            }
          }

          th {
            background-color: #f1f3f5;
            font-weight: bold;
            text-align: left;
          }

          .selectedCell:after {
            background: rgba(200, 200, 255, 0.4);
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
            position: absolute;
            z-index: 2;
          }

          .column-resize-handle {
            background-color: #adf;
            bottom: -2px;
            position: absolute;
            right: -2px;
            pointer-events: none;
            top: 0;
            width: 4px;
          }

          p {
            margin: 0;
          }
        }
      }

      .tableWrapper {
        padding: 1rem 0;
        overflow-x: auto;
      }

      .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }
  }
</style>