import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./MenuBar";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import "../../Community/components/PostEditor.css";
import { Mark, mergeAttributes } from "@tiptap/core";

export const FontSize = Mark.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {};
          }
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        style: "font-size",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark(this.name, { size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});

function sanitizeContent(node) {
  if (!node) return node;

  // attrs에 null 속성이 있으면 제거
  if (node.attrs) {
    Object.keys(node.attrs).forEach((key) => {
      if (node.attrs[key] === null) {
        delete node.attrs[key];
      }
    });
  }

  // content 배열이 있으면 재귀적으로 처리
  if (Array.isArray(node.content)) {
    node.content = node.content.map(sanitizeContent);
  }
  return node;
}

const IntroductionEditor = forwardRef(
  ({ handleSubmit, defaultPost, value }, ref) => {
    const editor = useEditor({
      extensions: [
        Document,
        StarterKit,
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        FontSize,
        Image,
        ImageResize,
      ],
      content: value,
    });

    // ref로 getContent 메서드 노출
    useImperativeHandle(ref, () => ({
      getContent: () => editor?.getJSON(),
    }));

    if (!editor) {
      return null;
    }

    useEffect(() => {
      if (!defaultPost) return;
      // defaultPost가 객체인 경우 content 속성을 사용, 아니면 직접 사용
      const content =
        typeof defaultPost === "object" && defaultPost.content
          ? defaultPost.content
          : defaultPost;
      editor?.commands.setContent(content);
    }, [defaultPost]);

    const generateForm = async () => {
      const form = new FormData();
      const jsonContent = editor.getJSON();
      const cleanJSON = sanitizeContent(structuredClone(jsonContent));
      form.append("content", JSON.stringify(cleanJSON));
      return form;
    };

    const handleSave = async () => {
      const form = await generateForm();
      handleSubmit(form);
    };

    return (
      <div className="p-4.5">
        <div className="post-wrapper flex flex-col gap-5 rounded-xl bg-white shadow-xl p-2">
          <div className="post_body rounded-sm min-h-[200px] px-2">
            {/* 메뉴바 */}
            <MenuBar editor={editor} />
            {/* 에디터 */}
            <EditorContent
              editor={editor}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                minHeight: "150px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default IntroductionEditor;
