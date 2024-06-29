import { Loader2 } from "lucide-react";
import omit from "lodash/omit";

import { Button, ButtonProps } from "./ui/button";

export interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export function LoadingButton(props: LoadingButtonProps) {
  return (
    <Button
      {...omit(props, ["loading"])}
      disabled={props.loading || props.disabled}
    >
      {props.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {props.children}
    </Button>
  );
}
