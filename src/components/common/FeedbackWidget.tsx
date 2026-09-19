import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, MessageSquare } from 'lucide-react';

interface FeedbackWidgetProps {
  toolSlug: string;
  toolName: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ toolSlug, toolName }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handlePositiveFeedback = () => {
    setFeedbackGiven('yes');
    setSubmitted(true);
    try {
      const logs = JSON.parse(localStorage.getItem('zeta_calculator_feedback_logs') || '[]');
      logs.push({ toolSlug, rating: 'yes', timestamp: Date.now() });
      localStorage.setItem('zeta_calculator_feedback_logs', JSON.stringify(logs.slice(-50)));
    } catch {
      // ignore
    }
  };

  const handleNegativeFeedback = () => {
    setFeedbackGiven('no');
  };

  const handleSubmitNegative = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const logs = JSON.parse(localStorage.getItem('zeta_calculator_feedback_logs') || '[]');
      logs.push({
        toolSlug,
        rating: 'no',
        reason: reason || 'other',
        comment,
        timestamp: Date.now(),
      });
      localStorage.setItem('zeta_calculator_feedback_logs', JSON.stringify(logs.slice(-50)));
    } catch {
      // ignore
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
        <Check className="w-4 h-4 text-emerald-600" />
        <span>Thank you for helping us improve {toolName}!</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3">
      {feedbackGiven !== 'no' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">Was this calculator helpful?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-feedback-yes"
              onClick={handlePositiveFeedback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors font-semibold cursor-pointer shadow-2xs"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              id="btn-feedback-no"
              onClick={handleNegativeFeedback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50/50 transition-colors font-semibold cursor-pointer shadow-2xs"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
              <span>No</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitNegative} className="space-y-3 pt-1">
          <p className="font-semibold text-slate-800">What could be improved?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'calc_issue', label: 'Calculation issue' },
              { id: 'explanation_issue', label: 'Explanation issue' },
              { id: 'missing_feature', label: 'Missing feature' },
              { id: 'wrong_unit', label: 'Wrong unit' },
              { id: 'mobile_layout', label: 'Layout problem' },
              { id: 'other', label: 'Other' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-2 rounded-lg border text-[11px] cursor-pointer text-center select-none font-medium transition-colors ${
                  reason === opt.id
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="radio"
                  name="feedbackReason"
                  value={opt.id}
                  checked={reason === opt.id}
                  onChange={(e) => setReason(e.target.value)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional details..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFeedbackGiven(null)}
              className="px-3 py-1 text-slate-500 hover:text-slate-700 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
