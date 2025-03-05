import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { addUser, User } from "users";
import { v4 as uuidv4 } from "uuid";
import { findUserByEmailPassword } from "users";
import { useEffect } from "react";

type ActionData = {
  error?: string;
  user?: User;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) {
    return new Response("Invalid email or password", {
      status: 400,
    });
  }
  const newUser = {
    id: uuidv4(),
    name: name as string,
    email: email as string,
    password: password as string,
  };

  const existingUser = findUserByEmailPassword(
    email as string,
    password as string
  );
  const user = existingUser || newUser;

  if (!existingUser) {
    addUser(newUser);
  }

  return Response.json({ user }, { status: existingUser ? 200 : 201 });
};

export default function Index() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      navigate(`/profile/${storedUser}`);
    }

    if (actionData?.user) {
      localStorage.setItem("userId", actionData.user.id);
      navigate(`/profile/${actionData.user.id}`);
    }
  }, [actionData?.user, navigate]);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
