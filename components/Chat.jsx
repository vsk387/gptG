"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { generateChatResponse } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";

/*flow of stuff:
recieve user input from form, on submitting it invokes handlesubmit function to the input (text),
in which you invoke mutate function (useMutation) on the input (text), in which you do mutationfn in which you put 
the message (text) into generatechatResponse which is in server action.js, where you console.log the input (text)
onto the terminal. yep. this is awesome. the data went from client to server just like that.
*/

const Chat = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { mutate, isPending, data } = useMutation({
    mutationFn: (query) => generateChatResponse([...messages, query]),

    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong...");
        return;
      }
      setMessages((prev) => [...prev, data]);
    },
    onError: (error) => {
      toast.error("Something went wrong...");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    mutate(query);
    setMessages((prev) => [...prev, query]);
    setText("");
  };

  return (
    <div className="min-h-[calc(6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }, index) => {
          const avatar = role == "user" ? "👤" : "🤖";
          const bcg = role == "user" ? "bg-base-200" : "bg-base-100";
          return (
            <div
              key={index}
              className={` ${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
            >
              <span className="mr-4 ">{avatar}</span>
              <p className="max-w-3xl">{content}</p>
            </div>
          );
        })}
        {isPending && <span className="loading"></span>}
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Type here!"
            className="input input-bordered join-item w-full"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn btn-primary join-item"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Just a sec..." : "Submit!"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Chat;
