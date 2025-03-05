import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { User, findUser } from "users";
import { Form } from "@remix-run/react";

export const loader = async ({ params }: { params: { id: string } }) => {
  const user = await findUser(params.id);
  if (!user) {
    throw redirect;
  }
  return json(user);
};

export default function Profile() {
  const user = useLoaderData<User>();

  const handleClientSideLogout = (action: string) => {
    if (action === "logout") {
      localStorage.removeItem("userId");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="mb-2">
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
          <Form method="post" onSubmit={() => handleClientSideLogout("logout")}>
            <input type="hidden" name="action" value="logout" />
            <button type="submit">Logout</button>
          </Form>
          <Form method="post" onSubmit={() => handleClientSideLogout("delete")}>
            <input type="hidden" name="delete" value="delete" />
            <button type="submit">Logout</button>
          </Form>
        </p>
      </div>
    </div>
  );
}
