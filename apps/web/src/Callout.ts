import { Node, mergeAttributes } from "@tiptap/core";

export const calloutKinds = ["info", "tip", "warning", "danger"] as const;
export type CalloutKind = typeof calloutKinds[number];

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      kind: {
        default: "info",
        parseHTML: (element) => {
          const value = element.getAttribute("data-callout-kind");
          return calloutKinds.includes(value as CalloutKind) ? value : "info";
        }
      }
    };
  },

  parseHTML() {
    return [{ tag: "aside[data-callout-kind]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, {
      "data-callout-kind": HTMLAttributes.kind,
      class: `editor-callout editor-callout-${HTMLAttributes.kind}`
    }), 0];
  }
});
