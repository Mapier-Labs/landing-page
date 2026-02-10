"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed, please try again later");
      }

      setIsSuccess(true);
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed, please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section
        id="waitlist"
        className="py-24 px-6 sm:px-8 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600 mb-8">
            We&apos;ll notify you as soon as the product launches
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Submit Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="waitlist"
      className="py-24 px-6 sm:px-8 bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Join the Waitlist</h2>
          <p className="text-xl text-gray-600">
            Be among the first to experience Mapier AI navigation and discover the power of
            intelligent navigation
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="waitlist-name" className="sr-only">
              Your Name
            </label>
            <input
              id="waitlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="waitlist-email" className="sr-only">
              Your Email Address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          We promise not to share your information with third parties
        </p>
      </div>
    </section>
  );
}
