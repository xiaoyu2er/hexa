import { Button, Html } from '@react-email/components';

interface HelloProps {
  name: string;
}
export function Hello({ name }: HelloProps) {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        Hello {name}!
      </Button>
    </Html>
  );
}

Hello.PreviewProps = {
  name: 'Hexa',
} as HelloProps;
