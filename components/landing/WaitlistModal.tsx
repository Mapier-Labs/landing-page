"use client";

import { useState, useRef, useEffect } from "react";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes - deferred to avoid cascading renders
  const resetForm = () => {
    setName("");
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
  };

  useEffect(() => {
    if (open) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        nameRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
    // Defer reset to next tick to avoid synchronous setState in effect
    const timer = setTimeout(resetForm, 0);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // response wasn't JSON (e.g. 502 gateway error)
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error, please try again");
    }
  };

  return (
    <div className="waitlist-overlay" onClick={onClose}>
      <div className="waitlist-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="waitlist-card__x" onClick={onClose} aria-label="Close">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        {status === "success" ? (
          <>
            <p className="waitlist-card__title">You&apos;re on the list!</p>
            <p className="waitlist-card__subtitle">
              We&apos;ll reach out when it&apos;s your turn.
            </p>
            <button type="button" className="waitlist-card__done" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <p className="waitlist-card__title">Join the Waitlist</p>
            <form onSubmit={handleSubmit} className="waitlist-card__form">
              <div className="waitlist-card__inputs">
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="waitlist-card__input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="waitlist-card__input"
                />
              </div>
              {errorMsg && <p className="waitlist-card__error">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="waitlist-card__submit"
              >
                {status === "loading" ? "Submitting..." : "Join"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
