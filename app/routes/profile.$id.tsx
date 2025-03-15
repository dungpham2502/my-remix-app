import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { User, findUser, deleteUser } from "users";
import { Form } from "@remix-run/react";

export const loader = async ({ params }: { params: { id: string } }) => {
  const user = await findUser(params.id);
  if (!user) {
    throw redirect("/");
  }
  return json(user);
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const userId = formData.get("userId");

  if (actionType === "delete" && userId) {
    deleteUser(userId as string);
    return redirect("/");
  }

  return null;
};

export default function Profile() {
  const user = useLoaderData<User>();
  const navigate = useNavigate();

  const handleClientSideLogout = (action: string) => {
    if (action === "logout") {
      localStorage.removeItem("userId");
      navigate("/");
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
        </p>
        <div className="mt-4 space-y-4">
          <Form method="post" onSubmit={() => handleClientSideLogout("logout")}>
            <input type="hidden" name="actionType" value="logout" />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Logout
            </button>
          </Form>
          <Form method="post">
            <input type="hidden" name="actionType" value="delete" />
            <input type="hidden" name="userId" value={user.id} />
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
