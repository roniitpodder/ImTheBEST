import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Code2 } from 'lucide-react';

export const WeeklyTestsView: React.FC = () => {
  const { weeklyTests, submitTestScore } = useApp();

  const [selectedTestId, setSelectedTestId] = useState<string>(weeklyTests[0]?.id || 'test-w1');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedTest = weeklyTests.find(t => t.id === selectedTestId) || weeklyTests[0];
  const answeredCount = selectedTest.questions.filter(
    q => selectedAnswers[q.id] !== undefined
  ).length;
  const allAnswered = answeredCount === selectedTest.questions.length;

  const attemptedTests = weeklyTests.filter(t => t.completed);
  const avgScore =
    attemptedTests.length > 0
      ? Math.round(attemptedTests.reduce((a, b) => a + b.score, 0) / attemptedTests.length)
      : 0;

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleGrade = async () => {
    if (!allAnswered) return;
    let correct = 0;
    selectedTest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / selectedTest.questions.length) * 100);
    await submitTestScore(selectedTest.id, finalScore);
    setIsSubmitted(true);

    if (finalScore >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Weekly Assessment & Diagnostic Tests
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              Every 7 Study Days
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Validate retention with technical MCQs, algorithmic complexity trade-offs, and practical coding exercises.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <span className="text-neutral-500 dark:text-neutral-400">
            Completed: <strong className="text-neutral-900 dark:text-neutral-100">{attemptedTests.length}/{weeklyTests.length}</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Avg: <strong className="text-blue-600 dark:text-blue-400">{attemptedTests.length > 0 ? `${avgScore}%` : '—'}</strong>
          </span>
        </div>
      </div>

      {/* Test Selection Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {weeklyTests.map(t => {
          const isSelected = selectedTest.id === t.id;

          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTestId(t.id);
                setSelectedAnswers({});
                setIsSubmitted(false);
              }}
              className={`px-4 py-3 rounded-2xl whitespace-nowrap text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider">
                Week {t.weekNumber} Diagnostic
              </div>
              <div className="text-xs font-semibold truncate max-w-[190px] mt-0.5">
                {t.title.split(':')[1]?.trim() || t.title}
              </div>
              <div className="text-[10px] mt-1 font-medium">
                {t.completed ? (
                  <span className={isSelected ? 'text-white' : 'text-emerald-500 font-bold'}>
                    Score: {t.score}%
                  </span>
                ) : (
                  <span className={isSelected ? 'text-white/80' : 'text-neutral-400'}>
                    Unattempted
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Quiz Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                Week {selectedTest.weekNumber} Assessment
              </span>
              {selectedTest.completed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  Recorded Score: {selectedTest.score}%
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {selectedTest.title}
            </h3>
          </div>

          {/* Practical Coding Challenge Tag */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800 text-xs max-w-md">
            <div className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
              <Code2 className="w-3.5 h-3.5" />
              <span>Practical Coding Challenge</span>
            </div>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300 font-medium">
              {selectedTest.codingTask}
            </p>
          </div>
        </div>

        {/* Questions list */}
        <div className="mt-6 space-y-6">
          {selectedTest.questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#202025] border border-neutral-200 dark:border-neutral-800/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Question {idx + 1} • {q.topic}
                </span>
              </div>

              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1.5">
                {q.question}
              </p>

              <div className="mt-4 space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isChosen = selectedAnswers[q.id] === oIdx;
                  let optStyle =
                    'bg-white dark:bg-[#18181B] border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-400';

                  if (isSubmitted) {
                    if (oIdx === q.correctAnswer) {
                      optStyle =
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isChosen && oIdx !== q.correctAnswer) {
                      optStyle =
                        'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-600 dark:text-red-400 font-bold';
                    }
                  } else if (isChosen) {
                    optStyle =
                      'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold';
                  }

                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition select-none flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && oIdx === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200 text-xs">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!isSubmitted ? (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Answered {answeredCount} of {selectedTest.questions.length} questions
              {!allAnswered && ' — select an answer for every question to submit.'}
            </span>
            <button
              onClick={handleGrade}
              disabled={!allAnswered}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit & Grade Weekly Assessment
            </button>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-[#202025] text-xs">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Assessment results saved ({selectedTest.score}%).
            </span>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Retake Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
