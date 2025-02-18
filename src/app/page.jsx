"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ClipboardCopy, ClipboardCopyIcon, Loader2 } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function page() {
  const [message, setMessage] = useState("");
  const [reply] = useState("Bagaimana saya membantu anda hari ini😊");
  const [thingkingLoad, setThinkingLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [failed, setFailed] = useState(null);
  const [storedMessage, setStoreMessage] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  const getData = () => {
    const savedMessages = localStorage.getItem("message");
    if (savedMessages) {
      setStoreMessage(JSON.parse(savedMessages));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setThinkingLoad(true);
    setLoading(true);
    setError(null);
    setMessage("");

    if (!message) {
      setThinkingLoad(false);
      setLoading(false);
      setError("Masukkan teks pertanyaan sebelum kirim");
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: storedMessage }),
      });

      if (!response.ok) {
        throw new Error(`Ada kesalahan di HTTP ${response.status}`);
      }

      const data = await response.json();

      const newChatMessage = [
        ...storedMessage,
        { question: message, reply: data.reply },
      ];

      setMessage("");
      localStorage.setItem("message", JSON.stringify(newChatMessage));

      setStoreMessage(newChatMessage);
    } catch (error) {
      console.error(error);
      setFailed(error.message);
      setMessage("");
    }

    setThinkingLoad(false);
    setLoading(false);
    setMessage("");
  };

  const reset = () => {
    localStorage.removeItem("message");
    setStoreMessage([]);
    setMessage("");
  };

  const handleCopy = (index) => {
    const messageCopy = storedMessage[index].reply;
    setIsCopied(true);
    navigator.clipboard.writeText(messageCopy).then(() => {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <>
      <div className="p-10 pt-24 mb-64 md:mb-36 flex flex-col gap-3">
        {reply && (
          <div className="border p-4 rounded-lg">
            <p className="font-bold">{reply}</p>
          </div>
        )}
        {storedMessage.map((chat, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg flex flex-col gap-3"
          >
            <p className="font-bold">Pertanyaan:</p>
            <p>{chat.question}</p>
            <p className="font-bold mt-2">Balasan:</p>
            <pre className="whitespace-break-spaces">{chat.reply}</pre>
            <div>
              <Button onClick={() => handleCopy(index)}>
                <ClipboardCopyIcon />
              </Button>
            </div>
          </div>
        ))}

        {thingkingLoad && (
          <div className="flex gap-3">
            <Loader2 className="animate-spin" />{" "}
            <p>Tunggu sebentar lah bujang dan sis...</p>
          </div>
        )}

        {failed && <p className="text-red-500">{failed}</p>}
      </div>

      <form
        onSubmit={sendMessage}
        className="w-full flex flex-col gap-3 p-8 fixed bottom-0 dark:bg-neutral-950 bg-neutral-100"
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col md:flex-row gap-3">
          <Textarea
            value={message}
            onChange={handleChange}
            placeholder="Ketik tulisan disini..."
            className="h-24 dark:bg-neutral-950 bg-neutral-100"
          />
          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> <p>Kirim</p>
                </>
              ) : (
                <p>Kirim</p>
              )}
            </Button>
            <Button type="button" onClick={reset} disabled={loading}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
