import * as React from 'react';

interface VerifyEmailProps {
  link: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailProps>> = ({
  link,
}) => (
  <a href={link}>{link}</a>
);
