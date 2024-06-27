import { Button, Html } from "@react-email/components";
import React, {FC} from "react";

interface HelloProps {
  name: string;
}

export const Hello: FC<HelloProps> = ({name}) => {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Hello {name}!
      </Button>
    </Html>
  );
}

Hello.PreviewProps = {
  name: "Hexa",
} as HelloProps;


export default Hello;
