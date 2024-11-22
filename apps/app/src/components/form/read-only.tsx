import { CopyButton } from '@hexa/ui/copy-button';
import { Input } from '@hexa/ui/input';

export function ReadOnly({ text }: { text: string }) {
  return (
    <>
      <Input type="text" readOnly value={text} className="w-full md:max-w-md" />
      <CopyButton className="relative right-9" value={text} />
    </>
  );
}
