import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ToolUIPart } from "ai";
import { MessageCircle, X, RotateCcw, Minus } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import assistantAvatar from "@/assets/chat-assistant-avatar.png";

const VISITOR_KEY = "bndbox_chat_visitor_id";
const OPEN_KEY = "bndbox_chat_open";

function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

const SUGGESTIONS = [
  "How do I become an approved reseller?",
  "What do brands get from BndBox?",
  "How much does BndBox cost?",
  "What documents do I need for Amazon ungating?",
];

const TOOL_LABELS: Record<string, string> = {
  "tool-search_brands": "Searching the brand directory",
  "tool-count_brands": "Counting brands",
  "tool-search_distributors": "Searching distributors",
  "tool-capture_lead": "Saving your details",
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [visitorId] = useState(getVisitorId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(OPEN_KEY) === "1") setOpen(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(OPEN_KEY, open ? "1" : "0");
  }, [open]);

  const { messages, sendMessage, status, error, stop } = useChat({
    id: `bndbox-chat-${chatKey}`,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: {
        visitorId,
        path: typeof window !== "undefined" ? window.location.pathname : null,
      },
    }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  const focusInput = () => {
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  useEffect(() => {
    if (open) focusInput();
  }, [open, chatKey]);

  useEffect(() => {
    if (status === "ready") focusInput();
  }, [status]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    sendMessage({ text: value });
    focusInput();
  };

  const handleSubmit = (message: PromptInputMessage) => {
    submit(message.text ?? "");
  };

  const resetChat = () => {
    stop();
    setChatKey((k) => k + 1);
  };

  return (
    <>
      {/* Launcher */}
      <button
        aria-label={open ? "Close BndBox assistant" : "Open BndBox assistant"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="BndBox assistant"
          className={cn(
            "fixed z-[59] flex flex-col overflow-hidden border bg-background shadow-2xl",
            "inset-x-3 bottom-24 top-16 rounded-2xl",
            "sm:inset-x-auto sm:top-auto sm:bottom-24 sm:right-5 sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
            <img
              src={assistantAvatar}
              alt="BndBox assistant"
              width={512}
              height={512}
              loading="lazy"
              className="h-9 w-9 rounded-lg bg-primary-foreground/10 p-1"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">BndBox Assistant</p>
              <p className="truncate text-xs opacity-80">
                Answers on brands, resellers &amp; wholesale
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Start a new conversation"
              onClick={resetChat}
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <RotateCcw />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Minimise chat"
              onClick={() => setOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <Minus />
            </Button>
          </div>

          {/* Transcript */}
          <Conversation className="flex-1">
            <ConversationContent className="gap-3 p-4">
              {messages.length === 0 ? (
                <div className="space-y-4 py-4">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">
                      Hi 👋 I'm the BndBox assistant.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about getting approved with brands, joining as a
                      brand or distributor, pricing, or Amazon wholesale requirements.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>

                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <MessageResponse key={`${message.id}-t-${i}`}>
                              {part.text}
                            </MessageResponse>
                          );
                        }
                        if (part.type.startsWith("tool-")) {
                          const toolPart = part as ToolUIPart;
                          return (
                            <Tool defaultOpen={false} key={`${message.id}-x-${i}`}>
                              <ToolHeader
                                type={toolPart.type}
                                state={toolPart.state}
                                title={TOOL_LABELS[toolPart.type] ?? toolPart.type}
                              />
                              <ToolContent>
                                <ToolInput input={toolPart.input} />
                                <ToolOutput
                                  output={toolPart.output}
                                  errorText={toolPart.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}

              {status === "submitted" && (
                <Shimmer className="px-1 text-sm">Thinking…</Shimmer>
              )}

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Something went wrong. Please try again, or email support@bndbox.com.
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Composer */}
          <div className="border-t p-3">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={textareaRef}
                autoFocus
                placeholder="Ask about brands, approvals, pricing…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Need a person? Email{" "}
              <a className="underline" href="mailto:support@bndbox.com">
                support@bndbox.com
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
