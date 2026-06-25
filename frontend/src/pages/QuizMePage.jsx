import React, { useState } from "react";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import {
  TbFileText,
  TbBooks,
  TbSparkles,
  TbPlayerPlay,
  TbCheck,
} from "react-icons/tb";
import { useGetEntriesQuery } from "../store/api/entryAPI";
import {
  useGenerateQuizMutation,
  useSaveQuizMutation,
  useGetQuizHistoryQuery,
} from "../store/api/quizApi";
import { toast } from "react-hot-toast";

function QuizMePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("single");
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [questionCount, setQuestionCount] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [quizMeta, setQuizMeta] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const { data } = useGetEntriesQuery();
  const entries = data?.entries ?? [];
  const [generateQuiz] = useGenerateQuizMutation();
  const [saveQuiz] = useSaveQuizMutation();

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    try {
      const payload =
        mode === "all"
          ? { mode: "all", questionCount }
          : { entryId: selectedEntryId, mode: "single", questionCount };

      // ── MOCK DATA — remove this when testing API again ──
      // const mockResult = {
      //   quizTitle: "JWT Auth — finally clicked",
      //   mode: mode,
      //   entryIds: [selectedEntryId],
      //   questions: [
      //     {
      //       question: "What is the main purpose of JWT middleware in Express?",
      //       options: [
      //         "Store session data on the server",
      //         "Verify user identity on each request",
      //         "Encrypt the database connection",
      //         "Hash the user password",
      //       ],
      //       answer: 1,
      //       explanation:
      //         "JWT tokens verify identity on each request. The server signs the token at login and verifies it on every protected route.",
      //     },
      //     {
      //       question: "What does select: false do on a Mongoose schema field?",
      //       options: [
      //         "Deletes the field from the DB",
      //         "Makes the field optional",
      //         "Excludes it from query results by default",
      //         "Makes the field read-only",
      //       ],
      //       answer: 2,
      //       explanation:
      //         "select: false means the field won't be returned unless you explicitly add .select('+fieldName').",
      //     },
      //     {
      //       question: "Why should API keys always be stored in the backend?",
      //       options: [
      //         "Frontend code is slower",
      //         "Anyone can see frontend code in dev tools",
      //         "Backend uses HTTPS only",
      //         "API keys don't work in JavaScript",
      //       ],
      //       answer: 1,
      //       explanation:
      //         "Frontend code is visible to anyone who opens browser dev tools. Keys stored there are exposed to every visitor.",
      //     },
      //   ],
      // };

        const result = await generateQuiz(payload).unwrap();

      // setQuestions(mockResult.questions);
      // setQuizMeta({
      //   title: mockResult.quizTitle,
      //   mode: mockResult.mode,
      //   entryIds: mockResult.entryIds,
      // });
      // setScreen("question");
      // setIsGenerating(false);
      // ── END MOCK ──

      // store questions and meta for use in quiz screen
        setQuestions(result.questions);
        setQuizMeta({
          title: result.quizTitle,
          mode: result.mode,
          entryIds: result.entryIds,
        });

        setScreen("question");
    } catch (err) {
      toast.error("Could not generate quiz — try again");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinishQuiz = async (score, total, results) => {
    setQuizScore({ score, total, results });
    try {
      await saveQuiz({
        entryIds: quizMeta.entryIds,
        mode: quizMeta.mode,
        score,
        total,
        results: results.map((r) => ({
          question: r.question,
          userAnswer: r.userAnswerIdx,
          correctAnswer: r.correctAnswerIdx,
          isCorrect: r.isCorrect,
        })),
      }).unwrap();
    } catch (err) {
      console.error(err); // non-critical, still show results
    }
    setScreen("results");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {screen === "landing" && (
        <>
          <TopBar
            title="Quiz mode"
            subtitle="Test yourself on what you've learned"
            actions={
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setScreen("history")}
                  className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200"
                >
                  History
                </button>
              </>
            }
          />
          <div className="p-4 flex-1 overflow-y-auto">
            <h5 className="font-heading font-bold text-[13px]">Choose Mode</h5>
            <div className="flex justify-center items-center w-[60vw] gap-10 mt-3">
              <div
                onClick={() => setMode("single")}
                className={`flex flex-col justify-center p-4 rounded-[8px] border cursor-pointer transition-all duration-150
                ${
                  mode === "single"
                    ? "bg-[#7c6dfa18] border-[#7c6dfa]"
                    : "bg-[#111118] border-[#ffffff0f] hover:border-[#ffffff18]"
                }`}
              >
                <TbFileText
                  size={28}
                  className="bg-[#7c6dfa18] text-[#a78bfa] border border-[#7c6dfa22] rounded-[5px] p-1 "
                />
                <h5 className="font-body !text-white mt-1 text-[0.85rem] font-bold leading-tight">
                  Single Entry
                </h5>
                <p className="font-body leading-tight mt-2 text-[0.75rem]">
                  Pick one journal entry and get quizzed on that specific topic
                </p>
                <span className="px-2 py-1 mt-2 self-start text-[0.54rem] rounded-[10px] font-semibold bg-[#7c6dfa18] text-[#a78bfa] border border-[#7c6dfa22]">
                  focused review
                </span>
              </div>
              <div
                onClick={() => setMode("all")}
                className={`flex flex-col justify-center p-4 rounded-[8px] border cursor-pointer transition-all duration-150
                ${
                  mode === "all"
                    ? "bg-[#7c6dfa18] border-[#7c6dfa]"
                    : "bg-[#111118] border-[#ffffff0f] hover:border-[#ffffff18]"
                }`}
              >
                <TbBooks
                  size={28}
                  className="bg-[#22d3a318] text-[#22d3a3] border border-[#22d3a322] rounded-[5px] p-1 "
                />
                <h5 className="font-body !text-white mt-1 text-[0.85rem] font-bold leading-tight">
                  All Entries
                </h5>
                <p className="font-body leading-tight mt-2 text-[0.75rem]">
                  Quiz across everything you've written — great for general
                  revision
                </p>
                <span className="px-2 py-1 mt-2 self-start text-[0.54rem] rounded-[10px] font-semibold bg-[#22d3a318] text-[#22d3a3] border border-[#22d3a322]">
                  full revision
                </span>
              </div>
            </div>
            {/* single mode */}
            {mode === "single" && (
              <div className="mt-4 bg-[#111118] rounded-[8px] border border-[#ffffff0f] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#ffffff0f]">
                  <span className="font-body !text-white text-[0.75rem] font-bold">
                    Select an entry
                  </span>
                  <span className="font-body text-[0.65rem]">
                    {selectedEntryId ? "1 selected" : "0 selected"}
                  </span>
                </div>
                <div className="flex flex-col max-h-[220px] overflow-y-auto">
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      onClick={() => setSelectedEntryId(entry._id)}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-[#ffffff0f] cursor-pointer transition-all duration-150
                    ${
                      selectedEntryId === entry._id
                        ? "bg-[#7c6dfa18] border-l-2 border-l-[#7c6dfa]"
                        : "hover:bg-[#ffffff08]"
                    }`}
                    >
                      {/* check circle */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150
                    ${
                      selectedEntryId === entry._id
                        ? "bg-[#7c6dfa] border-[#7c6dfa]"
                        : "border-[#ffffff18]"
                    }`}
                      >
                        {selectedEntryId === entry._id && (
                          <TbCheck size={10} className="text-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-[0.75rem] truncate">
                          {entry.title}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {entry.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-[0.54rem] px-1.5 py-0.5 rounded-full bg-[#7c6dfa18] !text-[#a78bfa]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="font-body text-[0.6rem] text-[#6b6b80] flex-shrink-0">
                        {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* all mode */}
            {mode === "all" && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-[#22d3a318] border border-[#22d3a322] rounded-[8px]">
                <TbSparkles
                  size={24}
                  className="text-[#22d3a3] flex-shrink-0"
                />
                <div>
                  <p className="font-body text-[0.8rem] !text-white font-bold">
                    Quizzing across all your entries
                  </p>
                  <p className="font-body text-[0.7rem] !text-[#6b6b80] mt-1">
                    AI will pick the most relevant concepts from everything
                    you've written
                  </p>
                </div>
              </div>
            )}

            {/* Question counter */}
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]">
              <span className="font-body text-[0.75rem] text-[#6b6b80]">
                Number of questions
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setQuestionCount((prev) => Math.max(1, prev - 1))
                  }
                  disabled={questionCount === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#ffffff18] text-[#6b6b80] hover:bg-[#1a1a24] hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  -
                </button>

                <span className="font-heading font-bold text-[0.95rem] text-white min-w-[16px] text-center">
                  {questionCount}
                </span>

                <button
                  onClick={() =>
                    setQuestionCount((prev) => Math.min(5, prev + 1))
                  }
                  disabled={questionCount === 5}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#ffffff18] text-[#6b6b80] hover:bg-[#1a1a24] hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
            <button
              disabled={isGenerating || (mode === "single" && !selectedEntryId)}
              onClick={handleStartQuiz}
              className="w-full mt-4 py-3 bg-[#7c6dfa] text-white font-heading font-bold text-[0.8rem] rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#a78bfa] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbPlayerPlay size={16} />
              {isGenerating
                ? "Generating questions..."
                : mode === "single" && !selectedEntryId
                  ? "Select an entry to start"
                  : "Start quiz"}
            </button>
          </div>
        </>
      )}
      {screen === "question" && (
        <QuizQuestion
          questions={questions}
          quizMeta={quizMeta}
          onFinish={handleFinishQuiz}
          onExit={() => setScreen("landing")}
        />
      )}

      {screen === "results" && (
        <QuizResults
          questions={questions}
          quizScore={quizScore}
          quizMeta={quizMeta}
          onRetry={handleStartQuiz}
          isGenerating={isGenerating}
          onNew={() => {
            setScreen("landing");
            setSelectedEntryId(null);
          }}
        />
      )}

      {screen === "history" && (
        <QuizHistory onBack={() => setScreen("landing")} />
      )}
    </div>
  );
}

export default QuizMePage;

function QuizQuestion({ questions, quizMeta, onFinish, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [resultLog, setResultLog] = useState([]);
  const [score, setScore] = useState(0);

  const letters = ["A", "B", "C", "D"];
  const q = questions[current];
  const total = questions.length;
  const pct = Math.round(((current + 1) / total) * 100);

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
  };

  const handleCheck = () => {
    // ── SECOND CLICK (answered is true) ──
    // user already submitted, now clicking "Next question" or "See results"
    if (answered) {
      if (current + 1 >= total) {
        onFinish(score, total, resultLog);
      } else {
        setCurrent((prev) => prev + 1);
        setSelected(null); // reset selection for next question
        setAnswered(false); // reset answered for next question
      }
      return;
    }

    // ── FIRST CLICK (answered is false) ──
    // user is submitting their answer for the first time
    if (selected === null) return; // nothing chosen yet

    setAnswered(true); // ← lock it in
    const correct = selected === q.answer;
    if (correct) setScore((prev) => prev + 1);
    setResultLog((prev) => [...prev, buildResult(selected)]);
    // button now shows "Next question" or "See results"
  };

  const buildResult = (userAnswer) => ({
    question: q.question,
    userAnswer: userAnswer !== null ? q.options[userAnswer] : "Skipped",
    correctAnswer: q.options[q.answer],
    isCorrect: userAnswer === q.answer,
    userAnswerIdx: userAnswer ?? -1, // for backend
    correctAnswerIdx: q.answer, // for backend
  });

  const handleSkip = () => {
    setResultLog((prev) => [...prev, buildResult(null)]);
    if (current + 1 >= total) {
      onFinish(score, total, [...resultLog, buildResult(null)]);
    } else {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title={quizMeta?.title}
        subtitle={`${quizMeta?.mode} · ${total} questions`}
        actions={
          <button
            onClick={onExit}
            className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] cursor-pointer hover:bg-[#ffffff18] hover:text-white transition-all duration-200"
          >
            ✕ Exit
          </button>
        }
      />

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-[4px] bg-[#1a1a24] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7c6dfa] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-body text-[0.65rem] !text-[#6b6b80] whitespace-nowrap">
            {current + 1} / {total}
          </span>
        </div>

        {/* Question */}
        <div className="bg-[#111118] rounded-[8px] border border-[#ffffff0f] p-4 mb-3">
          <p className="font-body text-[0.65rem] !text-[#7c6dfa] tracking-widest mb-2">
            QUESTION {String(current + 1).padStart(2, "0")}
          </p>
          <p className="font-heading font-bold text-[0.95rem] leading-snug mb-4">
            {q.question}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <div
                key={i}
                onClick={() => handleSelect(i)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] border cursor-pointer transition-all duration-150
                  ${
                    answered && i === q.answer
                      ? "bg-[#22d3a318] border-[#22d3a3]"
                      : answered && i === selected && selected !== q.answer
                        ? "bg-[#f8717118] border-[#f87171]"
                        : selected === i && !answered
                          ? "bg-[#7c6dfa18] border-[#7c6dfa]"
                          : "bg-[#1a1a24] border-[#ffffff0f] hover:border-[#ffffff18]"
                  } ${answered ? "cursor-default" : ""}`}
              >
                {/* letter circle */}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-[0.6rem] font-body !text-white font-bold transition-all duration-150
                  ${
                    answered && i === q.answer
                      ? "bg-[#22d3a3] border-[#22d3a3] text-white"
                      : answered && i === selected && selected !== q.answer
                        ? "bg-[#f87171] border-[#f87171] text-white"
                        : selected === i && !answered
                          ? "bg-[#7c6dfa] border-[#7c6dfa] text-white"
                          : "border-[#ffffff18] text-[#6b6b80]"
                  }`}
                >
                  {letters[i]}
                </div>
                <span className="font-body !text-white text-[0.75rem]">
                  {opt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`p-3 rounded-[8px] border mb-3 font-body text-[0.72rem] leading-relaxed
            ${
              selected === q.answer
                ? "bg-[#22d3a318] border-[#22d3a322] !text-[#22d3a3]"
                : "bg-[#f8717118] border-[#f8717122] !text-[#f87171]"
            }`}
          >
            {selected === q.answer ? "Correct! " : "Not quite. "}
            <span className="text-white">{q.explanation}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          {!answered && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 font-heading font-bold text-[0.75rem] text-[#6b6b80] border border-[#ffffff18] rounded-[8px] hover:bg-[#1a1a24] hover:text-white transition-all duration-150"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={!answered && selected === null}
            className="ml-auto px-5 py-2 bg-[#7c6dfa] text-white font-heading font-bold text-[0.75rem] rounded-[8px] hover:bg-[#a78bfa] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {answered
              ? current + 1 >= total
                ? "See results"
                : "Next question"
              : "Check answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizResults({ questions, quizScore, quizMeta, onRetry, onNew, isGenerating }) {
  const { score, total, results } = quizScore;

  const getTitle = () => {
    const pct = score / total;
    if (pct === 1) return "Perfect score!";
    if (pct >= 0.6) return "Good work!";
    return "Keep going!";
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Quiz complete"
        subtitle={`${quizMeta?.mode} · ${total} questions`}
      />
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Score circle */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full border-[3px] border-[#7c6dfa] flex flex-col items-center justify-center mb-3">
            <span className="font-heading font-bold text-[1.8rem] text-[#7c6dfa] leading-none">
              {score}
            </span>
            <span className="font-body text-[0.6rem] !text-[#6b6b80]">
              out of {total}
            </span>
          </div>
          <h2 className="font-heading font-bold text-[1.1rem]">{getTitle()}</h2>
          <p className="font-body text-[0.72rem] !text-[#6b6b80] mt-1">
            {score === total
              ? "You really know this material!"
              : `You got ${score} out of ${total} correct`}
          </p>
        </div>

        {/* Breakdown */}
        <p className="font-body text-[0.65rem] tracking-widest mb-2">
          QUESTION BREAKDOWN
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${r.isCorrect ? "bg-[#22d3a318] text-[#22d3a3]" : "bg-[#f8717118] text-[#f87171]"}`}
              >
                {r.isCorrect ? (
                  <TbCheck size={11} />
                ) : (
                  <span className="text-[9px] font-bold">✕</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[0.72rem] !text-white leading-snug">
                  {questions[i]?.question}
                </p>
                {!r.isCorrect && (
                  <p className="font-body text-[0.65rem] !text-[#6b6b80] mt-1">
                    {r.userAnswer === "Skipped"
                      ? "Skipped"
                      : `You picked ${r.userAnswer}`}
                    {" — "}
                    <span className="!text-[#22d3a3]">
                      Answer: {r.correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            disabled={isGenerating}
            className="flex-1 py-2.5 font-heading font-bold text-[0.75rem] text-[#6b6b80] cursor-pointer border border-[#ffffff18] rounded-[8px] hover:bg-[#1a1a24] hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Try again"}
          </button>
          <button
            onClick={onNew}
            className="flex-1 py-2.5 bg-[#7c6dfa] text-white font-heading font-bold text-[0.75rem] cursor-pointer rounded-[8px] hover:bg-[#a78bfa] transition-all duration-150"
          >
            New quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizHistory({ onBack }) {
  const { data, isLoading } = useGetQuizHistoryQuery();
  const quizzes = data?.quizzes ?? [];

  const getScoreColor = (score, total) => {
    const pct = score / total;
    if (pct === 1) return "text-[#22d3a3]";
    if (pct >= 0.6) return "text-[#f59e0b]";
    return "text-[#f87171]";
  };

  const getScoreBg = (score, total) => {
    const pct = score / total;
    if (pct === 1) return "bg-[#22d3a318] border-[#22d3a322]";
    if (pct >= 0.6) return "bg-[#f59e0b18] border-[#f59e0b22]";
    return "bg-[#f8717118] border-[#f8717122]";
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Quiz history"
        subtitle="all your past quiz attempts"
        actions={
          <button
            onClick={onBack}
            className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] cursor-pointer hover:bg-[#ffffff18] hover:text-white transition-all duration-200"
          >
            ← Back
          </button>
        }
      />

      <div className="p-4 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-[#111118] rounded-[8px] border border-[#ffffff0f] animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && quizzes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
            <div className="w-14 h-14 rounded-full bg-[#111118] border border-[#ffffff0f] flex items-center justify-center">
              <TbBooks size={24} className="text-[#6b6b80]" />
            </div>
            <p className="font-heading font-bold text-[0.85rem]">No quizzes yet</p>
            <p className="font-body text-[0.72rem] text-[#6b6b80]">
              Complete a quiz to see your history here
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 bg-[#7c6dfa] text-white font-heading font-bold text-[0.75rem] rounded-[8px] hover:bg-[#a78bfa] transition-all duration-150"
            >
              Start a quiz
            </button>
          </div>
        )}

        {!isLoading && quizzes.length > 0 && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="flex flex-col p-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]">
                <span className="font-body text-[0.6rem] tracking-widest">TOTAL</span>
                <span className="font-heading font-bold text-[1.3rem] mt-1">{quizzes.length}</span>
                <span className="font-body text-[0.6rem]">quizzes taken</span>
              </div>
              <div className="flex flex-col p-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]">
                <span className="font-body text-[0.6rem] tracking-widest">BEST</span>
                <span className="font-heading font-bold text-[1.3rem] mt-1 text-[#22d3a3]">
                  {Math.max(...quizzes.map(q => Math.round((q.score / q.total) * 100)))}%
                </span>
                <span className="font-body text-[0.6rem] ">best score</span>
              </div>
              <div className="flex flex-col p-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]">
                <span className="font-body text-[0.6rem] tracking-widest">AVG</span>
                <span className="font-heading font-bold text-[1.3rem] mt-1 text-[#f59e0b]">
                  {Math.round(quizzes.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / quizzes.length)}%
                </span>
                <span className="font-body text-[0.6rem] ">average score</span>
              </div>
            </div>

            {/* History list */}
            <p className="font-body text-[0.65rem] tracking-widest mb-2">
              PAST QUIZZES
            </p>
            <div className="flex flex-col gap-2">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="flex items-center gap-3 p-3 bg-[#111118] rounded-[8px] border border-[#ffffff0f]"
                >
                  {/* Score badge */}
                  <div className={`w-12 h-12 rounded-[8px] border flex flex-col items-center justify-center flex-shrink-0 ${getScoreBg(quiz.score, quiz.total)}`}>
                    <span className={`font-heading font-bold text-[1rem] leading-none ${getScoreColor(quiz.score, quiz.total)}`}>
                      {quiz.score}/{quiz.total}
                    </span>
                    <span className="font-body text-[0.5rem] text-[#6b6b80] mt-0.5">
                      {Math.round((quiz.score / quiz.total) * 100)}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-[0.8rem] truncate">
                      {quiz.entries?.length > 0
                        ? quiz.entries[0]?.title
                        : "All entries"
                      }
                    </p>
                    <p className="font-body text-[0.65rem] text-[#6b6b80] mt-0.5">
                      {quiz.mode} · {quiz.total} questions · {new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Result icon */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${getScoreBg(quiz.score, quiz.total)}`}>
                    {quiz.score === quiz.total
                      ? <TbCheck size={14} className="text-[#22d3a3]" />
                      : <span className={`font-bold text-[10px] ${getScoreColor(quiz.score, quiz.total)}`}>
                          {quiz.score < quiz.total / 2 ? "✕" : "~"}
                        </span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}