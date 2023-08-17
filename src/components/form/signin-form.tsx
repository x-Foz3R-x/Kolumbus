import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

import Checkbox from "@/components/ui/checkbox/checkbox";
import Icon from "@/components/icons";

import "@/components/form/input.css";

export default function SigninForm() {
  const { signin } = useAuth();

  const initialFormState = {
    email: "",
    password: "",
    isAgreeChecked: false,
    error: "",
  };

  const [form, setForm] = useState(initialFormState);

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signin(form.email, form.password, form.isAgreeChecked);
      router.push("/itinerary");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="relative flex flex-col">
      <input
        value={form.email}
        onChange={(e: any) => {
          setForm({
            ...form,
            ["email"]: e.target.value,
          });
        }}
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        autoCorrect="off"
        spellCheck="false"
        placeholder="E-mail"
        className="input input-top"
      />

      <input
        value={form.password}
        onChange={(e: any) => {
          setForm({
            ...form,
            ["password"]: e.target.value,
          });
        }}
        type="password"
        id="password"
        name="password"
        autoComplete="current-password"
        autoCorrect="off"
        spellCheck="false"
        placeholder="Password"
        className="input input-bot with-button"
      />

      <Checkbox formObject={form} setFormObject={setForm} formKey={"isChecked"}>
        Remember me
      </Checkbox>

      <button
        onClick={handleSubmit}
        className={
          "absolute bottom-14 right-2 z-20 h-7 w-7 rounded-full border " +
          (false ? "border-gray-800 " : "border-gray-300 ")
        }
      >
        <Icon.arrowRight className={"m-auto h-3 " + (false ? "fill-gray-800 " : "fill-gray-300 ")} />
      </button>
    </form>
  );
}
