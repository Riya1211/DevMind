import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./editor.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
function Tooltip({ text, children }) {
  return (
    <div className="relative group">
      {children}
      <div
        className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2 py-1 bg-[#1a1a24] border border-[#ffffff18]
        text-[10px] font-body !text-[#6b6b80] rounded-md
        whitespace-nowrap pointer-events-none
        opacity-0 group-hover:opacity-100
        transition-opacity duration-150
      "
      >
        {text}
        {/* little arrow pointing down */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2
          border-4 border-transparent border-t-[#ffffff18]"
        />
      </div>
    </div>
  );
}

export default function Editor({
  title,
  onTitleChange,
  content,
  onContentChange,
  onSummarise,
  isSummarising,
  summary,
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

  const { id } = useParams();
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

      {/* Typing area is flex-1 so it fills remaining height */}
      <EditorContent editor={editor} className="tiptap-wrapper" />

      {/* It only shows when there's a summary */}
      {summary && (
        <div className="mx-6 mb-3 p-3 bg-[#7c6dfa22] border border-[#7c6dfa33] rounded-lg">
          <div className="text-[9px] text-[#a78bfa] font-body !text-white tracking-wider mb-1">
            AI SUMMARY
          </div>
          <p className="text-[11px] text-[#f0f0f5] font-body !text-white leading-relaxed">
            {summary}
          </p>
        </div>
      )}
      {/* Footer — word count + AI buttons */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#ffffff0f] shrink-0">
        <span className="text-[10px] text-[#6b6b80] font-mono">
          {wordCount} words
        </span>

        <div className="flex gap-2">
          <Tooltip
            text={
              !id ? "Save entry first to use AI features" : "Summarise with AI"
            }
          >
            <button
              onClick={onSummarise}
              disabled={isSummarising || !id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ffffff18] text-[#6b6b80] text-[11px] font-heading font-bold hover:bg-[#1a1a24] hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummarising ? "Summarising..." : "✦ AI Summarise"}
            </button>
          </Tooltip>

          <Tooltip
            text={
              !id ? "Save entry first to use AI features" : "Summarise with AI"
            }
          >
            <button 
            disabled={!id}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ffffff18] text-[#6b6b80] text-[11px] font-heading font-bold hover:bg-[#1a1a24] hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              ⬡ Tag with AI
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
