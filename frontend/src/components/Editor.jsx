import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./editor.css";
import { useEffect, useState } from "react";

function ToolbarBtn({ onClick, active, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-[11px] font-bold font-heading transition-all duration-150 cursor-pointer
        ${
          active
            ? "bg-[#7c6dfa] text-white ring-1 ring-[#7c6dfa]" // ← added ring
            : "bg-transparent text-[#6b6b80] hover:bg-[#1a1a24] hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

export default function Editor({
  title,
  onTitleChange,
  content,
  onContentChange,
}) {
  const [wordCount, setWordCount] = useState(0);
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    strike: false,
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Write your thoughts... What was confusing? What clicked? What do you want to revisit?",
      }),
    ],
    content: content || "",
    onSelectionUpdate({ editor }) {
      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
      });
    },

    onUpdate({ editor }) {
      const text = editor.getText();
      onContentChange(editor.getHTML());
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    },

    editorProps: {
      attributes: {
        class:
          "outline-none h-full px-6 py-4 font-mono text-[13px] leading-relaxed text-white max-w-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const updateMarks = () => {
      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
      });
    };

    editor.on("selectionUpdate", updateMarks);
    editor.on("transaction", updateMarks);

    return () => {
      editor.off("selectionUpdate", updateMarks);
      editor.off("transaction", updateMarks);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !content) return;

    if (editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);
  if (!editor) return null;

  return (
    <div className="flex flex-col flex-1 bg-[#111118] rounded-lg border border-[#ffffff0f] overflow-hidden min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#ffffff0f] flex-wrap shrink-0">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={activeMarks.bold}
        >
          B
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={activeMarks.italic}
        >
          <i>I</i>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={activeMarks.strike}
        >
          <s>S</s>
        </ToolbarBtn>

        <div className="w-[1px] h-4 bg-[#ffffff18] mx-1" />

        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarBtn>

        <div className="w-[1px] h-4 bg-[#ffffff18] mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          ≡ List
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. List
        </ToolbarBtn>

        <div className="w-[1px] h-4 bg-[#ffffff18] mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          {"{ }"}
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          ❝
        </ToolbarBtn>

        <div className="w-[1px] h-4 bg-[#ffffff18] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}>
          ↩
        </ToolbarBtn>

        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}>
          ↪
        </ToolbarBtn>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="What did you learn today?"
        className="bg-transparent border-none outline-none text-2xl font-extrabold font-heading tracking-tight placeholder:text-[#4a4a5a] px-6 pt-5 pb-3 text-white shrink-0 w-full"
      />

      {/* Typing area — flex-1 so it fills remaining height */}
      <EditorContent editor={editor} className="tiptap-wrapper" />

      {/* Footer — word count + AI buttons */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#ffffff0f] shrink-0">
        <span className="text-[10px] text-[#6b6b80] font-mono">
          {wordCount} words
        </span>

        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ffffff18] text-[#6b6b80] text-[11px] font-heading font-bold hover:bg-[#1a1a24] hover:text-white transition-all duration-150 cursor-pointer">
            ✦ AI Summarise
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ffffff18] text-[#6b6b80] text-[11px] font-heading font-bold hover:bg-[#1a1a24] hover:text-white transition-all duration-150 cursor-pointer">
            ⬡ Tag with AI
          </button>
        </div>
      </div>
    </div>
  );
}
