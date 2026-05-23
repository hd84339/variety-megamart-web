import { useState } from "react";
import { addReview } from "../../../services/reviewService";
import StarRating from "./StarRating";
import { MessageSquarePlus, AlertCircle, ShieldCheck } from "lucide-react";

const AddReview = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) return;

    try {
      setLoading(true);

      await addReview({
        productId,
        product_id: productId,
        rating,
        comment: comment.trim(),
      });

      setComment("");
      setRating(5);

      if (typeof onReviewAdded === "function") {
        onReviewAdded();
      }

    } catch (err) {
      console.error("Add review failed:", err);
      setError(err.response?.data?.message || "Failed to finalize sync. Please retry entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/40 transition-all font-sans">
      
      {/* HEADER SECTION: SYSTEM LEDGER SPEC */}
      <div className="mb-6 flex items-start gap-4 pb-5 border-b border-slate-50">
        <div className="p-3 bg-blue-50/50 text-[#1d6acf] rounded-xl border border-blue-100/30">
          <MessageSquarePlus size={20} strokeWidth={1.5} />
        </div>
        <div>
          <span className="text-[9px] font-mono font-black text-[#1d6acf] uppercase tracking-[0.3em] block mb-0.5">
            FEEDBACK_NODE // MATRIX_ENGAGEMENT
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tighter uppercase">
            Share Your Thoughts
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
            Your review aligns global community clarity with item verification metrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* INTERACTIVE STAR NODE */}
        <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">
              Overall Evaluation
            </label>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Select rating assignment
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transform active:scale-90 hover:scale-110 transition-all duration-150 focus:outline-none"
              >
                <StarRating rating={star <= rating ? 1 : 0} maxStars={1} />
              </button>
            ))}
            <span className="text-[10px] font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded ml-3">
              {rating}.0 // 5.0
            </span>
          </div>
        </div>

        {/* DETAILS ENTRY COMPONENT */}
        <div className="space-y-2">
          <label htmlFor="review-comment" className="block text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
            Review Details Dossier
          </label>
          <div className="relative">
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Elaborate on structural performance build quality, features, or design fidelity..."
              className="w-full bg-white border-2 border-slate-100 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1d6acf] focus:bg-white transition-all resize-none shadow-inner"
              required
            />
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-30 select-none pointer-events-none">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">REAL_TIME_INPUT</span>
            </div>
          </div>
        </div>

        {/* ERROR EXCEPTION ALERT */}
        {error && (
          <div className="text-xs font-mono font-bold text-red-600 bg-red-50/70 border border-red-100 rounded-xl p-4 flex items-center gap-3 animate-headShake">
            <AlertCircle size={16} className="shrink-0" />
            <span className="uppercase tracking-wide">{error}</span>
          </div>
        )}

        {/* TRANSACTION ACTION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest">
            <ShieldCheck size={12} className="text-slate-200" /> Secure Encryption Node Verified
          </div>
          
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white text-[10px] font-mono font-black text-uppercase tracking-[0.25em] rounded-xl hover:bg-[#1d6acf] disabled:bg-slate-100 disabled:text-slate-300 transition-all duration-300 shadow-md transform active:scale-95 disabled:pointer-events-none hover:-translate-y-0.5"
          >
            {loading ? "TRANSMITTING..." : "PUBLISH_REVIEW // SUBMIT"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddReview;