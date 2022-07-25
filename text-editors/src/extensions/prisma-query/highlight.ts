import {
  classHighlightStyle,
  HighlightStyle,
  tags,
} from "@codemirror/highlight";
import { RangeSetBuilder } from "@codemirror/rangeset";
import { Extension } from "@codemirror/state";
import { Line } from "@codemirror/text";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { prismaQueryStateField } from "./state";

type Range = {
  start: Line;
  length: number;
};

/**
 * This is a custom highlight style that only highlights Prisma Queries
 */
export const queryHighlightStyle = [
  classHighlightStyle,
  HighlightStyle.define([
    // `classHighlightStyle` is a little too generic for some things, so override it in those places
    {
      tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
      class: "cmt-function",
    },
  ]),
];

/**
 * Plugin that adds a special class to all lines that are part of a Prisma Query
 */
const queryHighlightPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(viewUpdate: ViewUpdate) {
      if (viewUpdate.viewportChanged || viewUpdate.docChanged) {
        this.decorations = this.buildDecorations(viewUpdate.view);
      }
    }

    buildDecorations(view: EditorView) {
      let decorations = new RangeSetBuilder<Decoration>();
      const ranges: Range[] = [];

      view.state
        .field(prismaQueryStateField)
        .between(view.viewport.from, view.viewport.to, (from, to) => {
          const start = view.state.doc.lineAt(from);
          const end = view.state.doc.lineAt(to);
          ranges.push({
            start,
            length: end.number - start.number + 1,
          });
        });

      // `between` does not guarantee the order of the ranges,
      // but `decorations.add` requires the correct order, so
      // we need to manually sort the ranges.
      ranges.sort((a, b) => a.start.number - b.start.number);

      ranges.forEach(range => {
        for (let x = 0; x < range.length; x += 1) {
          const line = view.state.doc.line(range.start.number + x);
          decorations.add(
            line.from,
            line.from,
            Decoration.line({
              attributes: {
                class: "cm-prismaQuery",
              },
            })
          );
        }
      });

      return decorations.finish();
    }
  },
  {
    decorations: value => value.decorations,
  }
);

export function highlightStyle(): Extension {
  return [queryHighlightPlugin, queryHighlightStyle];
}
