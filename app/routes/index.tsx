import type { ActionFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { gql } from "graphql-request";
import { client } from "../lib/gql";

const signUp = gql`
  mutation UserSignUp($createUserInput: CreateUserInput!) {
    userSignUp(createUserInput: $createUserInput) {
      token
      user {
        id
        name
        bio
        username
        profileImageUrl
        emailVerified
        phoneVerified
        isFollower
        isFollowing
        phone
        email
        createdAt
      }
    }
  }
`;

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const vars = {
    createUserInput: {
      email: email,
      password: password,
    },
  };
  try {
    const res = await client.request(signUp, vars);
    return { status: "ok", res };
  } catch (e) {
    throw e;
  }
};

// component specific error boundaries
export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  const err = error.message.substring(0, error.message.indexOf("!"));
  return <p>Oh Snap! {err}</p>;
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Remix Sign Up to glue </h1>
      <Form method="post">
        <div>
          <input placeholder="Enter email address" type="email" name="email" />

          <input placeholder="Enter password" type="password" name="password" />

          {/* <input
            placeholder="Repeat password"
            type="password"
            name="password"
          /> */}
        </div>

        <button type="submit">Sign up</button>
      </Form>
    </div>
  );
}
