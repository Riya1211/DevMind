import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Editor from "../components/Editor";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateEntryMutation,
  useGetSingleEntryQuery,
  useUpdateEntryMutation,
} from "../store/api/entryAPI";
import { useSummariseEntryMutation } from "../store/api/aiAPI";
import { useEffect } from "react";
import toast from "react-hot-toast";

function WriteEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [summary, setSummary] = useState("");
  const [summarise, { isLoading: isSummarising }] = useSummariseEntryMutation();

  const types = ["📝 Notes", "💥 Struggle", "✨ Breakthrough", "📌 Reference"];
  const tags = [
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "Auth",
    "Postman",
    "AI/LLM",
    "CSS",
  ];
  const feelsLike = ["😤", "🤔", "💡", "🔥"];

  const handleSelectMood = (item) => {
    // toggle on/off
    setSelectedMood(selectedMood === item ? "" : item);
  };
  const handleSelectType = (item) => {
    // toggle on/off
    setSelectedType(selectedType === item ? "" : item);
  };
  const handleMultiSelect = (item) => {
    if (selectedMulti.includes(item)) {
      setSelectedMulti(selectedMulti.filter((value) => value !== item));
    } else {
      setSelectedMulti([...selectedMulti, item]);
    }
  };

  // Setting Data
  const [createEntry] = useCreateEntryMutation();
  const [updateEntry] = useUpdateEntryMutation();
  const isEditMode = Boolean(id);
  const { data } = useGetSingleEntryQuery(id, {
    skip: !id, // important for "new entry" mode
  });

  const handleSave = async () => {
    const payload = {
      title,
      content,
      tags: selectedMulti,
      mood: selectedMood,
      type: selectedType,
    };

    try {
      if (isEditMode) {
        await updateEntry({ id, ...payload }).unwrap();
        toast.success("Entry updated!");
        navigate("/");
      } else {
        await createEntry(payload).unwrap();
        toast.success("Entry saved!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // populate data
  useEffect(() => {
    if (!data?.entry) return;

    setTitle(data.entry.title);
    setContent(data.entry.content || "");
    setSelectedMulti(data.entry.tags || []);
    setSelectedMood(data.entry.mood);
    setSelectedType(data.entry.type);
  }, [data]);

  //Handle AI
  const handleSummarise = async () => {
    if (!id) return; // only works when editing an existing entry
    try {
      const result = await summarise(id).unwrap();
      setSummary(result.summary);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="New Entry"
        subtitle="What did you learn today?"
        actions={
          <>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200"
            >
              ← Back
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 h-7 bg-[#7c6dfa] text-white font-bold rounded-lg border border-[#ffffff18] font-heading text-[#6b6b80] text-[0.7rem] tracking-tighter hover:bg-[#a78bfa] cursor-pointer hover:-translate-y-px transition-[background,transform] duration-200"
            >
              {isEditMode ? "Update entry" : "Save entry"}
            </button>
          </>
        }
      />
      <div className="flex gap-4 p-4 flex-1 min-h-0">
        {/* Editor */}
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          <Editor
            title={title} //set title
            onTitleChange={setTitle}
            content={content} //set content
            onContentChange={setContent}
            onSummarise={handleSummarise}
            isSummarising={isSummarising}
            summary={summary}
            className="flex-1"
          />
        </div>

        {/* Right sidebar */}
        <div className="w-[280px] flex flex-col gap-3">
          {/* Topic Tags */}
          <div className="p-3 text-[#6b6b80] bg-[#111118] border border-[#ffffff18] font-heading rounded-lg">
            <h6 className="text-[0.65rem]">TOPIC TAGS</h6>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((item) => (
                <div
                  key={item}
                  onClick={() => handleMultiSelect(item)}
                  className={`p-1 text-[0.65rem] border border-[#ffffff18] rounded-[5px] cursor-pointer hover:bg-[#7c6dfa] hover:text-[#fff] hover:border-[#7c6dfa] transition-all duration-150
                  
                  ${
                    selectedMulti.includes(item)
                      ? "bg-[#7c6dfa] text-white border-[#7c6dfa]"
                      : "border-[#ffffff18] hover:bg-[#7c6dfa] hover:text-white hover:border-[#7c6dfa]"
                  }
                `}
                >
                  {item}
                </div>
              ))}
              <div className="p-1 text-[0.65rem] border border-[#ffffff18] rounded-[5px] cursor-pointer hover:bg-[#7c6dfa] hover:text-[#fff] hover:border-[#7c6dfa] transition-all duration-150">
                + Add
              </div>
            </div>
          </div>

          {/* Feels like */}
          <div className="p-3 text-[#6b6b80] bg-[#111118] border border-[#ffffff18] font-heading rounded-lg">
            <h6 className="text-[0.65rem]">HOW DID IT FEEL?</h6>
            <div className="flex gap-4 mt-2">
              {feelsLike.map((item) => (
                <div
                  key={item}
                  onClick={() => handleSelectMood(item)}
                  className={`px-3 py-1 border border-[#ffffff18] rounded-[5px] cursor-pointer hover:bg-[#7c6dfa22] hover:border-[#7c6dfa] transition-[background,border] duration-150 
                ${
                  selectedMood === item
                    ? "bg-[#7c6dfa22] !border-[#7c6dfa]"
                    : "hover:bg-[#7c6dfa22] hover:border-[#7c6dfa]"
                }
                `}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Entry Type */}
          <div className="p-3 text-[#6b6b80] bg-[#111118] border border-[#ffffff18] font-heading rounded-lg">
            <h6 className="text-[0.65rem]">ENTRY TYPE</h6>
            <div className="flex flex-wrap gap-2 mt-2">
              {types.map((item) => (
                <div
                  key={item}
                  onClick={() => handleSelectType(item)}
                  className={`py-1 px-2 text-[0.65rem] border rounded-[5px] cursor-pointer transition-all duration-150
                
                ${
                  selectedType === item
                    ? "bg-[#7c6dfa] text-white border-[#7c6dfa]"
                    : "border-[#ffffff18] hover:bg-[#7c6dfa] hover:text-white hover:border-[#7c6dfa]"
                }
              `}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* AI SUGGESTION */}
          <div className="p-3 text-[#6b6b80] bg-[#7c6dfa22] border border-[#7c6dfa33] font-body font-medium rounded-lg">
            <h6 className="text-[0.6rem] tracking-wider">AI SUGGESTION</h6>
            <div className="flex items-center text-[0.65rem] tracking-wider leading-[1.2rem] mt-2">
              Based on your recent entries, you might want to connect this to
              your useEffect notes from May 15. Should I link them?
            </div>
            <button className="w-full flex items-center mt-3 border-none text-[0.65rem] font-heading font-bold p-[8px] bg-[#7c6dfa] text-white rounded-lg hover:bg-[#a78bfa] cursor-pointer hover:-translate-y-px transition-[background,transform] duration-200">
              ◎ Yes, link entries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteEntry;
